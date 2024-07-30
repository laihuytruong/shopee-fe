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
    Payment,
} from '~/pages/user'

import {
    ChangePassword,
    MyAccount,
    Payment_Announce,
    Purchase,
    CustomToastContainer,
} from '~/components'

import { AuthLayout, Public, MeLayout, AdminLayout } from '~/layouts'
import admin_routes from './config/admin_routes'
import {
    HandleProduct,
    AddProductDetail,
    AllBrands,
    AllCategories,
    AllCategoryItems,
    AllOrders,
    AllProducts,
    AllUsers,
    AllVariationOptions,
    AllVariations,
    Amount,
    Profile,
} from './pages/admin'
import 'react-toastify/dist/ReactToastify.css'

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
                    <Route path={routes.PAYMENT} element={<Payment />} />
                    <Route
                        path={routes.PAYMENT_ANNOUNCE}
                        element={<Payment_Announce />}
                    />

                    <Route path={routes.ALL} element={<Home />} />
                </Route>

                <Route path={admin_routes.ADMIN} element={<AdminLayout />}>
                    <Route path={admin_routes.AMOUNT} element={<Amount />} />
                    <Route
                        path={admin_routes.ALL_PRODUCTS}
                        element={<AllProducts />}
                    />
                    <Route
                        path={admin_routes.ADD_PRODUCTS}
                        element={<HandleProduct />}
                    />
                    <Route
                        path={admin_routes.UPDATE_PRODUCT}
                        element={<HandleProduct />}
                    />
                    <Route
                        path={admin_routes.ADD_PRODUCT_DETAIL}
                        element={<AddProductDetail />}
                    />
                    <Route
                        path={admin_routes.ALL_ORDERS}
                        element={<AllOrders />}
                    />
                    <Route
                        path={admin_routes.ALL_CATEGORIES}
                        element={<AllCategories />}
                    />
                    <Route
                        path={admin_routes.ALL_CATEGORY_ITEMS}
                        element={<AllCategoryItems />}
                    />
                    <Route
                        path={admin_routes.ALL_BRANDS}
                        element={<AllBrands />}
                    />
                    <Route
                        path={admin_routes.ALL_VARIATIONS}
                        element={<AllVariations />}
                    />
                    <Route
                        path={admin_routes.ALL_VARIATION_OPTIONS}
                        element={<AllVariationOptions />}
                    />
                    <Route
                        path={admin_routes.ALL_USERS}
                        element={<AllUsers />}
                    />
                    <Route path={admin_routes.PROFILE} element={<Profile />} />
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

            <CustomToastContainer />
        </div>
    )
}

export default App
