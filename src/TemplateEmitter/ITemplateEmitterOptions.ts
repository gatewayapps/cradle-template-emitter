import { CradleModel } from '@gatewayapps/cradle'
import { HelperDelegate } from 'handlebars'

export interface ITemplateEmitterOptions {
    readonly sourcePath: string
    readonly outputPath: string
    readonly overwriteExisting: boolean
    readonly mode: string
    readonly languageType: string
    readonly registerCustomHelpers?: (register: (name: string, fn: HelperDelegate) => void) => void
    readonly shouldEmit: (meta: CradleModel) => boolean
    readonly onFileEmitted: (path: string) => any
    readonly onFilesEmitted: (paths: string[]) => any
}
