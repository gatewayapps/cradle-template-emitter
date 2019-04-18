import { CradleSchema, IConsole, ICradleEmitter } from '@gatewayapps/cradle'
import EmitterOptions, { IEmitterOptions } from '@gatewayapps/cradle/dist/lib/EmitterOptions'
import * as fs from 'fs-extra'
import * as handlebars from 'handlebars'
import * as path from 'path'
import { ITemplateEmitterOptions } from './ITemplateEmitterOptions'

export class TemplateEmitter implements ICradleEmitter {
  public options: ITemplateEmitterOptions
  public console: IConsole
  public dataTypeMappings?: any
  public languageType?: string

  constructor(options: ITemplateEmitterOptions, console: IConsole) {
    this.options = options
    this.console = console
    this.dataTypeMappings = undefined
    this.languageType = ''
  }

  public async emitSchema(schema: CradleSchema) {
    try {
      if (!this.options) {
        throw new Error('Template emitter options are required')
      }

      const templateString = fs.readFileSync(this.options.sourcePath, {
        encoding: 'utf8'
      })

      if (!templateString || templateString === '') {
        throw new Error('There was a problem reading the template file')
      }

      this.registerHandlebarsHelperMethods()

      const fn = handlebars.compile(templateString)
      const outputFileFn = handlebars.compile(this.options.outputPath.split(path.sep).join('/'))

      // get language type based on output path file extension
      this.languageType = this.options.languageType || this.options.outputPath.substring(this.options.outputPath.lastIndexOf('.') + 1)

      // get data type mappings based on language type
      this.dataTypeMappings = require(`./mappings/${this.languageType}/mapping.js`)

      if (this.options.mode === 'schema') {
        const filesWritten = await this.doEmitSchema(schema, fn, outputFileFn)
        if (this.options.onFilesEmitted) {
          this.options.onFilesEmitted(filesWritten)
        }
      } else {
        const filesWritten = await this.doEmitModels(schema, fn, outputFileFn)
        if (this.options.onFilesEmitted) {
          this.options.onFilesEmitted(filesWritten)
        }
      }
    } catch (err) {
      console.log('Error')
      console.error(err)
      throw new Error(err)
    }
  }

  public formatDataContext(property: any) {
    if (!property) {
      return undefined
    }

    const context = {
      AllowNull: property.AllowNull,
      Autogenerate: property.Autogenerate,
      DefaultValue: this.mapDefaultValues(property.TypeName, property.DefaultValue),
      IsPrimaryKey: property.IsPrimaryKey,
      MaximumLength: property.MaximumLength,
      MaximumValue: property.MaximumValue,
      MemberType: this.formatDataContext(property.MemberType),
      Members: [],
      MinimumValue: property.MinimumValue,
      ModelName: property.ModelName,
      ModelType: this.formatDataContext(property.ModelType),
      OriginalTypeName: property.TypeName,
      TypeName: property.ModelName || this.mapDataTypes(property.TypeName),
      Unique: property.Unique
    }

    // handle formatting each member context if it exists
    if (property.Members) {
      for (const m in property.Members) {
        if (!property.Members.hasOwnProperty(m)) {
          continue
        }

        const member = this.formatDataContext(property.Members[m])
        member.Name = m

        context.Members.push(member)
      }
    }

    return context
  }

  public mapDataTypes(typeName: string): string {
    try {
      if (!this.dataTypeMappings) {
        return typeName
      }

      return this.dataTypeMappings.values[typeName].type || typeName
    } catch (err) {
      return typeName
    }
  }

  public mapDefaultValues(typeName: string, defaultValue: any) {
    try {
      if (!this.dataTypeMappings) { 
        return defaultValue
      }
      return this.dataTypeMappings.convertValue(typeName, defaultValue)
    } catch (err) {
      return defaultValue
    }
  }

  public registerHandlebarsHelperMethods() {
    handlebars.registerHelper('ifEquals', (arg1, arg2, options) => {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this)
    })

    handlebars.registerHelper('ifNotEquals', (arg1, arg2, options) => {
      return arg1 !== arg2 ? options.fn(this) : options.inverse(this)
    })

    handlebars.registerHelper('isArray', (arg1, options) => {
      return arg1 === 'Array' ? options.fn(this) : options.inverse(this)
    })

    handlebars.registerHelper('isNotArray', (arg1, options) => {
      return arg1 !== 'Array' ? options.fn(this) : options.inverse(this)
    })

    handlebars.registerHelper('isBaseDataType', (args, options) => {
      return args.TypeName !== 'Array' && !args.ModelName ? options.fn(this) : options.inverse(this)
    })

    handlebars.registerHelper('isObject', (args, options) => {
      return args.ModelName !== undefined ? options.fn(this) : options.inverse(this)
    })

