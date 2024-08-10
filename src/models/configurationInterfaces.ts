import { Category } from './categoryInterfaces'
import { Product } from './productInterfaces'

export interface Variation {
    _id: string
    categoryId: Category
    name: string
}

export interface VariationOption {
    _id: string
    variationId: Variation
    value: string
}

export interface Configuration {
    _id: string
    productDetailId: {
        _id: string
        image: string
        price: number
        inventory: number
        product: Product
    }
    variationOptionId: VariationOption[]
}
