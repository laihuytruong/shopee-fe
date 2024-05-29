import { Routes, Route } from 'react-router-dom'
import routes from './config/routes'
import { Home, Login, Public } from './pages/user'
import DailyDiscover from './pages/user/DailyDiscover'
import ProductCategory from './pages/user/ProductCategory'
import ProductDetail from './pages/user/ProductDetail'
import AllCategories from './pages/user/AllCategories'

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path={routes.PUBLIC} element={<Public />}>
                    <Route path={routes.HOME} element={<Home />} />
                    <Route path={routes.Login} element={<Login />} />
                    <Route
                        path={routes.DAILY_DISCOVER}
                        element={<DailyDiscover />}
                    />
                    <Route
                        path={routes.PRODUCT_CATEGORY}
                        element={<ProductCategory />}
                    />
                    <Route
                        path={routes.PRODUCT_DETAIL}
                        element={<ProductDetail />}
                    />
                    <Route
                        path={routes.ALL_CATEGORIES}
                        element={<AllCategories />}
                    />

                    <Route path={routes.ALL} element={<Home />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
