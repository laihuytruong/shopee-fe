import { Outlet } from 'react-router-dom'
import { Header, Footer } from '~/components'

const Public = () => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-center bg-main text-white text-[13px] h-[119px] fixed top-0 z-50">
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
