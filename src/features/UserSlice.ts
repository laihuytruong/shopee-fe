import { createSlice, PayloadAction } from '@reduxjs/toolkit/react'
import type { RootState } from '~/app/store'
import { User } from '~/models'

interface UserState {
    user: User
    token: string
    code: string
    time: Date
    email: string
}

interface UserResponse {
    err: number
    msg?: string
    accessToken?: string
    data?: User
}

interface ActionCode {
    code: string
    time: Date
    email: string
}

const initialState: UserState = {
    user: {} as User,
    token: '',
    code: '',
    time: new Date(),
    email: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        auth: (state, action: PayloadAction<UserResponse>) => {
            state.user = action.payload.data
                ? action.payload.data
                : ({} as User)
            state.token = action.payload.accessToken
                ? action.payload.accessToken
                : ''
        },
        setDataRegister: (state, action: PayloadAction<ActionCode>) => {
            state.code = action.payload.code
            state.time = action.payload.time
            state.email = action.payload.email
        },
    },
})

export const { auth, setDataRegister } = userSlice.actions

export const selectAccessToken = (state: RootState) => state.user.token
export const selectUser = (state: RootState) => state.user.user
export const selectCodeRegister = (state: RootState) => state.user.code
export const selectCodeTimeRegister = (state: RootState) => state.user.time
export const selectEmailRegister = (state: RootState) => state.user.email

export default userSlice.reducer
