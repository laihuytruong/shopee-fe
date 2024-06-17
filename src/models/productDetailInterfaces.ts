import { Product } from "./productInterfaces"

export interface ProductDetailData {
  _id: string
  image: string
  price: number
  inventory: number
  product: Product
}