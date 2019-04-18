export const values = {
    Boolean: {

        type: 'boolean',
    },
    DateTime: {

        type: 'Date',
    },
    Decimal: {

        type: 'number'
    },
    Integer: {

        type: 'number',
    },
    String: {

        type: 'string',
    },
    Binary: {
        type: 'Buffer'
    },
    UniqueIdentifier: {
        defaultValue: 'Sequelize.UUIDV4',
        type: 'string'
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
