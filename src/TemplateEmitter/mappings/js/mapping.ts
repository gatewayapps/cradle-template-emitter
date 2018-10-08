export const values = {
    Boolean: {

        type: 'Boolean',
    },
    DateTime: {

        type: 'Date',
    },
    Decimal: {

        type: 'Number'
    },
    Integer: {

        type: 'Number',
    },
    String: {

        type: 'String',
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
        default: return input
    }
}