    handlebars.registerHelper('toLowerCase', (str) => {
      return str.toLowerCase()
    })
    handlebars.registerHelper({
      eq: function (v1, v2) {
        return v1 === v2
      },
      ne: function (v1, v2) {
        return v1 !== v2
      },
      lt: function (v1, v2) {
        return v1 < v2
      },
      gt: function (v1, v2) {
        return v1 > v2
      },
      lte: function (v1, v2) {
        return v1 <= v2
      },
      gte: function (v1, v2) {
        return v1 >= v2
      },
      and: function () {
        return Array.prototype.slice.call(arguments).every(Boolean)
      },
      or: function () {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean)
      }
    })

    handlebars.registerHelper('getDistinctObjects', (context, options) => {
      const got: any = []

      function contains(obj, a) {
        for (const i of a) {
          if (obj.TypeName === 'Array' && i.TypeName === 'Array') {
            if (obj.MemberType.ModelName === i.MemberType.ModelName) {
              return true
            }
          } else if (obj.TypeName === 'Array' && i.TypeName !== 'Array') {
            if (obj.MemberType.ModelName === i.ModelName) {
              return true
            }
          } else if (obj.TypeName !== 'Array' && i.TypeName === 'Array') {
            if (obj.ModelName === i.MemberType.ModelName) {
              return true
            }
          }
        }
        return false
      }

      for (const c of context) {
        if (c.TypeName === 'Array' || c.ModelName !== undefined) {
          if (!contains(c, got)) {
            got.push(c)
          }
        }
      }
      return got
    })

    handlebars.registerHelper('getReferences', (context, options) => {
      const got: any = []

      if (Object.keys(context).length === 0) {
        return []
      }

      for (const c in context) {
        if (!context.hasOwnProperty(c)) {
          continue
        }

        context[c].Name = c
        got.push(context[c])
      }

      return got
    })

    handlebars.registerHelper('getDistinctForeignModels', (context, options) => {
      const got: any[] = []

      if (!context || Object.keys(context).length === 0) {
        return []
      }

      for (const c in context) {
        const ref = context[c]
        if (!ref.ForeignModel) {
          continue
        }
        if (got.indexOf(ref.ForeignModel) === -1) {
          got.push(ref.ForeignModel)
        }
      }

      return got
    })

    handlebars.registerHelper('getObjectProps', (context, options) => {
      const got: any = []

      if (!context) {
        return got
      }

      if (Object.keys(context).length === 0) {
        return []
      }

      for (const c in context) {
        if (!context.hasOwnProperty(c)) {
          continue
        }

        context[c].Name = c
        got.push(context[c])
      }

      return got
    })

    if (this.options && this.options.registerCustomHelpers) {
      this.options.registerCustomHelpers((name: string, fn: Handlebars.HelperDelegate) => {
        handlebars.registerHelper(name, fn)
      })
    }
  }
  public writeFileContents(filePath: string, content: string): boolean {
    const fileExists = fs.existsSync(filePath)

    if (fileExists) {
      if (!this.options || !this.options.overwriteExisting) {
        console.log('Overwrite rules state no overwriting of existing file:', filePath)
        return false
      }
    }

    fs.writeFileSync(filePath, content)
    if (this.options.onFileEmitted) {
      this.options.onFileEmitted(filePath)
    }
    return true
  }

  private async doEmitSchema(schema: CradleSchema, fn: (any) => any, outputFileFn: (any) => any) {
    let models: any = []
    models = schema.Models.filter((m) => {
      if (this.options && this.options.shouldEmit && {}.toString.call(this.options.shouldEmit) === '[object Function]') {
        const shouldEmit = this.options.shouldEmit(m)
        if (shouldEmit) {
          return m
        }
      } else {
        return m
      }
    })

    const s = new CradleSchema(models)
    const content = fn(s)

    const outputFullPath = path.resolve(process.cwd(), outputFileFn({}))
    const outDir = path.dirname(outputFullPath)
    const shouldReturnFile = await fs.ensureDir(outDir).then(() => {
      return this.writeFileContents(outputFullPath, content)
    })

    if (shouldReturnFile) {
      return [outputFullPath]
    } else {
      return []
    }
  }

  private async doEmitModels(schema: CradleSchema, fn: (any) => any, outputFileFn: (any) => any) {
    // for each schema model, create an object and pass into the dot template generated function
    const results: string[] = []
    await Promise.all(
      schema.Models.map(async (m) => {
        if (this.options && this.options.shouldEmit && {}.toString.call(this.options.shouldEmit) === '[object Function]') {
          const ignore = this.options.shouldEmit(m)
          if (!ignore) {
            return
          }
        }

        const props = {
          Meta: m.Meta,
          Name: m.Name,
          Operations: m.Operations,
          Properties: Object.keys(m.Properties).map((propertyName) => {
            return Object.assign({ Name: propertyName }, this.formatDataContext(m.Properties[propertyName]))
          }),
          References: m.References
        }

        const content = fn(props)

        const outputFullPath = path.resolve(process.cwd(), outputFileFn({ Name: m.Name }))
        const outDir = path.dirname(outputFullPath)

        const shouldAddFile = await fs.ensureDir(outDir).then(() => this.writeFileContents(outputFullPath, content))
        if (shouldAddFile) {
          results.push(outputFullPath)
        }
      })
    )
    return results
  }
}
