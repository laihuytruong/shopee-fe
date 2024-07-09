import instance from '~/apiService'
import { CategoryItem } from '~/models'
import { Cart } from '~/models/cartInterface'
import { Product } from '~/models/productInterfaces'

interface ProductsResponse {
    err: number
    msg?: string
    accessToken?: string
    page?: number
    pageSize?: number
    totalPage?: number
    totalCount?: number
    data?: Product[]
}

interface ProductResponse {
    err: number
    msg?: string
    count?: number
    accessToken?: string
    data?: Product
}

interface SearchResponse {
    err: number
    msg?: string
    accessToken?: string
    page?: number
    pageSize?: number
    totalPage?: number
    totalCount?: number
    data?: Product[] | CategoryItem[]
}

const productApi = {
    async getProducts(
        page: number = 1,
        pageSize?: number,
        productName?: string
    ): Promise<ProductsResponse> {
        const url = '/products'
        const param = `?page=${page}&pageSize=${pageSize ? pageSize : 10}${
            productName ? `&productName=${productName}` : ''
        }`
        return instance.get(url + param)
    },

    async getProduct(
        productName: string | undefined
    ): Promise<ProductResponse> {
        const url = '/products'
        const param = `/${productName}`
        return instance.get(url + param)
    },

    async filterProduct(
        slug: string | undefined,
        token: string,
        page?: number,
        pageSize?: number
    ): Promise<ProductsResponse> {
        const url = '/products/category'
        const param = `/${slug}?page=${page ? page : 1}&pageSize=${
            pageSize ? pageSize : 10
        }`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + param, { headers })
    },
    async updateQuantity(
        cart: Cart[],
        token: string
    ): Promise<ProductsResponse> {
        const url = '/products/update-quantity'
        const headers = {
            Authorization: token,
        }
        return instance.put(url, { cart }, { headers })
    },
    async search(
        keyword: string,
        token: string,
        page?: number,
        pageSize?: number
    ): Promise<SearchResponse> {
        const url = '/products/search'
        const param = `?page=${page ? +page : 1}&pageSize=${
            pageSize ? pageSize : 10
        }&keyword=${keyword}`
        const headers = {
            Authorization: token,
        }
        return instance.get(url + param, { headers })
    },
    async filter(
        token: string,
        products: Product[],
        page: number,
        pageSize: number,
        sort?: string,
        totalRating?: number,
        price?: string,
        brand?: string
    ): Promise<ProductsResponse> {
        const url = '/products/filter'
        const param = `?page=${+page}&pageSize=${+pageSize}${
            sort && `&sort=${sort}`
        }${
            totalRating && totalRating > 0 ? `&totalRating=${totalRating}` : ''
        }${price ? `&price=${price}` : ''}${brand ? `&brand=${brand}` : ''}`
        const headers = {
            Authorization: token,
        }
        const body = {
            productData: products,
        }
        return instance.post(url + param, { ...body }, { headers })
    },
    async ratingProduct(
        token: string,
        pid: string,
        star: number
    ): Promise<ProductResponse> {
        const url = '/products/ratings'
        const body = {
            pid,
            star,
        }
        const headers = {
            Authorization: token,
        }
        return instance.put(url, { ...body }, { headers })
    },
}

export default productApi
