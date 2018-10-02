import { List, Record } from 'immutable'


















export interface IUserPermissions {
    
    
    
    readonly isAdmin: boolean
    
    
    
    
    
    readonly isBrokerageUser: boolean
    
    
    
    
    
    readonly isDevelopmentUser: boolean
    
    
    
    
    
    readonly isGuest: boolean
    
    
    
    
    
    readonly accessAllPipelines: boolean
    
    
    
    
    
    readonly editFeeDistribution: boolean
    
    
    
    
    
    readonly setFeaturedListing: boolean
    
    
    
    
    
    readonly specialPermissions: boolean
    
    
    
}

const UserPermissionsRecord = Record({
    
    
    isAdmin: false,
    
    
    
    isBrokerageUser: false,
    
    
    
    isDevelopmentUser: false,
    
    
    
    isGuest: false,
    
    
    
    accessAllPipelines: false,
    
    
    
    editFeeDistribution: false,
    
    
    
    setFeaturedListing: false,
    
    
    
    specialPermissions: false,
    
    
})

export class UserPermissions extends UserPermissionsRecord implements IUserPermissions {
    public static fromJS(initialState?: Partial<IUserPermissions>) {
        return new UserPermissions(initialState)
    }
    
    
    
    public readonly isAdmin: boolean
    
    
    
    
    
    public readonly isBrokerageUser: boolean
    
    
    
    
    
    public readonly isDevelopmentUser: boolean
    
    
    
    
    
    public readonly isGuest: boolean
    
    
    
    
    
    public readonly accessAllPipelines: boolean
    
    
    
    
    
    public readonly editFeeDistribution: boolean
    
    
    
    
    
    public readonly setFeaturedListing: boolean
    
    
    
    
    
    public readonly specialPermissions: boolean
    
    
    
    constructor(initialState?: Partial<UserPermissions>) {
        initialState ? super(initialState) : super()
    }
}
