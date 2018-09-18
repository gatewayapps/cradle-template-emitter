import { CradleSchema, IConsole, ICradleEmitter } from '@gatewayapps/cradle'
import EmitterOptions, { IEmitterOptions } from '@gatewayapps/cradle/dist/lib/EmitterOptions'
import * as fs from 'fs'
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
            this.languageType = this.config.options.outputPath.substring(this.config.options.outputPath.lastIndexOf('.') + 1)

            // get data type mappings based on language type
            this.dataTypeMappings = require(`./mappings/${this.languageType}/mapping.js`)

            // for each schema model, create an object and pass into the dot template generated function
            schema.Models.map((m) => {
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
                const outputPath = path.dirname(outputFullPath)

                if (!fs.existsSync(outputPath)) {
                    fs.mkdirSync(outputPath)
                }

                fs.writeFileSync(outputFullPath, content)
            })

        } catch (err) {
            console.log('Error')
            console.error(err)
            throw new Error(err)
        }
    }

    public formatDataContext(property: any) {
        return {
            AllowNull: property.AllowNull,
            DefaultValue: this.mapDefaultValues(property.TypeName, property.DefaultValue),
            IsPrimaryKey: property.IsPrimaryKey,
            MemberType: property.MemberType,
            ModelName: property.ModelName,
            TypeName: property.ModelName || this.mapDataTypes(property.TypeName),
            Unique: property.Unique
        }
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
    }
}
