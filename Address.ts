import { List, Record } from 'immutable'






















export interface IAddress {
    
    
    
    readonly addressIndex: number
    
    
    
    
    
    readonly attention: string
    
    
    
    
    
    readonly city: string
    
    
    
    
    
    readonly line1: string
    
    
    
    
    
    readonly line2: string
    
    
    
    
    
    readonly placeFIPS: string
    
    
    
    
    
    readonly state: string
    
    
    
    
    
    readonly stateFIPS: string
    
    
    
    
    
    readonly type: string
    
    
    
    
    
    readonly zip: string
    
    
    
}

const AddressRecord = Record({
    
    
    addressIndex: 0,
    
    
    
    attention: '',
    
    
    
    city: '',
    
    
    
    line1: '',
    
    
    
    line2: '',
    
    
    
    placeFIPS: '',
    
    
    
    state: '',
    
    
    
    stateFIPS: '',
    
    
    
    type: '',
    
    
    
    zip: '',
    
    
})

export class Address extends AddressRecord implements IAddress {
    public static fromJS(initialState?: Partial<IAddress>) {
        return new Address(initialState)
    }
    
    
    
    public readonly addressIndex: number
    
    
    
    
    
    public readonly attention: string
    
    
    
    
    
    public readonly city: string
    
    
    
    
    
    public readonly line1: string
    
    
    
    
    
    public readonly line2: string
    
    
    
    
    
    public readonly placeFIPS: string
    
    
    
    
    
    public readonly state: string
    
    
    
    
    
    public readonly stateFIPS: string
    
    
    
    
    
    public readonly type: string
    
    
    
    
    
    public readonly zip: string
    
    
    
    constructor(initialState?: Partial<Address>) {
        initialState ? super(initialState) : super()
    }
}
