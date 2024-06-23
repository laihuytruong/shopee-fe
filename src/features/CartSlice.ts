import { PayloadAction, createSlice } from '@reduxjs/toolkit/react'
import type { RootState } from '~/app/store'
import { Cart } from '~/models/cartInterface'

interface CartState {
    cart: Cart[]
    checkItem: {
        [key: string]: boolean
    }
}

const initialState: CartState = {
    cart: [],
    checkItem: {},
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        cartBuy: (state, action: PayloadAction<Cart[]>) => {
            if (state.cart.length === 0) {
                state.cart = action.payload
            } else {
                action.payload.forEach((newItem) => {
                    const existingItem = state.cart.find(
                        (cartItem) =>
                            cartItem.productDetail._id ===
                                newItem.productDetail._id &&
                            cartItem.variationOption._id ===
                                newItem.variationOption._id
                    )
                    if (existingItem) {
                        if (existingItem.quantity !== newItem.quantity) {
                            existingItem.quantity += newItem.quantity
                        }
                    } else {
                        state.cart.push(newItem)
                    }
                })
            }
        },
        setCheckItem: (
            state,
            action: PayloadAction<{
                [key: string]: boolean
            }>
        ) => {
            state.checkItem = action.payload
        },
        deleteCart: (state) => {
            state.cart = []
        },
    },
})

export const { cartBuy, setCheckItem, deleteCart } = cartSlice.actions

export const selectCart = (state: RootState) => state.cart.cart
export const selectCheckItem = (state: RootState) => state.cart.checkItem

export default cartSlice.reducer
