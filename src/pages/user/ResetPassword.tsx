import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import { authApi } from '~/apis'
import { useAppSelector } from '~/app/hooks'
import routes from '~/config/routes'
import { selectEmailRegister, selectResetToken } from '~/features/UserSlice'
import icons from '~/utils/icons'
import { ShowPassword, HidePassword } from '~/utils/svgIcons'
import Swal from 'sweetalert2'

const { FaArrowLeftLong, IoCloseCircleOutline, FaCheck } = icons

const ResetPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<{ password: string }>({ mode: 'onChange' })

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const password = watch('password', '')
    const resetToken = useAppSelector(selectResetToken)
    const email = useAppSelector(selectEmailRegister)

    const errorsInput = errors.password?.type
    const nav = useNavigate()
    const onSubmit = useCallback(async () => {
        try {
            if (!errors.password) {
                const response = await authApi.resetPassword({
                    resetToken,
                    password,
                })
                if (response.err === 0) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Bạn đã thiết lập mật khẩu thành công',
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        nav(routes.LOGIN)
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }, [password])

    return (
        <>
            <div className="flex items-center justify-center w-full min-h-[600px]">
                <div className="w-[1040px] flex items-center justify-center">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-[500px] bg-white rounded shadow-form_reset"
                    >
                        <div className="h-20 flex items-center px-8">
                            <NavLink
                                to={`${routes.LOGIN}`}
                                className="hover:cursor-pointer"
                            >
                                <FaArrowLeftLong size={30} color="#ee4d2d" />
                            </NavLink>
                            <span className="text-center flex-1 text-xl text-[#222222]">
                                Thiếp Lập Mật Khẩu
                            </span>
                        </div>
                        <div className="px-20 pb-[46px]">
                            <div className="text-center text-sm">
                                <p>Tạo mật khẩu mới cho</p>
                                <p className="mb-7 text-main">{email}</p>
                            </div>
                            <div
                                className={`${
                                    ((errorsInput &&
                                        (errorsInput === 'minLength' ||
                                            errorsInput === 'maxLength')) ||
                                        !password.match(/[a-z]/) ||
                                        !password.match(/[A-Z]/)) &&
                                    password.length > 0
                                        ? 'bg-[#fff6f7] border-[#ff424f] focus:border-[#ff424f]'
                                        : ' focus-within:border-black border-[rgba(0, 0, 0, .14)]'
                                } w-full mb-[10px] flex items-center rounded-sm shadow-input_auth border border-solid`}
                            >
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Mật khẩu"
                                    className=" p-[10px] w-full outline-none"
                                    maxLength={16}
                                    {...register('password', {
                                        minLength: {
                                            value: 8,
                                            message:
                                                'Mật khẩu phải có ít nhất 8 ký tự',
                                        },
                                        maxLength: {
                                            value: 16,
                                            message:
                                                'Mật khẩu chỉ được tối đa 16 ký tự',
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

                            <p
                                className={`text-sm ${
                                    password.match(/[a-z]/)
                                        ? 'text-[#6c0]'
                                        : password.length > 0
                                        ? 'text-[#ff424f]'
                                        : 'text-[#75757566]'
                                } text-left w-full flex items-center gap-2`}
                            >
                                Ít nhất một kí tự viết thường
                                {password.match(/[a-z]/) ? (
                                    <FaCheck />
                                ) : (
                                    password.length > 0 && (
                                        <IoCloseCircleOutline />
                                    )
                                )}
                            </p>
                            <p
                                className={`text-sm ${
                                    password.match(/[A-Z]/)
                                        ? 'text-[#6c0]'
                                        : password.length > 0
                                        ? 'text-[#ff424f]'
                                        : 'text-[#75757566]'
                                } text-left w-full flex items-center gap-2`}
                            >
                                Ít nhất một kí tự viết hoa
                                {password.match(/[A-Z]/) ? (
                                    <FaCheck />
                                ) : (
                                    password.length > 0 && (
                                        <IoCloseCircleOutline />
                                    )
                                )}
                            </p>
                            <p
                                className={`text-sm ${
                                    errorsInput &&
                                    (errorsInput === 'minLength' ||
                                        errorsInput === 'maxLength')
                                        ? 'text-[#ff424f]'
                                        : password.length >= 8 &&
                                          password.length <= 16
                                        ? 'text-[#6c0]'
                                        : 'text-[#75757566]'
                                } text-left w-full flex items-center gap-2`}
                            >
                                8-16 kí tự
                                {errorsInput &&
                                (errorsInput === 'minLength' ||
                                    errorsInput === 'maxLength') ? (
                                    <IoCloseCircleOutline />
                                ) : (
                                    password.length >= 8 &&
                                    password.length <= 16 && <FaCheck />
                                )}
                            </p>
                            <button
                                type="submit"
                                className={`px-[10px] hover:opacity-[0.9] mb-[10px] outline-none rounded-sm w-full mt-3 bg-main ${
                                    password !== ''
                                        ? 'cursor-pointer opacity-[1]'
                                        : 'cursor-not-allowed opacity-[0.7]'
                                } text-white py-[10px]`}
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ResetPassword
