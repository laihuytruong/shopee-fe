import { createSlice, PayloadAction } from '@reduxjs/toolkit/react'
import type { RootState } from '~/app/store'
import { SearchHistory } from '~/models'

interface SearchState {
    searchHistory: SearchHistory[]
}

const initialState: SearchState = {
    searchHistory: [],
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        addSearchHistory: (state, action: PayloadAction<SearchHistory>) => {
            if (!state.searchHistory.includes(action.payload)) {
                state.searchHistory.push(action.payload)
            }
        },
        updateSearchHistory: (state, action: PayloadAction<SearchHistory>) => {
            const index = state.searchHistory.findIndex(
                (item) => item._id === action.payload._id
            )
            if (index === -1) {
                state.searchHistory.splice(index, 1, action.payload)
            }
        },
        sortSearchHistory: (state) => {
            state.searchHistory.sort((a, b) => b.clickAt - a.clickAt)
        },
        deleteItem: (state, action: PayloadAction<SearchHistory>) => {
            const index = state.searchHistory.findIndex(
                (item) => item._id === action.payload._id
            )
            if (index !== -1) {
                state.searchHistory.splice(index, 1)
            }
        },
    },
})

export const {
    addSearchHistory,
    sortSearchHistory,
    updateSearchHistory,
    deleteItem,
} = searchSlice.actions

export const selectSearchHistory = (state: RootState) =>
    state.search.searchHistory

export default searchSlice.reducer
