import instance from '~/apiService'
import { CategoryItem } from '~/models'

interface CategoriesResponse {
    err: number
    msg?: string
    accessToken?: string
    page?: number
    pageSize?: number
    totalCount?: number
    totalPage?: number
    data?: CategoryItem[]
}

interface CategoryResponse {
    err: number
    msg?: string
    data?: CategoryItem
}

const categoryItemApi = {
    async getCategoryItems(
        page: number,
        pageSize?: number
    ): Promise<CategoriesResponse> {
        const url = '/category-item'
        const param = `?page=${page}&pageSize=${pageSize || 10}`
        return instance.get(url + param)
    },
    async getCategoryItemBySlug(
        slug: string | undefined
    ): Promise<CategoriesResponse> {
        const url = '/category-item/filter'
        const param = `/${slug}`
        return instance.get(url + param)
    },
    async createCategoryItem(
        token: string,
        categoryItemName: string,
        category: string
    ): Promise<CategoryResponse> {
        const url = '/category-item'
        const data = { categoryItemName, category }
        const headers = {
            Authorization: token,
        }
        return instance.post(url, data, { headers })
    },
    async updateCategoryItem(
        token: string,
        categoryItemId: string,
        categoryItemName: string,
        category: string
    ): Promise<CategoryResponse> {
        const url = '/category-item'
        const param = `/${categoryItemId}`
        const data = { categoryItemName, category }
        const headers = {
            Authorization: token,
        }
        return instance.put(url + param, data, { headers })
    },
    async deleteCategoryItem(
        token: string,
        categoryItemId: string
    ): Promise<CategoryResponse> {
        const url = '/category-item'
        const param = `/${categoryItemId}`
        const headers = {
            Authorization: token,
        }
        return instance.delete(url + param, { headers })
    },
}

export default categoryItemApi
