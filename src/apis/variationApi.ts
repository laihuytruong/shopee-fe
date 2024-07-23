import instance from '~/apiService'
import { Variation } from '~/models'

interface VariationResponse {
    err: number
    msg?: string
    accessToken?: string
    page?: number
    pageSize?: number
    totalCount?: number
    totalPage?: number
    data?: Variation[]
}

const variationApi = {
    async getVariations(
        token: string,
        page: number,
        pageSize?: number
    ): Promise<VariationResponse> {
        const url = '/variation'
        const param = `?page=${page}&pageSize=${pageSize ? pageSize : 10}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + param, { headers })
    },
    async createVariation(
        token: string,
        name: string,
        categoryId: string
    ): Promise<VariationResponse> {
        const url = '/variation'
        const data = { name, categoryId }
        const headers = {
            Authorization: token,
        }
        return instance.post(url, data, { headers })
    },
    async updateVariation(
        token: string,
        variationId: string,
        name: string,
        categoryId: string
    ): Promise<VariationResponse> {
        const url = '/variation'
        const param = `/${variationId}`
        const data = { name, categoryId }
        const headers = {
            Authorization: token,
        }
        return instance.put(url + param, data, { headers })
    },
    async deleteVariation(
        token: string,
        variationId: string
    ): Promise<VariationResponse> {
        const url = '/variation'
        const param = `/${variationId}`
        const headers = {
            Authorization: token,
        }
        return instance.delete(url + param, { headers })
    },
}

export default variationApi
