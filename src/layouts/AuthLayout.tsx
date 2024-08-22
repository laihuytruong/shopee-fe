import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import { useAppSelector } from '~/app/hooks'
import { Footer } from '~/components'
import routes from '~/config/routes'
import { selectIsRegistered } from '~/features/UserSlice'
import icons from '~/utils/icons'

const { FcShop } = icons

const AuthLayout = () => {
    const params = useParams()
    const { pathname } = useLocation()
    const isRegistered = useAppSelector(selectIsRegistered)

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full">
                <div
                    className={`h-[84px] bg-white flex justify-center ${
                        params.step && 'shadow-header'
                    }`}
                >
                    <div className="w-main flex items-center justify-between">
                        <div className="flex items-center">
                            <div>
                                <NavLink
                                    className="w-[18%]"
                                    to={`${routes.HOME}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-3xl text-main">
                                            TSHOP
                                        </span>
                                        <FcShop size={36} />
                                    </div>
                                </NavLink>
                            </div>
                            <h1 className="text-3xl text-[#222222] ml-4">
                                {isRegistered === false
                                    ? 'Thay đổi gmail'
                                    : pathname.includes('register')
                                    ? 'Đăng ký'
                                    : pathname.includes('login')
                                    ? 'Đăng nhập'
                                    : 'Đặt lại mật khẩu'}
                            </h1>
                        </div>
                        <span className="text-main text-[14px] pt-4">
                            Bạn cần giúp đỡ?
                        </span>
                    </div>
                </div>
            </div>
            <Outlet />
            <div className="bg-white flex justify-center w-full">
                <Footer />
            </div>
        </div>
    )
}

export default AuthLayout
