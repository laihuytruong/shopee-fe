import instance from '~/apiService'
import { Product } from '~/models/productInterfaces'

interface ProductsResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: {
        page: number
        pageSize: number
        totalPage: number
        data: Product[]
    }
}

interface ProductResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: Product
}

const productApi = {
    async getProducts(
        page: number = 1,
        limit?: number,
        productName?: string
    ): Promise<ProductsResponse> {
        const url = '/products'
        const param = `?page=${page}&limit=${limit ? limit : 10}${
            productName ? `&productName=${productName}` : ''
        }`
        return instance.get(url + param)
    },

    async getProduct(slug: string): Promise<ProductResponse> {
        const url = '/products'
        const param = `/${slug}`
        return instance.get(url + param)
    },

    async filterProduct(
        slug: string | undefined,
        page: number = 1,
        limit: number = 10,
        sort?: string,
        totalRating?: number,
        price?: string,
        brand?: string,
        categoryItem?: string
    ): Promise<ProductsResponse> {
        const url = '/products/category'
        const param = `/${slug}?page=${page}&limit=${
            limit ? limit : 10
        }&sort=${sort}${
            totalRating && totalRating > 0 ? `&totalRating=${totalRating}` : ''
        }${price ? `&price=${price}` : ''}${brand ? `&brand=${brand}` : ''}${
            categoryItem ? `&categoryItem=${categoryItem}` : ''
        }`
        return instance.get(url + param)
    },
}

export default productApi
