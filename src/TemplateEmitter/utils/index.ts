import path from 'path'

export function getLanguageType(languageType: string, outputPath: string): string {
  if (!languageType && !path.basename) {
    return ''
  }

  return languageType || path.extname(outputPath).substring(path.extname(outputPath).lastIndexOf('.') + 1)
}

export function mapDataTypes(typename: string, dataTypeMappings: any) {
  try {
    if (!dataTypeMappings) {
      return typename
    }

    return dataTypeMappings.values[typename].type || typename
  } catch (err) {
    return typename
  }
}

export function mapDefaultValues(typeName: string, defaultValue: any, dataTypeMappings: any) {
  try {
    if (!dataTypeMappings) {
      return defaultValue
    }
    return dataTypeMappings.convertValue(typeName, defaultValue)
  } catch (err) {
    return defaultValue
  }
}

export function registerHandlebarsHelperMethods(h: any, name: string, fn: (...args: any[]) => void) {
  h.registerHelper(name, fn)
}
