import { ProductDetailData, User, VariationOption } from '~/models'

export interface Order {
    _id: string
    products: [
        {
            _id: string
            productDetail: ProductDetailData
            quantity: number
            variationOption: VariationOption
        }
    ]
    status: string
    orderBy: User
}
