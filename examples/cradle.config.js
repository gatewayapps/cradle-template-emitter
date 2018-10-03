const cradle = require('@gatewayapps/cradle')
const path = require('path')

const loaderOptions = new cradle.LoaderOptions('spec', {
    source: './examples/specs/cradle-base.yaml'
}, console)

const emitterOpts = [
    new cradle.EmitterOptions('schemaTest', path.resolve(__dirname, '../dist/index.js'), {
        sourcePath: './examples/templates/schemaTest.handlebars',
        outputPath: './examples/server/test/schemaTest.ts',
        overwriteExisting: true,
        mode: 'schema',
        shouldEmit: (model) => {
            return model.Meta !== undefined && model.Meta.topLevel
        }
    }, console),
    new cradle.EmitterOptions('serverModels', path.resolve(__dirname, '../dist/index.js'), {
        sourcePath: './examples/templates/serverModel.handlebars',
        outputPath: './examples/server/models/{{Name}}.ts',
        overwriteExisting: true,
        languageType: 'mongoose',
        shouldEmit: (model) => {
            return model.Meta !== undefined && model.Meta.topLevel
        }
    }, console)
]

module.exports = new cradle.CradleConfig(loaderOptions, emitterOpts)
