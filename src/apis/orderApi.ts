import instance from '~/apiService'
import { Order } from '~/models'

interface Response {
    err: number
    msg?: string
    data?: Order[]
}

const orderApi = {
    async getAllOrder(token: string): Promise<Response> {
        const url = '/order'
        const headers = {
            Authorization: token,
        }
        return instance.get(url, { headers })
    },
    async getOrderByStatus(token: string, status: string): Promise<Response> {
        const url = '/order'
        const params = `/${status}`
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
