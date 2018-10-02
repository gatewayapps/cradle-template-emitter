import { List, Record } from 'immutable'


import {Iundefined, undefined} from './undefined'











import {Iundefined, undefined} from './undefined'













export interface IUser {
    
    
    
    readonly allowedAccessTo: List<Iundefined>
    
    
    
    
    
    readonly confirmPassword: string
    
    
    
    
    
    readonly id: string
    
    
    
    
    
    readonly firstName: string
    
    
    
    
    
    readonly lastName: string
    
    
    
    
    
    readonly memberOf: List<Iundefined>
    
    
    
    
    
    readonly status: string
    
    
    
    
    
    readonly title?: string
    
    
    
    
    
    readonly username: string
    
    
    
    
    
    readonly password: string
    
    
    
    
    
    readonly permissions: Object
    
    
    
}

const UserRecord = Record({
    
    
    allowedAccessTo: List<undefined>(),
    
    
    
    confirmPassword: '',
    
    
    
    id: '',
    
    
    
    firstName: '',
    
    
    
    lastName: '',
    
    
    
    memberOf: List<undefined>(),
    
    
    
    status: '',
    
    
    
    title: '',
    
    
    
    username: '',
    
    
    
    password: '',
    
    
    
    permissions: Object,
    
    
})

export class User extends UserRecord implements IUser {
    public static fromJS(initialState?: Partial<IUser>) {
        return new User(initialState)
    }
    
    
    
    public readonly allowedAccessTo: List<undefined>
    
    
    
    
    
    public readonly confirmPassword: string
    
    
    
    
    
    public readonly id: string
    
    
    
    
    
    public readonly firstName: string
    
    
    
    
    
    public readonly lastName: string
    
    
    
    
    
    public readonly memberOf: List<undefined>
    
    
    
    
    
    public readonly status: string
    
    
    
    
    
    public readonly title?: string
    
    
    
    
    
    public readonly username: string
    
    
    
    
    
    public readonly password: string
    
    
    
    
    
    public readonly permissions: Object
    
    
    
    constructor(initialState?: Partial<User>) {
        initialState ? super(initialState) : super()
    }
}
