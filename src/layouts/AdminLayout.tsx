import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import logo_login from '~/assets/image/logo_login.png'
import { MenuList } from '~/components'
import admin_routes from '~/config/admin_routes'
import routes from '~/config/routes'
import { selectCount } from '~/features/CounterSlice'
import { selectUser, setAccessToken, setUser } from '~/features/UserSlice'
import { MenuItem, User } from '~/models'
import icons from '~/utils/icons'

const {
    FaRegUser,
    TiClipboard,
    IoStatsChart,
    MdOutlineCategory,
    MdOutlineBrandingWatermark,
    LiaProductHunt,
} = icons

enum MenuItemEnum {
    MyAccount = 'Tài khoản của tôi',
    Logout = 'Đăng xuất',
}

const AdminLayout = () => {
    const user: User = useAppSelector(selectUser)
    const count = useAppSelector(selectCount)
    const dispatch = useAppDispatch()
    const nav = useNavigate()
    const { pathname } = useLocation()

    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [isShowMenu, setIsShowMenu] = useState<boolean>(true)

    useEffect(() => {
        const refreshUser = async () => {
            if (
                !cookies.user ||
                cookies.user.expiresAt < new Date().getTime()
            ) {
                const response = await authApi.generateNewToken()
                if (response.err === 1) {
                    console.log('1s')
                    nav(routes.LOGIN)
                } else if (response.msg) {
                    const expiresAt =
                        new Date().getTime() + 7 * 24 * 3600 * 1000
                    dispatch(setAccessToken(response.msg))
                    setCookie(
                        'user',
                        { user: user._id, token: response.msg, expiresAt },
                        { path: '/' }
                    )
                }
            }
        }
        refreshUser()
    }, [cookies])

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
        <div>
            <div className="fixed z-30 top-0 shadow-header bg-white w-full px-10 py-2 border-b border-solid border-b-[rgba(0, 0, 0, .09)] flex items-center justify-between h-[70px]">
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
                <div className="w-1/5 pl-16 fixed left-0 top-[70px] border-r-2 border-solid border-r-[rgba(0, 0, 0, .09)] h-full">
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
                                <IoStatsChart
                                    size={16}
                                    color={`${
                                        pathname.includes('amount')
                                            ? '#ee4d2d'
                                            : '#175eb7'
                                    }`}
                                />
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
                                <LiaProductHunt size={16} color="#175eb7" />
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
                                        }`}
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
                                <TiClipboard
                                    size={16}
                                    color={`${
                                        pathname.includes('orders')
                                            ? '#ee4d2d'
                                            : '#175eb7'
                                    }`}
                                />
                                <span className="group-hover:text-main">
                                    Quản lý đơn hàng
                                </span>
                            </NavLink>
                            <NavLink
                                to={admin_routes.ALL_CATEGORIES}
                                onClick={() => {
                                    if (!pathname.includes('categories')) {
                                        setIsShowMenu(true)
                                    } else {
                                        setIsShowMenu(!isShowMenu)
                                    }
                                }}
                                className={`flex items-center gap-2 group my-[15px]`}
                            >
                                <MdOutlineCategory size={16} color="#175eb7" />
                                <span className="group-hover:text-main">
                                    Quản lý phân loại
                                </span>
                            </NavLink>
                            {isShowMenu && pathname.includes('catego') && (
                                <div className="pl-6 flex flex-col gap-[15px]">
                                    <NavLink
                                        to={admin_routes.ALL_CATEGORIES}
                                        className={`hover:text-main ${
                                            pathname.includes(
                                                admin_routes.ALL_CATEGORIES
                                            ) && 'text-main'
                                        } `}
                                    >
                                        Tất cả phân loại
                                    </NavLink>
                                    <NavLink
                                        to={admin_routes.ALL_CATEGORY_ITEMS}
                                        className={`hover:text-main ${
                                            pathname.includes(
                                                admin_routes.ALL_CATEGORY_ITEMS
                                            ) && 'text-main'
                                        } `}
                                    >
                                        Tất cả phân loại thành phần
                                    </NavLink>
                                </div>
                            )}
                            <NavLink
                                to={admin_routes.ALL_BRANDS}
                                onClick={() => setIsShowMenu(false)}
                                className={`flex items-center gap-2 group my-[15px] ${
                                    pathname.includes(
                                        admin_routes.ALL_BRANDS
                                    ) && 'text-main'
                                }`}
                            >
                                <MdOutlineBrandingWatermark
                                    size={16}
                                    color={`${
                                        pathname.includes('brands')
                                            ? '#ee4d2d'
                                            : '#175eb7'
                                    }`}
                                />
                                <span className="group-hover:text-main">
                                    Quản lý thương hiệu
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
                <div className="pt-20 w-full pl-[340px] pr-[30px]">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
