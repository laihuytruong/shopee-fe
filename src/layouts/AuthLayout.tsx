import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom'
import { Footer } from '~/components/user'
import routes from '~/config/routes'
import logo_login from '~/assets/image/logo_login.png'

const AuthLayout = () => {
    const params = useParams()
    const { pathname } = useLocation()

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
                                    <img
                                        src={logo_login}
                                        alt="Logo_login"
                                        className="w-40 h-auto cursor-pointer"
                                    />
                                </NavLink>
                            </div>
                            <h1 className="text-3xl text-[#222222] pt-4 ml-4">
                                {pathname.includes('register')
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
