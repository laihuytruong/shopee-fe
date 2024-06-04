import instance from '~/apiService'
import { CategoryItem } from '~/models'

interface CategoryResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: CategoryItem[]
}

const categoryItemApi = {
    async getCategoryItemBySlug(
        slug: string | undefined
    ): Promise<CategoryResponse> {
        const url = '/category-item/filter'
        const param = `/${slug}`
        return instance.get(url + param)
    },
}

export default categoryItemApi
