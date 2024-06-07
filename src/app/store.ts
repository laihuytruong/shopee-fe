import { Reducer, combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import logger from 'redux-logger'
import { counterSlice } from '~/features/CounterSlice'
import { searchSlice } from '~/features/SearchSlice'
import { userSlice } from '~/features/UserSlice'

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    counter: counterSlice.reducer,
    search: searchSlice.reducer,
    user: userSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer as Reducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export const persistor = persistStore(store)
export { store }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
