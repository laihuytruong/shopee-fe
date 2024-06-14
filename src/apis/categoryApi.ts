import instance from '~/apiService'
import { Category } from '~/models/categoryInterfaces'

interface CategoriesResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: {
        page: number
        pageSize: number
        totalPage: number
        data: Category[]
    }
}

interface CategoryResponse {
    err: number
    msg?: string
    data?: Category
}

const categoryApi = {
    async getCategories(
        page: number = 1,
        limit?: number
    ): Promise<CategoriesResponse> {
        const url = '/categories'
        const param = `?page=${page}&limit=${limit ? limit : 20}`
        return instance.get(url + param)
    },
    async getCategory(_id: string | undefined): Promise<CategoryResponse> {
        const url = `/categories/${_id}`
        return instance.get(url)
    },
}

export default categoryApi
