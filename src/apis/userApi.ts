import instance from '~/apiService'
import { User, VariationOption } from '~/models'

interface Response {
    err: number
    msg?: string
    data?: User
}

interface ResponseUsers {
    err: number
    msg?: string
    page?: number
    pageSize?: number
    totalCount?: number
    totalPage?: number
    data?: User[]
}

const userApi = {
    async getAllUsers(
        token: string,
        page: number,
        pageSize?: number
    ): Promise<ResponseUsers> {
        const url = '/users'
        const params = `?page=${page}&pageSize=${pageSize ? pageSize : 10}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + params, { headers })
    },
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
        variationOption: VariationOption[]
    }): Promise<Response> {
        const url = '/users/cart'
        const { token, ...rest } = data
        const headers = {
            Authorization: token,
        }
        return instance.put(url, { ...rest }, { headers })
    },
    async updateUserByAdmin(
        token: string,
        ids: React.Key[],
        role: string | undefined
    ): Promise<Response> {
        const url = '/users/update-role'
        const headers = {
            Authorization: token,
        }
        const data = {
            ids,
            role,
            isBlocked: false,
        }
        return instance.put(url, data, { headers })
    },
    async deleteItemCart(data: {
        token: string
        pdId: string
        variationOption: VariationOption[]
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
        items: Array<{
            pdId: string
            variationOption: VariationOption[]
        }> | null
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
    async deleteUser(token: string, userId: string): Promise<Response> {
        const url = `/users/${userId}`
        const headers = {
            Authorization: token,
        }
        return instance.delete(url, { headers })
    },
}

export default userApi
