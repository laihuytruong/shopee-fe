export interface PaginationInfo {
    page: number
    pageSize: number
    totalPage: number
    totalCount: number
}

export interface MenuItem {
    children: React.ReactNode
    sort?: string
}

export interface PriceInput {
    minPrice: string
    maxPrice: string
}

export interface SearchHistory {
    _id: string
    name: string
    slug: string
    clickAt: number
}
