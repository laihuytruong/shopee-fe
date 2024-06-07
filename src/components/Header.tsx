import icons from '~/utils/icons'
import logo from '~/assets/image/logo.png'
import { MenuList, Search } from '~/components'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import routes from '~/config/routes'
import { Dropdown, Empty } from 'antd'
import { useCookies } from 'react-cookie'
import { useEffect, useState } from 'react'
import { userApi } from '~/apis'
import { MenuItem, User } from '~/models'
const {
    IoIosNotificationsOutline,
    CiCircleQuestion,
    GrLanguage,
    IoLogoFacebook,
    IoLogoInstagram,
    FiShoppingCart,
} = icons

enum MenuItemEnum {
    Vietnamese = 'Tiếng Việt',
    English = 'English',
    MyAccount = 'Tài khoản của tôi',
    Order = 'Đơn mua',
    Logout = 'Đăng xuất',
}

const Header = () => {
    // const { pathname, search } = useLocation()
    const [cookies, setCookie, removeCookie] = useCookies(['user'])
    const [user, setUser] = useState<User>()
    const nav = useNavigate()
    useEffect(() => {
        const fetchUser = async () => {
            const response = await userApi.getUser({ ...cookies.user })
            console.log('response: ', response.data)
            if (response.err === 0) {
                setUser(response.data)
            }
        }
        fetchUser()
    }, [])

    const handleSelect = (item?: MenuItem) => {
        if (item) {
            const { children } = item
            switch (children) {
                case MenuItemEnum.Logout:
                    removeCookie('user', { path: '/' })
                    nav('/login')
                    break
                default:
                    break
            }
        }
    }

    const showCartElements =
        user && user.cart.length > 5 ? user.cart.slice(0, 5) : user?.cart

    return (
        <div className="w-main flex flex-col text-[14px]">
            <div className="flex justify-between items-center h-[34px]">
                <div className="flex items-center justify-center gap-3">
                    <div>
                        <span>Kênh Người Bán</span>
                    </div>
                    <div>
                        <span className="custom-border">Tải ứng dụng</span>
                    </div>
                    <div className="flex items-center gap-[6px]">
                        <span className="custom-border">Kết nối</span>
                        <IoLogoFacebook
                            size={16}
                            className="hover:cursor-pointer"
                        />
                        <IoLogoInstagram
                            size={16}
                            className="hover:cursor-pointer"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1 hover:text-hover hover:cursor-pointer">
                        <IoIosNotificationsOutline size={16} />
                        <span>Thông báo</span>
                    </div>
                    <div className="flex items-center gap-1 hover:text-hover hover:cursor-pointer">
                        <CiCircleQuestion size={18} />
                        <span>Hỗ trợ</span>
                    </div>
                    <MenuList
                        menuList={[
                            { children: MenuItemEnum.Vietnamese },
                            { children: MenuItemEnum.English },
                        ]}
                        handleSelect={handleSelect}
                    >
                        <div className="flex items-center gap-1 hover:text-hover hover:cursor-pointer">
                            <GrLanguage size={16} />
                            <span>Ngôn ngữ</span>
                        </div>
                    </MenuList>
                    {cookies.user ? (
                        <MenuList
                            menuList={[
                                { children: MenuItemEnum.MyAccount },
                                { children: MenuItemEnum.Order },
                                { children: MenuItemEnum.Logout },
                            ]}
                            handleSelect={handleSelect}
                        >
                            <div className="flex items-center gap-[6px] hover:cursor-pointer">
                                <img
                                    className="w-[22px] h-[22px] rounded-full"
                                    src={
                                        user
                                            ? user.avatar
                                            : 'https://bit.ly/3ycA2mE'
                                    }
                                    alt="avartar"
                                />
                                <span className="hover:text-hover">
                                    {user?.username}
                                </span>
                            </div>
                        </MenuList>
                    ) : (
                        <div className="flex items-center gap-2">
                            <NavLink
                                to={`${routes.REGISTER}`}
                                className="hover:text-hover"
                            >
                                Đăng ký
                            </NavLink>
                            <NavLink
                                to={`${routes.LOGIN}`}
                                className="hover:text-hover"
                            >
                                Đăng nhập
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex h-[85px] items-center justify-between">
                <Link className="w-[18%]" to={`${routes.HOME}`}>
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-40 h-auto cursor-pointer"
                    />
                </Link>
                <div className="flex-1">
                    <Search />
                </div>
                <div className="w-[10%] flex justify-center">
                    <Dropdown
                        placement="bottomRight"
                        dropdownRender={() => (
                            <div
                                className={`flex flex-col w-[400px] h-auto bg-white rounded shadow-cart`}
                            >
                                {user && user.cart && user.cart.length > 0 ? (
                                    <div>
                                        <div className="text-[#00000042] p-[10px]">
                                            Sản Phẩm Mới Thêm
                                        </div>
                                        {showCartElements &&
                                            showCartElements.map((item) => (
                                                <div className="flex p-[10px] items-start text-sm hover:bg-[#f8f8f8] hover:cursor-pointer">
                                                    <img
                                                        src={`${item.product.image}`}
                                                        alt="image"
                                                        className="w-10 h-10 rounded-sm"
                                                    />
                                                    <span className="ml-[10px] flex-1 w-32 truncate overflow-hidden whitespace-nowrap">
                                                        {
                                                            item.product
                                                                .productName
                                                        }
                                                    </span>
                                                    <span className="text-main ml-3">
                                                        đ
                                                        {item.product.price.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        <div className="flex items-center justify-between p-[10px] bg-[#fdfdfd] ">
                                            <span className="text-xs">
                                                {user.cart.length > 5
                                                    ? `${
                                                          user.cart.length - 1
                                                      } Thêm Hàng Vào Giỏ`
                                                    : '0 Thêm Hàng Vào Giỏ'}
                                            </span>
                                            <button className="bg-main p-2 text-white hover:opacity-[0.9] rounded-sm flex items-center justify-center">
                                                Xem Giỏ Hàng
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Empty
                                        description="Không có sản phẩm nào trong giỏ hàng"
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    />
                                )}
                            </div>
                        )}
                    >
                        <div className="relative cursor-pointer">
                            <FiShoppingCart size={28} />

                            {user && user.cart && user.cart.length > 0 && (
                                <div className="bg-white h-4 w-6 rounded-full absolute left-3.5 -top-[6px] text-main flex items-center justify-center">
                                    {user.cart.length}
                                </div>
                            )}
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default Header
