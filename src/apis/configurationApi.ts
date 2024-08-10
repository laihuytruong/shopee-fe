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
    page?: number
    pageSize?: number
    totalCount?: number
    totalPage?: number
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
        const param = `?page=${page}&pageSize=${pageSize ? pageSize : 10}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + param, { headers })
    },
    async getConfigurationByDetail(data: {
        slug: string
        page?: number
        pageSize?: number
        token: string
    }): Promise<ConfigurationResponse> {
        const url = '/product-configuration'
        const param = `/${data.slug}?page=${
            data.page ? data.page : 1
        }&pageSize=${data.pageSize ? data.pageSize : 5}`
        const headers = {
            Authorization: data.token,
        }
        return instance.get(url + param, { headers })
    },
    async createConfiguration(data: {
        token: string
        productDetailId: string
        variationOptionId: string
    }): Promise<ConfigurationResponse> {
        const url = '/product-configuration'
        const headers = {
            Authorization: data.token,
        }
        const dataPost = {
            productDetailId: data.productDetailId,
            variationOptionId: data.variationOptionId,
        }
        return instance.post(url, dataPost, { headers })
    },
    async updateConfiguration(data: {
        token: string
        configurationId: string
        productDetailId: string
        variationOptionId: string
    }): Promise<ConfigurationResponse> {
        const url = '/product-configuration'
        const param = `/${data.configurationId}`
        const headers = {
            Authorization: data.token,
        }
        const dataPost = {
            productDetailId: data.productDetailId,
            variationOptionId: data.variationOptionId,
        }
        return instance.put(url + param, dataPost, { headers })
    },
    async deleteConfiguration(data: {
        token: string
        configurationId: string
    }): Promise<ConfigurationResponse> {
        const url = '/product-configuration'
        const param = `/${data.configurationId}`
        const headers = {
            Authorization: data.token,
        }
        return instance.delete(url + param, { headers })
    },
}

export default configurationApi
