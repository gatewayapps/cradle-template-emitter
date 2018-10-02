import { List, Record } from 'immutable'








export interface IActivityFeedItem {
    
    
    
    readonly dateCreated: number
    
    
    
    
    
    readonly id: string
    
    
    
    
    
    readonly lastActivityTime: number
    
    
    
}

const ActivityFeedItemRecord = Record({
    
    
    dateCreated: 0,
    
    
    
    id: '',
    
    
    
    lastActivityTime: 0,
    
    
})

export class ActivityFeedItem extends ActivityFeedItemRecord implements IActivityFeedItem {
    public static fromJS(initialState?: Partial<IActivityFeedItem>) {
        return new ActivityFeedItem(initialState)
    }
    
    
    
    public readonly dateCreated: number
    
    
    
    
    
    public readonly id: string
    
    
    
    
    
    public readonly lastActivityTime: number
    
    
    
    constructor(initialState?: Partial<ActivityFeedItem>) {
        initialState ? super(initialState) : super()
    }
}
