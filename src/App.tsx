import { Routes, Route } from 'react-router-dom'
import routes from './config/routes'
import {
    Home,
    Login,
    Public,
    DailyDiscover,
    ProductFilter,
    ProductDetail,
    Search,
    Auth,
    Register,
} from '~/pages/user'

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

                    <Route path={routes.ALL} element={<Home />} />
                </Route>

                <Route element={<Auth />}>
                    <Route path={routes.LOGIN} element={<Login />} />
                    <Route path={routes.REGISTER} element={<Register />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
