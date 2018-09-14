import { CradleSchema, IConsole, ICradleEmitter } from '@gatewayapps/cradle'
import EmitterOptions, { IEmitterOptions } from '@gatewayapps/cradle/dist/lib/EmitterOptions'
import PropertyType from '@gatewayapps/cradle/dist/lib/PropertyTypes/PropertyType'
import * as dot from 'dot'
import * as fs from 'fs'
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

            console.log(schema)

            // do not strip whitespace
            const templateOpts = dot.templateSettings
            templateOpts.strip = false

            const fn = dot.template(templateString, templateOpts, undefined)
            const outputFileFn = dot.template(this.config.options.outputPath, undefined, undefined)

            // get language type based on output path file extension
            this.languageType = this.config.options.outputPath.substring(this.config.options.outputPath.lastIndexOf('.') + 1)

            // get data type mappings based on language type
            this.dataTypeMappings = require(`./mappings/${this.languageType}/mapping.js`)

            // for each schema model, create an object and pass into the dot template generated function
            schema.Models.map((m) => {
                console.log(m.Properties)
                const props = {
                    Meta: m.Meta,
                    Name: m.Name,
                    Properties: Object.keys(m.Properties).map((propertyName) => {
                        return Object.assign({Name: propertyName}, this.formatDataContext(m.Properties[propertyName]))
                    }),
                    References: m.References
                }

                const content = fn(props)
                const outputFullPath = outputFileFn({Name: m.Name})
                const ouptputPath = outputFullPath.substring(0, outputFullPath.lastIndexOf('\\'))

                if (!fs.existsSync(ouptputPath)) {
                    fs.mkdirSync(ouptputPath)
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
            console.error(err)
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
            console.error(err)
            return typeName
        }
    }
}
