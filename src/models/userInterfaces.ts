import { ProductCart } from "./productInterfaces"

export interface UserCart {
    _id: string
    product: ProductCart
    quantity: number
    color: string
}
