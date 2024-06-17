import instance from '~/apiService'
import { ProductDetailData } from '~/models'

interface ProductResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: ProductDetailData[]
}

const productDetailApi = {
    async getProductDetail(slug: string): Promise<ProductResponse> {
        const url = '/product-detail'
        const param = `/${slug}`
        return instance.get(url + param)
    },
}

export default productDetailApi
