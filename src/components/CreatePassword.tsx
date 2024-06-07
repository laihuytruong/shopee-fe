import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'
import icons from '~/utils/icons'
import { ShowPassword, HidePassword } from '~/utils/svgIcons'

const { IoCloseCircleOutline, FaArrowLeftLong, FaCheck } = icons

interface Props {
    password: string
    setPassword: React.Dispatch<React.SetStateAction<string>>
    onSubmitCreatePassword: () => void
}

const CreatePassword: React.FC<Props> = ({
    password,
    setPassword,
    onSubmitCreatePassword,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<{ password: string }>({ mode: 'onChange' })
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const passwordInput = watch('password', '')
    const errorsInput = errors.password?.type

    useEffect(() => {
        setPassword(passwordInput)
    }, [passwordInput])

    return (
        <>
            <div className="h-20 flex items-center px-8">
                <NavLink to={`/register/1`} className="hover:cursor-pointer">
                    <FaArrowLeftLong size={30} color="#ee4d2d" />
                </NavLink>
                <span className="text-center flex-1 text-xl text-[#222222]">
                    Thiết lập mật khẩu
                </span>
            </div>
            <form
                className="mt-2 px-20 pb-[64px]"
                onSubmit={handleSubmit(onSubmitCreatePassword)}
            >
                <p className="text-center mb-[30px]">
                    Bước cuối! Thiết lập mật khẩu để hoàn tất việc đăng ký.
                </p>
                <div className="flex flex-col items-center">
                    <div className="w-[332px] -mx-8 flex flex-col items-center justify-center">
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
                                onClick={() => setShowPassword(!showPassword)}
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
                                password.length > 0 && <IoCloseCircleOutline />
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
                                password.length > 0 && <IoCloseCircleOutline />
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
                    </div>
                    <div className="mt-6 w-full">
                        <button
                            type="submit"
                            className={`w-full shadow-button_auth text-white h-10 px-[10px] outline-none rounded-sm bg-main ${
                                ((errorsInput &&
                                    (errorsInput === 'minLength' ||
                                        errorsInput === 'maxLength')) ||
                                    !password.match(/[a-z]/) ||
                                    !password.match(/[A-Z]/) ||
                                    password.length === 0) &&
                                'opacity-[0.7] hover:cursor-not-allowed'
                            }`}
                        >
                            ĐĂNG KÝ
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default CreatePassword
