import instance from '~/apiService'
import { VariationOption } from '~/models'

interface VariationResponse {
    err: number
    msg?: string
    accessToken?: string
    page?: number
    pageSize?: number
    totalCount?: number
    totalPage?: number
    data?: VariationOption[]
}

const variationOptionApi = {
    async getVariationOptions(
        page: number,
        pageSize?: number
    ): Promise<VariationResponse> {
        const url = '/variation-option'
        const param = `?page=${page}&pageSize=${pageSize ? pageSize : 10}`
        return instance.get(url + param)
    },
    async createVariationOption(
        token: string,
        name: string,
        variationId: string
    ): Promise<VariationResponse> {
        const url = '/variation-option'
        const data = { name, variationId }
        const headers = {
            Authorization: token,
        }
        return instance.post(url, data, { headers })
    },
    async updateVariationOption(
        token: string,
        variationOptionId: string,
        name: string,
        variationId: string
    ): Promise<VariationResponse> {
        const url = '/variation-option'
        const param = `/${variationOptionId}`
        const data = { name, variationId }
        const headers = {
            Authorization: token,
        }
        return instance.put(url + param, data, { headers })
    },
    async deleteVariationOption(
        token: string,
        variationOptionId: string
    ): Promise<VariationResponse> {
        const url = '/variation-option'
        const param = `/${variationOptionId}`
        const headers = {
            Authorization: token,
        }
        return instance.delete(url + param, { headers })
    },
}

export default variationOptionApi
