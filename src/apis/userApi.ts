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
}

export default userApi
