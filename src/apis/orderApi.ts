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

interface ResponseChart {
    err: number
    msg?: string
    data?: number[]
}

const orderApi = {
    async getAllUserOrder(
        token: string,
        page?: number,
        pageSize?: number
    ): Promise<Response> {
        const url = '/order/all'
        const params = `?page=${page || 1}&pageSize=${pageSize || 10}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + params, { headers })
    },
    async getAllOrder(
        token: string,
        page?: number,
        pageSize?: number
    ): Promise<Response> {
        const url = '/order'
        const params = `?page=${page || 1}&pageSize=${pageSize || 10}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + params, { headers })
    },
    async getAllOrderByStatus(
        token: string,
        status: string,
        page?: number,
        pageSize?: number
    ): Promise<Response> {
        const url = '/order/all'
        const params = `/${status}?page=${page || 1}&pageSize=${pageSize || 5}`
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
    async getOrderByType(token: string, type: string): Promise<ResponseChart> {
        const url = `/order/all/${type}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url, { headers })
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
    async search(
        token: string,
        page: number,
        pageSize: number,
        keyword: string
    ): Promise<Response> {
        const url = '/order/search'
        const params = `?page=${page}&pageSize=${pageSize}&keyword=${keyword}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + params, { headers })
    },

    async filter(
        token: string,
        page: number,
        pageSize: number,
        minDate: string,
        maxDate: string
    ): Promise<Response> {
        const url = '/order/filter'
        const params = `?page=${page}&pageSize=${pageSize}`
        const headers = {
            Authorization: token,
        }
        const data = {
            minDate,
            maxDate,
        }
        return instance.post(url + params, data, { headers })
    },
}

export default orderApi
