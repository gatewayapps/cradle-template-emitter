import { CradleSchema, IConsole, ICradleEmitter } from '@gatewayapps/cradle'
import { IEmitterOptions } from '@gatewayapps/cradle/dist/lib/EmitterOptions'
import * as dot from 'dot'
import * as fs from 'fs'

export class TemplateEmitter implements ICradleEmitter {
    public prepareEmitter(options: IEmitterOptions, console: IConsole) {
        try {
            // get the template path
            const templateFilePath = `${options.options.sourcePath}/${options.name}.dot`

            // read template in as string
            fs.readFile(templateFilePath, {encoding: 'utf8'}, (err: NodeJS.ErrnoException, data: string) => {
                if (err) {
                    console.error(err)
                    throw new Error(err.message)
                }

                const obj = {
                    age: 102,
                    name: 'Steve Sipa',
                }

                // execute dot method to compile
                const fn = dot.template(data, undefined, undefined)

                // execute resulting method to get content
                const content = fn(obj)

                console.log(content)
            })

        } catch (err) {
            console.log('Error')
            console.error(err)
            throw new Error(err)
        }
    }

    public emitSchema(schema: CradleSchema) {

    }
}
