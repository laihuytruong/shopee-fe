import { Brand } from './brandInterfaces'
import { Category } from './categoryInterfaces'

export interface ProductCart {
    _id: string
    productName: string
    price: number
    image: string[]
}

export interface Product {
    _id: string
    productName: string
    slug: string
    brand: Brand
    price: number
    categoryItem: Category
    quantity: number
    sold: number
    image: string[]
    totalRating: number
    discount: number
    rating: [
        {
            star: number
            votedBy: string
            comment: string
        }
    ]
}
