import instance from '~/apiService'
import { User } from '~/models'

interface Response {
    err: number
    msg?: string
    data?: User
}

const userApi = {
    async getUser(data: { userId: string; token: string }): Promise<Response> {
        const url = '/users/current'
        const headers = {
            Authorization: data.token,
        }
        return instance.get(url, { headers })
    },
    async updateUser(data: { user: User; token: string }): Promise<Response> {
        const url = '/users/current'
        const headers = {
            Authorization: data.token,
        }
        const params = `/${data.user._id}`
        return instance.put(url + params, { ...data.user }, { headers })
    },
    async uploadAvatar(data: {
        token: string
        avatar: File
    }): Promise<Response> {
        const url = '/users/upload'
        const headers = {
            Authorization: data.token,
            'Content-Type': 'multipart/form-data',
        }
        return instance.put(url, { avatar: data.avatar }, { headers })
    },
    async updateCart(data: {
        token: string
        pdId: string
        quantity: number
        variationOption: string
    }): Promise<Response> {
        const url = '/users/cart'
        const { token, ...rest } = data
        const headers = {
            Authorization: token,
        }
        return instance.put(url, { ...rest }, { headers })
    },
    async deleteItemCart(data: {
        token: string
        pdId: string
        variationOption: string
    }): Promise<Response> {
        const url = '/users/delete-item'
        const headers = {
            Authorization: data.token,
        }
        return instance.delete(url, {
            headers,
            data: {
                pdId: data.pdId,
                variationOption: data.variationOption,
            },
        })
    },
    async deleteAllItemCart(data: {
        token: string
        checkAll: boolean
        items: Array<{ pdId: string; variationOption: string }> | null
    }): Promise<Response> {
        const url = '/users/delete-all'
        const headers = {
            Authorization: data.token,
        }
        return instance.delete(url, {
            headers,
            data: {
                items: data.items,
                checkAll: data.checkAll,
            },
        })
    },
}

export default userApi
