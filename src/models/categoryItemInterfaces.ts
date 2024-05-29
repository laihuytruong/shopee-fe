import { Category } from './categoryInterfaces'

export interface CategoryItem {
    _id: string
    categoryItemName: string
    slug: string
    category?: Category
}
