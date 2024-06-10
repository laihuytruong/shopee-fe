import { Outlet, useLocation } from 'react-router-dom'
import { Header, Footer } from '~/components'

const Public = () => {
    const { pathname } = useLocation()

    return (
        <div className="w-full flex flex-col items-center">
            <div
                className={`w-full flex justify-center bg-main text-white text-[13px] h-[119px] ${
                    pathname === '/' && 'fixed top-0 z-50'
                }`}
            >
                <Header />
            </div>
            <Outlet />
            <div className="bg-white flex justify-center border-t-4 mt-[70px] border-solid border-t-main w-full">
                <Footer />
            </div>
        </div>
    )
}

export default Public
