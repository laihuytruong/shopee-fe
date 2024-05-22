import { Routes, Route } from 'react-router-dom'
import routes from './config/routes'
import { Home, Login, Public } from './pages/public'

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path={routes.PUBLIC} element={<Public />}>
                    <Route path={routes.HOME} element={<Home />} />
                    <Route path={routes.Login} element={<Login />} />

                    <Route path={routes.ALL} element={<Home />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
