export const values = {
  Boolean : {
      type: 'BOOLEAN',
  },
  DateTime: {
      type: 'DATE',
  },
  Decimal: {
      type: 'DECIMAL'
  },
  Integer: {
      type: 'INTEGER',
  },
  String : {
      type: 'STRING',
  },
  UniqueIdentifier: {
    defaultValue: 'Sequelize.UUIDV4',
    type: 'UUID'
  },
  Binary: {
    type: 'BLOB'
  }
}

export function convertValue(typeName: string, input: any): any {
  switch (typeName) {
    case 'UniqueIdentifier': {
      return 'Sequelize.UUIDV4'
    }
    case 'DateTime': {
      if (input === 'DateTimeNow') {
        return 'Sequelize.NOW'
      } else {
        return `new Date('${(input as Date).toISOString()}')`
      }
    }
    default: return input
  }
}
