import { List, Record } from 'immutable'






export interface IArea {
    
    
    
    readonly lotSize: number
    
    
    
    
    
    readonly units: string
    
    
    
}

const AreaRecord = Record({
    
    
    lotSize: 0,
    
    
    
    units: '',
    
    
})

export class Area extends AreaRecord implements IArea {
    public static fromJS(initialState?: Partial<IArea>) {
        return new Area(initialState)
    }
    
    
    
    public readonly lotSize: number
    
    
    
    
    
    public readonly units: string
    
    
    
    constructor(initialState?: Partial<Area>) {
        initialState ? super(initialState) : super()
    }
}
