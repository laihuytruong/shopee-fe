import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ShowPassword, HidePassword } from '~/utils/svgIcons'

interface Props {
    setValue: React.Dispatch<React.SetStateAction<string>>
    setType: React.Dispatch<React.SetStateAction<string | undefined>>
    shadow?: string
    valueName: string
    initValue?: string
    isPhone?: boolean
    isEmail?: boolean
    isPassword?: boolean
    placeholder?: string
    valueData?: string
    showPassword?: boolean
    setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>
    isReset?: boolean
}

type FormValues = {
    [key: string]: string
}

const InputCustom: React.FC<Props> = ({
    setValue,
    setType,
    shadow,
    valueName,
    initValue,
    isPhone,
    isEmail,
    isPassword,
    placeholder,
    valueData,
    showPassword,
    setShowPassword,
    isReset,
}) => {
    const {
        register,
        formState: { errors },
        watch,
        reset,
    } = useForm<FormValues>({ mode: 'onChange' })

    const value = watch(valueName, initValue ? initValue : '')
    const type = errors[valueName]?.type

    useEffect(() => {
        setType(type)
        if (type == undefined) {
            setValue(value)
        }
    }, [value, type])

    useEffect(() => {
        if (isReset) {
            reset({
                [valueName]: '',
            })
        }
    }, [type, isReset])

    return (
        <div>
            {!isPassword ? (
                <input
                    type="text"
                    placeholder={`${placeholder ? placeholder : ''}`}
                    value={value}
                    className={`outline-none ${
                        shadow && shadow
                    } rounded-sm border border-solid p-[10px] w-full mb-1 ${
                        errors[valueName]
                            ? 'bg-[#fff6f7] border-[#ff424f] focus:border-[#ff424f]'
                            : 'border-[rgba(0, 0, 0, .14)] focus:border-black'
                    }`}
                    {...register(valueName, {
                        required: 'Vui lòng điền trường này',
                        ...(isPhone && {
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: 'Số điện thoại chỉ chứa số',
                            },
                        }),
                        ...(isEmail && {
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                message: 'Email không đúng định dạng',
                            },
                        }),
                    })}
                />
            ) : (
                <div
                    className={`${
                        type === 'pattern' || type === 'required'
                            ? 'border-[#ff424f] focus:border-[#ff424f]'
                            : 'focus:border-black border-[rgba(0, 0, 0, .14)]'
                    } flex items-center mb-1 rounded-sm shadow-input_auth border border-solid`}
                >
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={placeholder ? placeholder : ''}
                        className=" p-[10px] w-full outline-none"
                        {...register(valueName, {
                            required: 'Vui lòng điền trường này',
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
                                message:
                                    'Mật khẩu phải dài 8-16 ký tự, chứa ít nhất một ký tự viết hoa và một ký tự viết thường và chỉ bao gồm các chữ cái, số hoặc dấu câu thông thường',
                            },
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (setShowPassword) {
                                setShowPassword(!showPassword)
                            }
                        }}
                        className="pl-3 pr-4 bg-transparent outline-none border-none"
                    >
                        {showPassword ? <HidePassword /> : <ShowPassword />}
                    </button>
                </div>
            )}
            {errors[valueName] && (
                <p className="text-[#ff424f] text-xs">
                    {errors[valueName]?.message}
                </p>
            )}
        </div>
    )
}

export default InputCustom
