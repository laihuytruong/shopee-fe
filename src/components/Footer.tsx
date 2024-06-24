import { NavLink } from 'react-router-dom'
import icons from '~/utils/icons'

const { FaFacebook, FaInstagram, FaLinkedin } = icons

const Footer = () => {
    return (
        <div className="w-main mt-10 flex justify-evenly pb-10">
            <div className="flex flex-col text-sm gap-1">
                <h3 className="text-[#000000de] font-bold">SHOP</h3>
                <span className="text-[#000000A6]">Thời Trang Nam Nữ</span>
                <span className="text-[#000000A6]">Giầy Dép</span>
                <span className="text-[#000000A6]">Thiết Bị Điện Tử</span>
                <span className="text-[#000000A6]">Đồ Dùng Thể Thao</span>
                <span className="text-[#000000A6]">Đồng Hồ</span>
            </div>
            <div className="flex flex-col text-sm gap-1">
                <h3 className="text-[#000000de] font-bold">HỖ TRỢ</h3>
                <span className="text-[#000000A6]">Tiếp Nhận Yêu Cầu</span>
                <span className="text-[#000000A6]">Liên Hệ</span>
            </div>
            <div className="flex flex-col text-sm gap-3">
                <h3 className="text-[#000000de] font-bold">THANH TOÁN</h3>
                <div className="flex items-center justify-center">
                    <img
                        src="https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8"
                        alt="thumbnail"
                        className="rounded-sm shadow-icon mr-2"
                    />
                    <img
                        src="https://down-vn.img.susercontent.com/file/a0a9062ebe19b45c1ae0506f16af5c16"
                        alt="thumbnail"
                        className="rounded-sm shadow-icon mr-2"
                    />
                    <img
                        src="https://down-vn.img.susercontent.com/file/38fd98e55806c3b2e4535c4e4a6c4c08"
                        alt="thumbnail"
                        className="rounded-sm shadow-icon mr-2"
                    />
                </div>
                <div className="flex items-center justify-center">
                    <img
                        src="https://down-vn.img.susercontent.com/file/bc2a874caeee705449c164be385b796c"
                        alt="thumbnail"
                        className="rounded-sm shadow-icon mr-2"
                    />
                    <img
                        src="https://down-vn.img.susercontent.com/file/2c46b83d84111ddc32cfd3b5995d9281"
                        alt="thumbnail"
                        className="rounded-sm shadow-icon mr-2"
                    />
                    <img
                        src="https://down-vn.img.susercontent.com/file/5e3f0bee86058637ff23cfdf2e14ca09"
                        alt="thumbnail"
                        className="rounded-sm shadow-icon mr-2"
                    />
                </div>
                <div className="flex items-center">
                    <img
                        src="https://down-vn.img.susercontent.com/file/9263fa8c83628f5deff55e2a90758b06"
                        alt="thumbnail"
                        className="rounded-sm shadow-icon mr-2"
                    />
                    <img
                        src="https://down-vn.img.susercontent.com/file/0217f1d345587aa0a300e69e2195c492"
                        alt="thumbnail"
                        className="rounded-sm shadow-icon mr-2"
                    />
                </div>
            </div>
            <div className="flex flex-col text-sm gap-3">
                <h3 className="text-[#000000de] font-bold">Liên Hệ</h3>
                <p className="flex items-center gap-1">
                    <FaFacebook />
                    <NavLink
                        to={
                            'https://www.facebook.com/profile.php?id=61552210125608'
                        }
                        className="text-[#000000A6] hover:text-main"
                    >
                        Facebook
                    </NavLink>
                </p>
                <p className="flex items-center gap-1">
                    <FaInstagram />
                    <NavLink
                        to={'https://www.instagram.com/truonglaihuy/'}
                        className="text-[#000000A6] hover:text-main"
                    >
                        Instagram
                    </NavLink>
                </p>
                <p className="flex items-center gap-1">
                    <FaLinkedin />
                    <NavLink
                        to={
                            'https://www.linkedin.com/in/tr%C6%B0%E1%BB%9Dng-l%E1%BA%A1i-huy-b442b3239/'
                        }
                        className="text-[#000000A6] hover:text-main"
                    >
                        Linkedin
                    </NavLink>
                </p>
            </div>
        </div>
    )
}

export default Footer
