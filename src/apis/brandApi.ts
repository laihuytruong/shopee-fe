import instance from '~/apiService'
import { Brand } from '~/models/brandInterfaces'

interface BrandResponse {
    err: number
    msg?: string
    accessToken?: string
    page?: number
    pageSize?: number
    totalCount?: number
    totalPage?: number
    data?: Brand[]
}

const brandApi = {
    async getBrands(page: number, pageSize?: number): Promise<BrandResponse> {
        const url = '/brand'
        const param = `?page=${page}&pageSize=${pageSize ? pageSize : 10}`
        return instance.get(url + param)
    },
    async getBrand(slug: string | undefined): Promise<BrandResponse> {
        const url = '/brand/filter'
        const param = `/${slug}`
        return instance.get(url + param)
    },
    async createBrand(
        token: string,
        brandName: string,
        category: string
    ): Promise<BrandResponse> {
        const url = '/brand'
        const data = { brandName, category }
        const headers = {
            Authorization: token,
        }
        return instance.post(url, data, { headers })
    },
    async updateBrand(
        token: string,
        brandId: string,
        brandName: string,
        category: string
    ): Promise<BrandResponse> {
        const url = '/brand'
        const param = `/${brandId}`
        const data = { brandName, category }
        const headers = {
            Authorization: token,
        }
        return instance.put(url + param, data, { headers })
    },
    async deleteBand(
        token: string,
        brandId: string
    ): Promise<BrandResponse> {
        const url = '/brand'
        const param = `/${brandId}`
        const headers = {
            Authorization: token,
        }
        return instance.delete(url + param, { headers })
    },
}

export default brandApi
