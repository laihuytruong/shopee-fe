import instance from '~/apiService'
import { Cart } from '~/models/cartInterface'

interface Response {
    err: number
    msg?: string
    data?: {
        id: string
    }
}

const stripeApi = {
    async payment(data: { cart: Cart[]; token: string }): Promise<Response> {
        const url = '/stripe/create-checkout-session'
        const headers = {
            Authorization: data.token,
            'Content-Type': 'application/json',
        }
        const body = {
            products: data.cart,
        }
        return instance.post(url, { ...body }, { headers })
    },
    async getAll(token: string): Promise<Response> {
        const url = '/stripe/amount'
        const headers = {
            Authorization: token,
        }
        return instance.get(url, { headers })
    },
}

export default stripeApi
