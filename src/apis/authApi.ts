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
        const url = '/auth/register/verify'
        return instance.post(url, data)
    },

    async register(data: DataAuth): Promise<AuthResponse> {
        const url = '/auth/register'
        console.log(data)
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
        const url = '/auth/reset-password'
        const param = `/${data.resetToken}`
        return instance.put(url + param, { password: data.password })
    },
    async generateNewToken(): Promise<AuthResponse> {
        const url = '/auth/refresh-token'
        return instance.post(url)
    },
}

export default authApi
