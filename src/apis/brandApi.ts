import instance from '~/apiService'
import { Brand } from '~/models/brandInterfaces'

interface BrandResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: Brand[]
}

const brandApi = {
    async getBrand(slug: string | undefined): Promise<BrandResponse> {
        const url = '/brand/filter'
        const param = `/${slug}`
        return instance.get(url + param)
    },
}

export default brandApi
