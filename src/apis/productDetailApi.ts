import instance from '~/apiService'
import { ProductDetailData } from '~/models'
import { Cart } from '~/models/cartInterface'

interface ProductDetailsResponse {
    err: number
    msg?: string
    page?: number
    pageSize?: number
    totalCount?: number
    totalPage?: number
    data?: ProductDetailData[]
}

interface ProductDetailResponse {
    err: number
    msg?: string
    data?: ProductDetailData
}

const productDetailApi = {
    async getProductList(): Promise<ProductDetailResponse> {
        const url = '/product-detail'
        return instance.get(url)
    },
    async getProductDetail(
        slug: string,
        page: number,
        pageSize?: number
    ): Promise<ProductDetailsResponse> {
        const url = '/product-detail'
        const param = `/${slug}?page=${page}&pageSize=${pageSize}`
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
    async update(
        token: string,
        productDetailId: string,
        formData: FormData
    ): Promise<ProductDetailResponse> {
        const url = '/product-detail'
        const param = `/${productDetailId}`
        const headers = {
            Authorization: token,
        }
        return instance.put(url + param, formData, { headers })
    },
    async delete(
        token: string,
        productDetailId: string,
    ): Promise<ProductDetailResponse> {
        const url = '/product-detail'
        const param = `/${productDetailId}`
        const headers = {
            Authorization: token,
        }
        return instance.delete(url + param, { headers })
    },
}

export default productDetailApi
