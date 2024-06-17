import { Product } from './productInterfaces'

export interface VariationOption {
    _id: string
    variationId: {
        _id: string
        category: string
        name: string
    }
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
    variationOptionId: VariationOption
}
