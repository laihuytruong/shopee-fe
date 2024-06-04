import instance from '~/apiService'
import { Category } from '~/models/categoryInterfaces'

interface CategoryResponse {
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

const categoryApi = {
    async getCategories(
        page: number = 1,
        limit?: number
    ): Promise<CategoryResponse> {
        const url = '/categories'
        const param = `?page=${page}&limit=${limit ? limit : 20}`
        return instance.get(url + param)
    },
}

export default categoryApi
