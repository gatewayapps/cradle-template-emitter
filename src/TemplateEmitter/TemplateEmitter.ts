import { CradleSchema, IConsole, ICradleEmitter } from '@gatewayapps/cradle'
import EmitterOptions, { IEmitterOptions } from '@gatewayapps/cradle/dist/lib/EmitterOptions'
import * as fs from 'fs-extra'
import * as handlebars from 'handlebars'
import * as path from 'path'
import { ITemplateEmitterOptions } from './ITemplateEmitterOptions'

export class TemplateEmitter implements ICradleEmitter {
    public config?: EmitterOptions<ITemplateEmitterOptions>
    public console?: IConsole
    public dataTypeMappings?: any
    public languageType?: string

    public prepareEmitter(options: IEmitterOptions, console: IConsole) {
        this.config = options
        this.console = console
        this.dataTypeMappings = undefined
        this.languageType = ''
    }

    public emitSchema(schema: CradleSchema) {
        try {
            if (!this.config || !this.config.options) {
                throw new Error('Template emitter options are required')
            }

            const templateString = fs.readFileSync(this.config.options.sourcePath, {encoding: 'utf8'})

            if (!templateString || templateString === '') {
                throw new Error('There was a problem reading the template file')
            }

            this.registerHandlebarsHelperMethods()

            const fn = handlebars.compile(templateString)
            const outputFileFn = handlebars.compile(this.config.options.outputPath.split(path.sep).join('/'))

            // get language type based on output path file extension
            this.languageType = this.config.options.languageType || this.config.options.outputPath.substring(this.config.options.outputPath.lastIndexOf('.') + 1)

            // get data type mappings based on language type
            this.dataTypeMappings = require(`./mappings/${this.languageType}/mapping.js`)

            // for each schema model, create an object and pass into the dot template generated function
            schema.Models.map((m) => {
                if (this.config && this.config.options.shouldEmit && {}.toString.call(this.config.options.shouldEmit) === '[object Function]') {
                    const ignore = this.config.options.shouldEmit(m)
                    if (!ignore) {
                        return
                    }
                }

                const props = {
                    Meta: m.Meta,
                    Name: m.Name,
                    Properties: Object.keys(m.Properties).map((propertyName) => {
                        return Object.assign({Name: propertyName}, this.formatDataContext(m.Properties[propertyName]))
                    }),
                    References: m.References
                }

                const content = fn(props)

                const outputFullPath = path.resolve(process.cwd(), outputFileFn({ Name: m.Name }))
                const outDir = path.dirname(outputFullPath)

                fs.ensureDir(outDir).then(() => {
                    const fileExists = fs.existsSync(outputFullPath)

                    if (fileExists) {
                        if (!this.config || !this.config.options.overwriteExisting) {
                            console.log('Overwrite rules state no overwriting of existing file:', outputFullPath)
                            return
                        }
                    }

                    fs.writeFileSync(outputFullPath, content)
                })
            })

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
            DefaultValue: this.mapDefaultValues(property.TypeName, property.DefaultValue),
            IsPrimaryKey: property.IsPrimaryKey,
            MemberType: this.formatDataContext(property.MemberType),
            Members: [],
            ModelName: property.ModelName,
            ModelType: this.formatDataContext(property.ModelType),
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

            return this.dataTypeMappings.values[typeName].defaultValue !== undefined ? this.dataTypeMappings.values[typeName].defaultValue : typeName
        } catch (err) {
            return typeName
        }
    }

    public registerHandlebarsHelperMethods() {
        handlebars.registerHelper('ifEquals', (arg1, arg2, options) => {
            return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
        })

        handlebars.registerHelper('ifNotEquals', (arg1, arg2, options) => {
            return (arg1 !== arg2) ? options.fn(this) : options.inverse(this)
        })

        handlebars.registerHelper('isArray', (arg1, options) => {
            return (arg1 === 'Array') ? options.fn(this) : options.inverse(this)
        })

        handlebars.registerHelper('isNotArray', (arg1, options) => {
            return (arg1 !== 'Array') ? options.fn(this) : options.inverse(this)
        })

        handlebars.registerHelper('isBaseDataType', (args, options) => {
            return (args.TypeName !== 'Array' && !args.ModelName) ? options.fn(this) : options.inverse(this)
        })

        handlebars.registerHelper('isObject', (args, options) => {
            return (args.ModelName !== undefined) ? options.fn(this) : options.inverse(this)
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
    }
}
