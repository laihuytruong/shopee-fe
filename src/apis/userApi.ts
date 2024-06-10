import instance from '~/apiService'
import { User } from '~/models'

interface VerifyResponse {
    err: number
    msg?: string
    data?: User
}

const userApi = {
    async getUser(data: {
        userId: string
        token: string
    }): Promise<VerifyResponse> {
        const url = '/users/current'
        const headers = {
            Authorization: data.token,
        }
        return instance.get(url, { headers })
    },
    async updateUser(data: {
        user: User
        token: string
    }): Promise<VerifyResponse> {
        const url = '/users/current'
        const headers = {
            Authorization: data.token,
        }
        const param = `/${data.user._id}`
        return instance.put(url + param, { ...data.user }, { headers })
    },
}

export default userApi
