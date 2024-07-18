import instance from '~/apiService'
import { Category } from '~/models/categoryInterfaces'

interface CategoriesResponse {
    err: number
    msg?: string
    page?: number
    pageSize?: number
    totalPage?: number
    totalCount?: number
    data?: Category[]
}

interface CategoryResponse {
    err: number
    msg?: string
    data?: Category
}

const categoryApi = {
    async getCategories(
        page: number,
        limit?: number
    ): Promise<CategoriesResponse> {
        const url = '/categories'
        const param = `?page=${page}&pageSize=${limit ? limit : 20}`
        return instance.get(url + param)
    },
    async getCategory(_id: string | undefined): Promise<CategoryResponse> {
        const url = `/categories/${_id}`
        return instance.get(url)
    },
    async createCategory(
        token: string,
        formData: FormData
    ): Promise<CategoryResponse> {
        const url = '/categories'
        const headers = {
            Authorization: token,
        }
        return instance.post(url, formData, { headers })
    },
    async uploadImage(
        token: string,
        categoryId: string,
        thumbnail: File
    ): Promise<CategoryResponse> {
        const url = `/categories/${categoryId}`
        const headers = {
            Authorization: token,
        }
        const data = {
            thumbnail,
        }
        return instance.put(url, { ...data }, { headers })
    },
    async updateCategory(
        token: string,
        categoryId: string,
        formData: FormData
    ): Promise<CategoryResponse> {
        const url = `/categories/${categoryId}`
        const headers = {
            Authorization: token,
        }
        return instance.put(url, formData, { headers })
    },
    async deleteCategory(
        token: string,
        categoryId: string
    ): Promise<CategoryResponse> {
        const url = `/categories/${categoryId}`
        const headers = {
            Authorization: token,
        }
        return instance.delete(url, { headers })
    },
}

export default categoryApi
