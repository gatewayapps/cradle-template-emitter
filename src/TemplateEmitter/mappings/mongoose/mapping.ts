export const values = {
    Boolean: {

        type: 'Schema.Types.Boolean',
    },
    DateTime: {

        type: 'Schema.Types.Date',
    },
    Decimal: {

        type: 'Schema.Types.Number'
    },
    Integer: {

        type: 'Schema.Types.Number',
    },
    String: {

        type: 'Schema.Types.String',
    }
}

export function convertValue(typeName: string, input: any): any {
    switch (typeName) {
        case 'DateTime': {
            if (input === 'DateTimeNow') {
                return 'Date.now'
            } else {
                return `new Date('${(input as Date).toISOString()}')`
            }
        }
        default: return input
    }
}
