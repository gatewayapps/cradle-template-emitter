import { List, Record } from 'immutable'






export interface IMembership {
    
    
    
    readonly authenticatorId: string
    
    
    
    
    
    readonly type: string
    
    
    
}

const MembershipRecord = Record({
    
    
    authenticatorId: '',
    
    
    
    type: '',
    
    
})

export class Membership extends MembershipRecord implements IMembership {
    public static fromJS(initialState?: Partial<IMembership>) {
        return new Membership(initialState)
    }
    
    
    
    public readonly authenticatorId: string
    
    
    
    
    
    public readonly type: string
    
    
    
    constructor(initialState?: Partial<Membership>) {
        initialState ? super(initialState) : super()
    }
}
