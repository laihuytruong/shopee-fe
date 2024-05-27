import instance from '~/apiService'
import { Category } from '~/models/categoryInterfaces'

interface CategoryResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: Category[]
}

const categoryApi = {
    async getCategories(): Promise<CategoryResponse> {
        const url = '/categories'
        return instance.get(url)
    },
}

export default categoryApi
