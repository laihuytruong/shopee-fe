import instance from '~/apiService'
import { Configuration } from '~/models'

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
