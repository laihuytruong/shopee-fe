import { ProductCart } from "./productInterface"

export interface UserCart {
    _id: string
    product: ProductCart
    quantity: number
    color: string
}
