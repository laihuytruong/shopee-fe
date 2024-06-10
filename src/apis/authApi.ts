import instance from '~/apiService'
import { User } from '~/models'

interface VerifyResponse {
    err: number
    msg?: string
    accessToken?: string
    data?: { email: string; token: string; code: string }
}

interface AuthResponse {
    err: number
    msg?: string
    accessToken?: string
    data?: User
    resetToken?: string
}

interface DataAuth {
    email: string
    password: string
}

const authApi = {
    async verify(data: { email: string }): Promise<VerifyResponse> {
        console.log('data: ', data)
        const url = '/auth/register/verify'
        return instance.post(url, data)
    },

    async register(data: DataAuth): Promise<AuthResponse> {
        const url = '/auth/register'
        console.log()
        return instance.post(url, data)
    },

    async login(data: DataAuth): Promise<AuthResponse> {
        const url = '/auth/login'
        return instance.post(url, data)
    },

    async logout(): Promise<AuthResponse> {
        const url = '/auth/logout'
        return instance.post(url)
    },

    async forgotPassword(data: { email: string }): Promise<AuthResponse> {
        const url = '/auth/forgot-password'
        return instance.post(url, data)
    },

    async resetPassword(data: {
        resetToken: string
        password: string
    }): Promise<AuthResponse> {
        console.log('data: ', data.resetToken)
        const url = '/auth/reset-password'
        const param = `/${data.resetToken}`
        return instance.put(url + param, { password: data.password })
    },
}

export default authApi
