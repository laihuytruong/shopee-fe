import { NavLink, useNavigate } from 'react-router-dom'
import routes from '~/config/routes'
import { ShowPassword, HidePassword } from '~/utils/svgIcons'
import { useCallback, useState } from 'react'
import icons from '~/utils/icons'
import { authApi } from '~/apis'
import { useAppDispatch } from '~/app/hooks'
import { auth } from '~/features/UserSlice'
import { useForm } from 'react-hook-form'
import { useCookies } from 'react-cookie'
import Swal from 'sweetalert2'

const { FcGoogle, IoCloseCircleOutline } = icons

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<{ email: string; password: string }>({ mode: 'onChange' })
    const [cookies, setCookie] = useCookies()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const email = watch('email', '')
    const password = watch('password', '')
    const nav = useNavigate()

    const onSubmit = useCallback(async () => {
        setIsError(false)
        const response = await authApi.login({ email, password })
        if (response.err === 0) {
            dispatch(auth(response))
            setCookie(
                'user',
                { userId: response.data?._id, token: response.accessToken },
                { path: '/' }
            )
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Đăng nhập thành công',
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                nav(`/${routes.HOME}`)
            })
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Đăng nhập thất bại',
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                setIsError(true)
            })
        }
    }, [email, password])

    return (
        <div className="w-full">
            <div className="bg-[#ed4d2d] h-[600px] flex justify-center">
                <div className=" w-[1040px] bg-custom h-full flex items-center">
                    <div className="w-full h-[482px]">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="bg-white h-full rounded shadow-form_auth w-[400px] float-right"
                        >
                            <h2 className="w-full px-[30px] py-[22px] text-xl text-[#222]">
                                Đăng nhập
                            </h2>
                            <div className="px-[30px] pb-[30px]">
                                {isError && (
                                    <div className="text-[#ff424f] text-xs flex gap-2 p-2 bg-[#fff6f7] border-[#ff424f] focus:border-[#ff424f] mb-3">
                                        <IoCloseCircleOutline size={20} />
                                        <span>
                                            Tên tài khoản của bạn hoặc Mật khẩu
                                            không đúng, vui lòng thử lại
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className={`${
                                        errors.email
                                            ? 'bg-[#fff6f7] border-[#ff424f] focus:border-[#ff424f] mb-1'
                                            : 'focus:border-black mb-5 border-[rgba(0, 0, 0, .14)]'
                                    } outline-none rounded-sm border border-solid  p-3 shadow-input_auth w-full`}
                                    {...register('email', {
                                        required: 'Vui lòng điền trường này',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                            message:
                                                'Email không đúng định dạng',
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <span className="text-[#ff424f] text-xs">
                                        {String(errors.email.message)}
                                    </span>
                                )}
                                <div
                                    className={`${
                                        errors.password
                                            ? 'bg-[#fff6f7] border-[#ff424f] focus:border-[#ff424f] mb-1 mt-3'
                                            : 'focus:border-black mb-5 border-[rgba(0, 0, 0, .14)]'
                                    } flex items-center rounded-sm shadow-input_auth border border-solid`}
                                >
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="Mật khẩu"
                                        className=" p-3 w-full outline-none"
                                        {...register('password', {
                                            required:
                                                'Vui lòng điền trường này',
                                            minLength: {
                                                value: 8,
                                                message:
                                                    'Mật khẩu chứa ít nhất 8 kí tự',
                                            },
                                            maxLength: {
                                                value: 16,
                                                message:
                                                    'Mật khẩu chứa tối đa 16 kí tự',
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
                                                message:
                                                    'Mật khẩu phải chứa ít nhất 1 ký tự viết thường và 1 ký tự viết hoa',
                                            },
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="pl-3 pr-4 bg-transparent outline-none border-none"
                                    >
                                        {showPassword ? (
                                            <HidePassword />
                                        ) : (
                                            <ShowPassword />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="text-[#ff424f] text-xs mb-2 block">
                                        {String(errors.password.message)}
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    className={`px-[10px] mb-[10px] rounded-sm w-full bg-main ${
                                        email !== '' && password !== ''
                                            ? 'cursor-pointer opacity-[1]'
                                            : 'cursor-not-allowed opacity-[0.7]'
                                    } text-white py-[10px]`}
                                >
                                    Đăng nhập
                                </button>
                                <NavLink
                                    to={routes.FORGOT_PASSWORD}
                                    className="text-[#05a] text-xs"
                                >
                                    Quên mật khẩu
                                </NavLink>
                                <div className="w-full flex items-center mt-1">
                                    <div className="bg-[#dbdbdb] flex-1 h-[1px]"></div>
                                    <span className="text-xs text-[#ccc] px-4 w-1/5 text-center">
                                        HOẶC
                                    </span>
                                    <div className="bg-[#dbdbdb] flex-1 h-[1px]"></div>
                                </div>
                                <button className="hover:bg-[rgba(0, 0, 0, .02)] mt-5 px-10 gap-2 m-auto rounded-sm bg-white flex items-center justify-center border border-solid border-[rgba(0, 0, 0, .26)] text-[rgba(0, 0, 0, .87)] text-[18px] h-10">
                                    <FcGoogle size={24} />
                                    <span className="pt-[3px]">Google</span>
                                </button>
                                <div className="mt-[30px] text-[14px] text-[rgba(0, 0, 0, .26)] text-center">
                                    Bạn mới biết đến Shopee?
                                    <NavLink
                                        to={routes.REGISTER}
                                        className="text-main ml-1"
                                    >
                                        Đăng ký
                                    </NavLink>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
