import icons from '~/utils/icons'
import logo from '~/assets/image/logo.png'
import { MenuList, Search } from '~/components'
import userCartItems from '~/apis/mockData'
import { Link, useLocation } from 'react-router-dom'
import routes from '~/config/routes'
import { Dropdown } from 'antd'
const {
    IoIosNotificationsOutline,
    CiCircleQuestion,
    GrLanguage,
    IoLogoFacebook,
    IoLogoInstagram,
    FiShoppingCart,
} = icons

const Header = () => {
    // const { pathname, search } = useLocation()

    const handleSelect = () => {
        console.log('select')
    }

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
                            { children: 'Tiếng Việt' },
                            { children: 'English' },
                        ]}
                        handleSelect={handleSelect}
                    >
                        <div className="flex items-center gap-1 hover:text-hover hover:cursor-pointer">
                            <GrLanguage size={16} />
                            <span>Ngôn ngữ</span>
                        </div>
                    </MenuList>
                    <MenuList
                        menuList={[
                            { children: 'Tài khoản của tôi' },
                            { children: 'Đơn mua' },
                            { children: 'Đăng xuất' },
                        ]}
                        handleSelect={handleSelect}
                    >
                        <div className="flex items-center gap-[6px]">
                            <img
                                className="w-[22px] h-[22px] rounded-full"
                                src="https://res.cloudinary.com/dqhkmhosw/image/upload/v1715915939/shopee/c7koj4q5kk8ey2n9fwrn.jpg"
                                alt=""
                            />
                            <span className="hover:text-hover hover:cursor-pointer">
                                tendangnhap
                            </span>
                        </div>
                    </MenuList>
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
                            <div className="flex flex-col w-[400px] h-auto bg-white rounded shadow-cart">
                                <div className="text-[#00000042] p-[10px]">
                                    Sản Phẩm Mới Thêm
                                </div>
                                {userCartItems.map((item) => (
                                    <div className="flex p-[10px] items-start text-sm hover:bg-[#f8f8f8] hover:cursor-pointer">
                                        <img
                                            src={`${item.product.image}`}
                                            alt="image"
                                            className="w-10 h-10 rounded-sm"
                                        />
                                        <span className="ml-[10px] flex-1 w-32 truncate overflow-hidden whitespace-nowrap">
                                            {item.product.productName}
                                        </span>
                                        <span className="text-main ml-3">
                                            đ
                                            {item.product.price.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between p-[10px] bg-[#fdfdfd] ">
                                    <span className="text-xs">
                                        15 Thêm Hàng Vào Giỏ
                                    </span>
                                    <button className="bg-main p-2 text-white hover:opacity-[0.9] rounded-sm flex items-center justify-center">
                                        Xem Giỏ Hàng
                                    </button>
                                </div>
                            </div>
                        )}
                    >
                        <div className="relative cursor-pointer">
                            <FiShoppingCart size={28} />

                            <div className="bg-white h-4 w-6 rounded-full absolute left-3.5 -top-[6px] text-main flex items-center justify-center">
                                1
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default Header
