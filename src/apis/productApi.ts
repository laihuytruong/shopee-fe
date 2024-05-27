import instance from '~/apiService'
import { Product } from '~/models/productInterfaces'

interface ProductResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: {
        page: number
        pageSize: number
        data: Product[]
    }
}

const productApi = {
    async getProducts(
        page: number = 1,
        limit?: number
    ): Promise<ProductResponse> {
        const url = '/products'
        const param = `/?page=${page}&limit=${limit ? limit : 10}`
        return instance.get(url + param)
    },
    async getProductBySlug(
        slug: string | undefined,
        page: number = 1,
        limit: number = 2,
        sort?: string,
        minPrice?: number,
        maxPrice?: number,
        totalRating?: number
    ): Promise<ProductResponse> {
        console.log('sort: ', sort)
        const url = '/products/category-item'
        const param = `/${slug}?page=${page}&limit=${
            limit ? limit : 2
        }&sort=${sort}`
        return instance.get(url + param)
    },
}

export default productApi
