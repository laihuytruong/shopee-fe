import { Product } from './productInterfaces'

export interface Cart {
    _id: string
    product: Product[]
    quantity: number
    color: string
}
