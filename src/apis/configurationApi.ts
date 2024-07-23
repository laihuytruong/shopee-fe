import instance from '~/apiService'
import { Configuration } from '~/models'

interface ConfigurationsResponse {
    err: number
    msg?: string
    accessToken?: string
    page?: number
    pageSize?: number
    totalCount?: number
    totalPage?: number
    data?: Configuration[]
}

interface ConfigurationResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: {
        _id: null
        minPrice: number
        maxPrice: number
        configurations: Configuration[]
    }
}

const configurationApi = {
    async getAllConfigurations(
        token: string,
        page: number,
        pageSize?: number
    ): Promise<ConfigurationsResponse> {
        const url = '/product-configuration'
        const param = `?page${page}&pageSize=${pageSize ? pageSize : 10}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + param, { headers })
    },
    async getConfigurationByDetail(data: {
        slug: string
        token: string
    }): Promise<ConfigurationResponse> {
        const url = '/product-configuration'
        const param = `/${data.slug}`
        const headers = {
            Authorization: data.token,
        }
        return instance.get(url + param, { headers })
    },
}

export default configurationApi
