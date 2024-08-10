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
        token: string,
        page: number,
        pageSize?: number
    ): Promise<VariationResponse> {
        const url = '/variation-option'
        const param = `?page=${page}&pageSize=${pageSize ? pageSize : 10}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + param, { headers })
    },
    async getVariationOptionsByVariation(
        token: string,
        variation: string
    ): Promise<VariationResponse> {
        const url = '/variation-option'
        const param = `/${variation}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + param, { headers })
    },
    async createVariationOption(
        token: string,
        value: string,
        variationId: string
    ): Promise<VariationResponse> {
        const url = '/variation-option'
        const data = { value, variationId }
        const headers = {
            Authorization: token,
        }
        return instance.post(url, data, { headers })
    },
    async updateVariationOption(
        token: string,
        variationOptionId: string,
        value: string,
        variationId: string
    ): Promise<VariationResponse> {
        const url = '/variation-option'
        const param = `/${variationOptionId}`
        const data = { value, variationId }
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
