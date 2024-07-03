import instance from '~/apiService'
import { Order } from '~/models'

interface Response {
    err: number
    msg?: string
    page?: number
    pageSize?: number
    totalCount?: number
    totalPage?: number
    data?: Order[]
}

const orderApi = {
    async getAllOrder(
        token: string,
        page?: number,
        pageSize?: number
    ): Promise<Response> {
        console.log({ page, pageSize })
        const url = '/order'
        const params = `?page=${page || 1}&pageSize=${pageSize || 10}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + params, { headers })
    },
    async getOrderByStatus(
        token: string,
        status: string,
        page?: number,
        pageSize?: number
    ): Promise<Response> {
        const url = '/order'
        const params = `/${status}?page=${page || 1}&pageSize=${pageSize || 5}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + params, { headers })
    },
    async updateStatus(
        token: string,
        status: string,
        _id: string
    ): Promise<Response> {
        const url = '/order/status'
        const params = `/${_id}`
        const headers = {
            Authorization: token,
        }
        return instance.put(url + params, { status }, { headers })
    },
}

export default orderApi
