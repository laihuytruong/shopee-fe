import { Spin } from 'antd'
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import routes from '~/config/routes'
import icons from '~/utils/icons'
import { LoadingOutlined } from '@ant-design/icons'
import { authApi } from '~/apis'
import { ForgotPasswordMail } from '~/utils/svgIcons'
import { useAppDispatch } from '~/app/hooks'
import { setEmail, setResetToken } from '~/features/UserSlice'

const { FaArrowLeftLong, IoCloseCircleOutline } = icons

const ForgotPassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<{ email: string }>({ mode: 'onChange' })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isClickButton, setIsClickButton] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)

    const email = watch('email', '')
    const dispatch = useAppDispatch()
    const nav = useNavigate()

    const onSubmit = useCallback(async () => {
        setIsLoading(true)
        setIsError(false)
        if (isClickButton) {
            nav(`${routes.LOGIN}`)
        } else {
            const response = await authApi.forgotPassword({ email })
            if (response.err === 0) {
                dispatch(
                    setResetToken({
                        resetToken: response.msg ? response.msg : '',
                    })
                )
                setIsError(false)
                setIsLoading(false)
                setIsClickButton(true) 
                dispatch(setEmail({ email }))
            } else {
                setIsLoading(false)
                setIsError(true)
            }
        }
    }, [email])

    return (
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
                            Đặt lại mật khẩu
                        </span>
                    </div>
                    <div className="px-20 pb-[46px]">
                        {isClickButton ? (
                            <>
                                <div className="flex justify-center w-full">
                                    <ForgotPasswordMail />
                                </div>
                                <p className="text-[#000000CC] text-sm text-center mt-[25px]">
                                    Mã xác minh đã được gửi đến địa chỉ email{' '}
                                    <p className="text-main">{email}</p>
                                </p>
                                <p className="text-[#000000CC] text-sm text-center mb-[25px]">
                                    Vui lòng xác minh
                                </p>
                            </>
                        ) : (
                            <>
                                {isError && (
                                    <div className="flex items-center gap-2 bg-[#fff9fa] mb-5 border border-solid border-[#ff424f33] p-[10px]">
                                        <IoCloseCircleOutline color="#ff424f" />
                                        <p className="text-sm text-center">
                                            Không tìm thấy tài khoản
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Nhập email..."
                                    className={`outline-none rounded-sm border border-solid p-2 w-full mb-1 ${
                                        errors.email
                                            ? 'bg-[#fff6f7] border-[#ff424f] focus:border-[#ff424f]'
                                            : 'border-[rgba(0, 0, 0, .14)] focus:border-black'
                                    }`}
                                    {...register('email', {
                                        required: 'Email không hợp lệ',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                            message: 'Email không hợp lệ',
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <span className="text-[#ff424f] text-xs">
                                        {String(errors.email.message)}
                                    </span>
                                )}
                            </>
                        )}
                        <button
                            type="submit"
                            className={`px-[10px] ${
                                isClickButton && 'mt-10'
                            } hover:opacity-[0.9] mb-[10px] outline-none rounded-sm w-full mt-3 bg-main ${
                                email !== ''
                                    ? 'cursor-pointer opacity-[1]'
                                    : 'cursor-not-allowed opacity-[0.7]'
                            } text-white py-[10px]`}
                        >
                            {isClickButton ? (
                                'OK'
                            ) : isLoading ? (
                                <Spin
                                    indicator={
                                        <LoadingOutlined
                                            style={{ fontSize: 24 }}
                                            spin
                                        />
                                    }
                                />
                            ) : (
                                'Tiếp theo'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassword
