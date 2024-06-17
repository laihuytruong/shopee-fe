import { Routes, Route } from 'react-router-dom'
import routes from './config/routes'
import {
    Home,
    Login,
    DailyDiscover,
    ProductFilter,
    ProductDetail,
    Search,
    Register,
    RegisterFinal,
    ForgotPassword,
    ResetPassword,
    CartList,
} from '~/pages/user'

import { ChangePassword, MyAccount, Purchase } from '~/components'

import { AuthLayout, Public, MeLayout } from '~/layouts'

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path={routes.PUBLIC} element={<Public />}>
                    <Route path={routes.HOME} element={<Home />} />
                    <Route
                        path={routes.DAILY_DISCOVER}
                        element={<DailyDiscover />}
                    />
                    <Route
                        path={routes.PRODUCT_CATEGORY}
                        element={<ProductFilter />}
                    />
                    <Route
                        path={routes.PRODUCT_DETAIL}
                        element={<ProductDetail />}
                    />
                    <Route path={routes.SEARCH} element={<Search />} />
                    <Route path={routes.ME} element={<MeLayout />}>
                        <Route
                            path={routes.MY_ACCOUNT}
                            element={<MyAccount />}
                        />
                        <Route
                            path={routes.CHANGE_PASSWORD}
                            element={<ChangePassword />}
                        />
                        <Route path={routes.ORDER} element={<Purchase />} />
                    </Route>
                    <Route path={routes.CART} element={<CartList />} />

                    <Route path={routes.ALL} element={<Home />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path={routes.LOGIN} element={<Login />} />
                    <Route path={routes.REGISTER} element={<Register />} />
                    <Route
                        path={routes.REGISTER_FINAL}
                        element={<RegisterFinal />}
                    />
                    <Route
                        path={routes.FORGOT_PASSWORD}
                        element={<ForgotPassword />}
                    />
                    <Route
                        path={routes.RESET_PASSWORD}
                        element={<ResetPassword />}
                    />
                </Route>
            </Routes>
        </div>
    )
}

export default App
