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
}

export default userApi
