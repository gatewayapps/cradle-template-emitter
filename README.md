# Cradle Template Emitter - A Cradle Emitter   
## What is Cradle Template Emitter?
The Cradle Template Emitter is an Emitter plugin for Cradle that accepts the Cradle schema and uses Handlebars templates in order to output a desired result. This can be anything from code files to documentation, from unit tests to configuration files.

[Getting Started](#getting-started)   
[Configuration](#configuration)   
[Templates](#templates)   
[Executing the emitter](#executing-the-emitter)   
[Emitter options](#emitter-options)   
[Provided Handlebars Helper Functions](#provided-handlebars-helper-functions)

## Getting Started
To get started, first install Cradle in your local project folder: `npm i --save-dev @gatewayapps/cradle`.    
Next, install the Cradle Template Emitter: `npm i --save-dev @gatewayapps/cradle-template-emitter`.

## Configuration
Please see the [Cradle ReadMe](https://github.com/gatewayapps/cradle/blob/master/README.md) for general information about the Cradle configuration file.

To add an emitter, inside the configuration file:
```
const emitterOpts = [
 new cradle.EmitterOptions(
    'newEmitter',
    '@gatewayapps/cradle-template-emitter',
    {
      sourcePath: './cradle/templates/template1.handlebars',
      outputPath: './src/server/output.ts',
      overwriteExisting: true,
    },
    console
  ),
]
```

Then, at the end of the configuration file, make sure `emitterOpts` is passed in as the second argument for initializing `CradleConfig`:
```
module.exports = new cradle.CradleConfig(loaderOptions, emitterOpts)
```

## Templates
The template emitter uses [Handlebars](https://handlebarsjs.com/) for the template engine. Refer to the Handlebars website for questions regarding syntax.

## Executing the emitter
Run the emitter using the `emit` command from Cradle: `npx cradle emit -c cradle.config.js -e newEmitter`. The `-e` argument can be omitted if multiple emitters are configured and should be run simultaneously

## Emitter options
- `sourcePath[string]`: The path of the handlebars template file
- `outputPath[string]`: The path of the output. If the directory path does not exist, it will be created during execution
- `overwriteExisting[bool]`:  defaults to `true`. If `true`, the file should be overridden on each execution. If `false` the file will not be overridden if it already exists.
- `mode[string]`: defaults to `model`. If `schema`, the template emitter will provide the raw Cradle schema. If `model`, the template emitter will provide a model based schema. `schema` is particularly useful if writing to a single file. `model` is more useful if writing separate files per Model.
- `languageType[string]`: Specify the language type to output. Currently, `mongoose`, `js`, `ts` and `sequelize` are the only accepted values.
- `registerCustomHelpers[Function]`: Returns a `registerHelper` which accepts a name and a Handlebars function. A function that can be used to add custom Handlebars based helpers to aid in writing templates. 
- `shouldEmit[Function]`: A function that returns a `CradleModel` that can be used to determine whether a Model should be emitted
- `onFileEmitted[Function]`: Returns the file path as a string. A function that executes after a file is emitted. This can be useful for linting
- `onFilesEmitted[Function]`: Returns an array of file paths as a string. A function that executes after _all_ files have been emitted. This can be useful for linting

## Provided Handlebars Helper Functions
The template emitter provides a set of custom helper functions out of the box. As stated above, custom helper methods can be defined in the Cradle configuration file. See below for the helper methods and a simple example.

- `ifEquals`: ```{{#ifEquals 1 1}}Equals!{{/ifEquals}}```
- `ifNotEquals`: ```{{#ifNotEquals 1 2}}Does not equal!{{/ifNotEquals}}```
- `toLowerCase`: ```{{toLowerCase "HELLO WORLD"}} // outputs hello world```
- `isArray`: ```{{#isArray TypeName}}I'm an array!{{/isArray}}```
- `isNotArray`: ```{{#isNotArray TypeName}}I'm not an array!{{/isNotArray}}```
- `isBaseDataType`: ```{{#isBaseDataType prop}}I'm a base/primitive data type{{/isBaseDataType}}```
- `isObject`: ```{{#isObject prop}}I'm an object!{{/isObject}}```
- `getDistinctObjects`: ```{{#each (getDistinctObjects Properties) as |p|}}{{p.TypeName}}{{/each}}```
- `getReferences`: ```{{#each (getReferences References) as |ref|}}{{ref.Name}}{{/each}}```
- `getDistinctForeignModels`: ```{{#each (getDistinctForeignModels References) as |ref|}}{{ref.Name}}{{/each}}```
