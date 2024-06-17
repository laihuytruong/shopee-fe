import { Role } from '~/models'
import { Cart } from './cartInterface'

export interface User {
    _id: string
    name: string
    email: string
    username: string
    password: string
    phoneNumber: string
    sex: string
    dateOfBirth: Date
    address: string
    avatar: string
    isBlocked: boolean
    role: Role
    cart: Cart[]
    createdAt: Date
    updatedAt: Date
}
