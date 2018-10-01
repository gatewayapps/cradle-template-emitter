import { CradleModel } from '@gatewayapps/cradle'

export interface ITemplateEmitterOptions {
    readonly sourcePath: string
    readonly outputPath: string
    readonly overwriteExisting: boolean
    readonly languageType: string
    readonly ignoreEmit: (meta: CradleModel) => boolean
}
