export const values = {
  Boolean: {
    type: 'boolean'
  },
  DateTime: {
    type: 'Date'
  },
  Decimal: {
    type: 'number'
  },
  Integer: {
    type: 'number'
  },
  String: {
    type: 'string'
  }
}

export function convertValue(typeName: string, input: any): any {
  switch (typeName) {
    case 'DateTime': {
      if (input === 'DateTimeNow') {
        return 'new Date()'
      } else {
        return `new Date('${(input as Date).toISOString()}')`
      }
    }
    default:
      return input
  }
}
