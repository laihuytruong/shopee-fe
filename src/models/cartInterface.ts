import { ProductDetailData, VariationOption } from '~/models'

export interface Cart {
    _id: string
    productDetail: ProductDetailData
    quantity: number
    variationOption: VariationOption[]
}
