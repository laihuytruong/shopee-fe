import { Outlet } from 'react-router-dom'
import { Footer } from '~/components'

const AuthLayout = () => {
    return (
        <div className="w-full flex flex-col items-center">
            <Outlet />
            <div className="bg-white flex justify-center">
                <Footer />
            </div>
        </div>
    )
}

export default AuthLayout
