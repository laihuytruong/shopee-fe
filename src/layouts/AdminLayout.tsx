import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import logo_login from '~/assets/image/logo_login.png'
import { MenuList } from '~/components/user'
import admin_routes from '~/config/admin_routes'
import routes from '~/config/routes'
import { selectUser, setUser } from '~/features/UserSlice'
import { MenuItem, User } from '~/models'
import icons from '~/utils/icons'

const { MdModeEdit, FaRegUser, TiClipboard } = icons

enum MenuItemEnum {
    MyAccount = 'Tài khoản của tôi',
    Logout = 'Đăng xuất',
}

const AdminLayout = () => {
    const user: User = useAppSelector(selectUser)
    const dispatch = useAppDispatch()
    const nav = useNavigate()
    const { pathname } = useLocation()

    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [isShowMenu, setIsShowMenu] = useState<boolean>(true)

    const handleSelect = async (item?: MenuItem) => {
        try {
            if (item) {
                const { children } = item
                if (children === MenuItemEnum.Logout) {
                    await authApi.logout()
                }
                switch (children) {
                    case MenuItemEnum.Logout:
                        dispatch(setUser({ user: {} as User }))
                        removeCookie('user', { path: '/' })
                        nav(routes.LOGIN)
                        break
                    case MenuItemEnum.MyAccount:
                        nav(admin_routes.PROFILE)
                        break
                    default:
                        break
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="h-[1000px] z-10">
            <div className="fixed top-0 shadow-header w-full px-10 py-2 border-b border-solid border-b-[rgba(0, 0, 0, .09)] flex items-center justify-between h-[70px]">
                <div className="flex items-center gap-2">
                    <img src={logo_login} alt="" className="h-10" />
                    <span className="text-xl pt-3">{`>`}</span>
                    <span className="text-2xl pt-2">Admin</span>
                </div>
                <MenuList
                    menuList={[
                        { children: MenuItemEnum.MyAccount },
                        { children: MenuItemEnum.Logout },
                    ]}
                    handleSelect={handleSelect}
                >
                    <div className="flex items-center gap-[6px] hover:cursor-pointer text-[16px]">
                        <img
                            className="w-[25px] h-[25px] rounded-full"
                            src={
                                user.avatar
                                    ? user.avatar
                                    : 'https://bit.ly/3ycA2mE'
                            }
                            alt="avatar"
                        />
                        <span>{user?.username}</span>
                    </div>
                </MenuList>
            </div>
            <div className="w-full">
                <div className="w-1/5 pl-16 fixed left-0 top-[70px] border-r border-solid border-r-[rgba(0, 0, 0, .09)] h-full">
                    <div className="w-full mt-4 text-sm text-[#000000DE]">
                        <div>
                            <NavLink
                                to={admin_routes.AMOUNT}
                                onClick={() => setIsShowMenu(false)}
                                className={`flex items-center gap-2 group mt-[15px] ${
                                    pathname.includes(admin_routes.AMOUNT) &&
                                    'text-main'
                                }`}
                            >
                                <TiClipboard size={16} color="#175eb7" />
                                <span className="group-hover:text-main">
                                    Thống kê doanh số
                                </span>
                            </NavLink>
                            <NavLink
                                to={admin_routes.ALL_PRODUCTS}
                                onClick={() => {
                                    if (!pathname.includes('products')) {
                                        setIsShowMenu(true)
                                    } else {
                                        setIsShowMenu(!isShowMenu)
                                    }
                                }}
                                className="flex items-center gap-2 group my-[15px]"
                            >
                                <FaRegUser size={16} color="#175eb7" />
                                <span className="group-hover:text-main">
                                    Quản lý sản phẩm
                                </span>
                            </NavLink>
                            {isShowMenu && pathname.includes('products') && (
                                <div className="pl-6 flex flex-col gap-[15px]">
                                    <NavLink
                                        to={admin_routes.ALL_PRODUCTS}
                                        className={`hover:text-main ${
                                            pathname.includes(
                                                admin_routes.ALL_PRODUCTS
                                            ) && 'text-main'
                                        } `}
                                    >
                                        Tất cả sản phẩm
                                    </NavLink>
                                    <NavLink
                                        to={admin_routes.ADD_PRODUCTS}
                                        className={`hover:text-main ${
                                            pathname.includes(
                                                admin_routes.ADD_PRODUCTS
                                            ) && 'text-main'
                                        } `}
                                    >
                                        Thêm sản phẩm
                                    </NavLink>
                                </div>
                            )}
                            <NavLink
                                to={admin_routes.ALL_ORDERS}
                                onClick={() => setIsShowMenu(!isShowMenu)}
                                className={`flex items-center gap-2 group my-[15px] ${
                                    pathname.includes(
                                        admin_routes.ALL_ORDERS
                                    ) && 'text-main'
                                }`}
                            >
                                <TiClipboard size={16} color="#175eb7" />
                                <span className="group-hover:text-main">
                                    Quản lý đơn hàng
                                </span>
                            </NavLink>
                            <NavLink
                                to={admin_routes.ALL_CATEGORIES}
                                onClick={() => setIsShowMenu(false)}
                                className={`flex items-center gap-2 group my-[15px] ${
                                    pathname.includes(
                                        admin_routes.ALL_CATEGORIES
                                    ) && 'text-main'
                                }`}
                            >
                                <FaRegUser size={16} color="#175eb7" />
                                <span className="group-hover:text-main">
                                    Quản lý phân loại
                                </span>
                            </NavLink>
                            <NavLink
                                to={admin_routes.PROFILE}
                                onClick={() => {
                                    if (!pathname.includes('profile')) {
                                        setIsShowMenu(true)
                                    } else {
                                        setIsShowMenu(!isShowMenu)
                                    }
                                }}
                                className="flex items-center gap-2 group my-[15px]"
                            >
                                <FaRegUser size={16} color="#175eb7" />
                                <span className="group-hover:text-main">
                                    Quản lý hồ sơ
                                </span>
                            </NavLink>
                            {isShowMenu && pathname.includes('profile') && (
                                <div className="pl-6 flex flex-col gap-[15px]">
                                    <NavLink
                                        to={admin_routes.PROFILE}
                                        className={`hover:text-main ${
                                            pathname.includes(
                                                admin_routes.PROFILE
                                            ) && 'text-main'
                                        } `}
                                    >
                                        Trang cá nhân
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pl-[320px] mt-20 w-4/5">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
