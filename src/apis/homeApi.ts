import instance from '~/apiService'
import { Category } from '~/models/categoryInterfaces'
import { ProductHome } from '~/models/productInterfaces'

interface CategoryResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: Category[]
}

interface ProductResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: {
        page: number
        pageSize: number
        data: ProductHome[]
    }
}

const homeApi = {
    async getCategories(): Promise<CategoryResponse> {
        const url = '/categories'
        return instance.get(url)
    },
    async getProducts(
        page: number = 1,
        limit?: number
    ): Promise<ProductResponse> {
        const url = '/products'
        const param = `/?page=${page}&limit=${limit ? limit : 10}`
        return instance.get(url + param)
    },
}

export default homeApi
