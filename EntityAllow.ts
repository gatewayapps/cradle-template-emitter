import { List, Record } from 'immutable'














export interface IEntityAllow {
    
    
    
    readonly authenticatorId: string
    
    
    
    
    
    readonly name: string
    
    
    
    
    
    readonly type: string
    
    
    
    
    
    readonly value: string
    
    
    
    
    
    readonly hasChanged: boolean
    
    
    
    
    
    readonly isAdded: boolean
    
    
    
}

const EntityAllowRecord = Record({
    
    
    authenticatorId: '',
    
    
    
    name: '',
    
    
    
    type: '',
    
    
    
    value: '',
    
    
    
    hasChanged: false,
    
    
    
    isAdded: false,
    
    
})

export class EntityAllow extends EntityAllowRecord implements IEntityAllow {
    public static fromJS(initialState?: Partial<IEntityAllow>) {
        return new EntityAllow(initialState)
    }
    
    
    
    public readonly authenticatorId: string
    
    
    
    
    
    public readonly name: string
    
    
    
    
    
    public readonly type: string
    
    
    
    
    
    public readonly value: string
    
    
    
    
    
    public readonly hasChanged: boolean
    
    
    
    
    
    public readonly isAdded: boolean
    
    
    
    constructor(initialState?: Partial<EntityAllow>) {
        initialState ? super(initialState) : super()
    }
}
