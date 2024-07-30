import instance from '~/apiService'
import { ProductDetailData } from '~/models'
import { Cart } from '~/models/cartInterface'

interface ProductDetailResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: ProductDetailData
}

const productDetailApi = {
    async getProductList(): Promise<ProductDetailResponse> {
        const url = '/product-detail'
        return instance.get(url)
    },
    async getProductDetail(slug: string): Promise<ProductDetailResponse> {
        const url = '/product-detail'
        const param = `/${slug}`
        return instance.get(url + param)
    },
    async updateInventory(
        cart: Cart[],
        token: string
    ): Promise<ProductDetailResponse> {
        const url = '/product-detail/update-inventory'
        const headers = {
            Authorization: token,
        }
        return instance.put(url, { cart }, { headers })
    },
    async create(
        token: string,
        formData: FormData
    ): Promise<ProductDetailResponse> {
        const url = '/product-detail'
        const headers = {
            Authorization: token,
        }
        return instance.post(url, formData, { headers })
    },
}

export default productDetailApi
