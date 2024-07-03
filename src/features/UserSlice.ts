import { createSlice, PayloadAction } from '@reduxjs/toolkit/react'
import type { RootState } from '~/app/store'
import { User } from '~/models'

interface UserState {
    user: User
    token: string
    code: string
    time: Date
    email: string
    resetToken: string
    isRegistered: boolean
    paginationInfo: PaginationInfo
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

interface PaginationInfo {
    page: number
    pageSize: number
    totalPage: number
    totalCounts: number
}

const initialState: UserState = {
    user: {} as User,
    token: '',
    code: '',
    time: new Date(),
    email: '',
    resetToken: '',
    isRegistered: true,
    paginationInfo: {
        page: 1,
        pageSize: 5,
        totalPage: 1,
        totalCounts: 0,
    },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        auth: (state, action: PayloadAction<UserResponse>) => {
            state.user =
                action.payload.err === 0 && action.payload.data
                    ? action.payload.data
                    : ({} as User)
            state.token = action.payload.accessToken
                ? action.payload.accessToken
                : ''
        },
        setUser: (state, action: PayloadAction<{ user: User }>) => {
            state.user = action.payload.user
                ? action.payload.user
                : ({} as User)
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },
        setDataRegister: (state, action: PayloadAction<ActionCode>) => {
            state.code = action.payload.code
            state.time = action.payload.time
            state.email = action.payload.email
        },
        setResetToken: (
            state,
            action: PayloadAction<{ resetToken: string }>
        ) => {
            state.resetToken = action.payload.resetToken
        },
        setEmail: (state, action: PayloadAction<{ email: string }>) => {
            state.email = action.payload.email
        },
        setIsRegistered: (
            state,
            action: PayloadAction<{ isRegistered: boolean }>
        ) => {
            state.isRegistered = action.payload.isRegistered
        },
        setPaginationInfo: (state, action: PayloadAction<PaginationInfo>) => {
            state.paginationInfo = action.payload
        },
    },
})

export const {
    auth,
    setUser,
    setAccessToken,
    setDataRegister,
    setResetToken,
    setEmail,
    setIsRegistered,
    setPaginationInfo,
} = userSlice.actions

export const selectAccessToken = (state: RootState) => state.user.token
export const selectUser = (state: RootState) => state.user.user
export const selectCodeRegister = (state: RootState) => state.user.code
export const selectCodeTimeRegister = (state: RootState) => state.user.time
export const selectEmailRegister = (state: RootState) => state.user.email
export const selectResetToken = (state: RootState) => state.user.resetToken
export const selectIsRegistered = (state: RootState) => state.user.isRegistered
export const selectPaginationInfo = (state: RootState) =>
    state.user.paginationInfo

export default userSlice.reducer
