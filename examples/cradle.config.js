const cradle = require('@gatewayapps/cradle')
const path = require('path')

const loaderOptions = new cradle.LoaderOptions('spec', {
    source: 'D:\\Source\\Repos\\rubicon-erp\\src\\cradle\\specs\\spec-base.yml'
}, console)

const emitterOpts = [
    new cradle.EmitterOptions('serverModels', path.resolve(__dirname, '../dist/index.js'), {
        sourcePath: 'D:\\Source\\Repos\\rubicon-erp\\src\\cradle\\templates\\serverModel.handlebars',
        outputPath: 'D:\\Source\\Repos\\rubicon-erp\\src\\server\\models\\{{Name}}.ts',
        overwriteExisting: true,
        languageType: 'mongoose',
        ignoreEmit: (model) => {
            return model.Meta === undefined || (model.Meta && !model.Meta.topLevel)
        }
    }, console),
    new cradle.EmitterOptions('serverServiceBase', path.resolve(__dirname, '../dist/index.js'), {
        sourcePath: 'D:\\Source\\Repos\\rubicon-erp\\src\\cradle\\templates\\serverServiceBase.handlebars',
        outputPath: 'D:\\Source\\Repos\\rubicon-erp\\src\\server\\services\\{{Name}}ServiceBase.ts',
        overwriteExisting: true,
        ignoreEmit: (model) => {
            return model.Meta === undefined || (model.Meta && !model.Meta.topLevel)
        }
    }, console),
    new cradle.EmitterOptions('serverServices', path.resolve(__dirname, '../dist/index.js'), {
        sourcePath: 'D:\\Source\\Repos\\rubicon-erp\\src\\cradle\\templates\\serverService.handlebars',
        outputPath: 'D:\\Source\\Repos\\rubicon-erp\\src\\server\\services\\{{Name}}Service.ts',
        overwriteExisting: true,
        ignoreEmit: (model) => {
            return model.Meta === undefined || (model.Meta && !model.Meta.topLevel)
        }
    }, console),
]

module.exports = new cradle.CradleConfig(loaderOptions, emitterOpts)
