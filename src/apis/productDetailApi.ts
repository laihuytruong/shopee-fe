import instance from '~/apiService'
import { Product, ProductDetailData } from '~/models'
import { Cart } from '~/models/cartInterface'

interface ProductResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: Product
}

const productDetailApi = {
    async getProductList(): Promise<ProductResponse> {
        const url = '/product-detail'
        return instance.get(url)
    },
    async getProductDetail(slug: string): Promise<ProductResponse> {
        const url = '/product-detail'
        const param = `/${slug}`
        return instance.get(url + param)
    },
    async updateInventory(
        cart: Cart[],
        token: string
    ): Promise<ProductResponse> {
        const url = '/product-detail/update-inventory'
        const headers = {
            Authorization: token,
        }
        return instance.put(url, { cart }, { headers })
    },
}

export default productDetailApi
