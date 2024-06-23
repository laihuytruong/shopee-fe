import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '~/app/hooks'
import routes from '~/config/routes'
import { selectUser } from '~/features/UserSlice'
import { User } from '~/models'
import icons from '~/utils/icons'

const { MdModeEdit, FaRegUser, TiClipboard } = icons

const MeLayout = () => {
    const [isShowMenu, setIsShowMenu] = useState<boolean>(true)

    const user: User = useAppSelector(selectUser)
    const { pathname } = useLocation()

    return (
        <div className="flex mt-6 w-main pb-[50px]">
            <div className="w-[200px]">
                <div className="py-[15px] pl-2 border-b border-solid border-b-[#efefef] flex items-center gap-[15px]">
                    <NavLink
                        to={routes.MY_ACCOUNT}
                        className="hover:cursor-pointer bg-[#f5f5f5] rounded-full w-10 h-10 border border-solid border-[rgba(0, 0, 0, .09)]"
                    >
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="w-full h-full rounded-full"
                        />
                    </NavLink>
                    <div>
                        <p className="font-bold">{user.username}</p>
                        <NavLink
                            to={routes.MY_ACCOUNT}
                            className="flex items-center gap-1 text-[#888888]"
                        >
                            <MdModeEdit size={16} />
                            <span>Sửa hồ sơ</span>
                        </NavLink>
                    </div>
                </div>
                <div className="w-full mt-4">
                    <div className="text-sm text-[#000000DE]">
                        <div>
                            <NavLink
                                to={routes.MY_ACCOUNT}
                                onClick={() => setIsShowMenu(!isShowMenu)}
                                className="flex items-center gap-2 group mb-[15px]"
                            >
                                <FaRegUser size={16} color="#175eb7" />
                                <span className="group-hover:text-main">
                                    Tài khoản của tôi
                                </span>
                            </NavLink>
                            {isShowMenu && (
                                <div className="pl-[34px] flex flex-col gap-[15px]">
                                    <NavLink
                                        to={routes.MY_ACCOUNT}
                                        className={`hover:text-main ${
                                            pathname.includes('profile') &&
                                            'text-main'
                                        }`}
                                    >
                                        Hồ sơ
                                    </NavLink>
                                    <NavLink
                                        to={routes.CHANGE_PASSWORD}
                                        className={`hover:text-main ${
                                            pathname.includes(
                                                'change-password'
                                            ) && 'text-main'
                                        }`}
                                    >
                                        Đổi mật khẩu
                                    </NavLink>
                                </div>
                            )}
                        </div>
                        <NavLink
                            to={routes.ORDER}
                            onClick={() => setIsShowMenu(false)}
                            className={`flex items-center gap-2 group mt-[15px] ${
                                pathname.includes('purchase') && 'text-main'
                            }`}
                        >
                            <TiClipboard size={20} color="#175eb7" />
                            <span className="group-hover:text-main">
                                Đơn mua
                            </span>
                        </NavLink>
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-white rounded-sm shadow-me ml-[27px] w-[980px]">
                <Outlet />
            </div>
        </div>
    )
}

export default MeLayout
