const cradle = require('@gatewayapps/cradle')
const path = require('path')

const loaderOptions = new cradle.LoaderOptions('spec', {
    source: 'examples/specs/cradle-base.yaml'
}, console)

const emitterOpts = [
    new cradle.EmitterOptions('serverModel', path.resolve(__dirname, '../dist/index.js'), {
        sourcePath: './examples/templates/serverModel.handlebars',
        outputPath: 'D:\\Source\\Repos\\test-cradle\\output\\{{Name}}.ts',
        overwriteExisting: true
    }, console)
]

module.exports = new cradle.CradleConfig(loaderOptions, emitterOpts)
