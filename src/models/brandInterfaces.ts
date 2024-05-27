import { Category } from './categoryInterfaces'

export interface Brand {
    _id: string
    brandName: string
    slug: string
    category: Category
}
