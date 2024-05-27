export interface Category {
    _id: string
    categoryName: string
    thumbnail: string
    slug: string
}

export interface CategoryItem {
    _id: string
    categoryItemName: string
    slug: string
    category?: Category
}
