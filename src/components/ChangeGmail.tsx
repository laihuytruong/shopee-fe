import { Spin } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { authApi } from '~/apis'
import { LoadingOutlined } from '@ant-design/icons'
import routes from '~/config/routes'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '~/app/hooks'
import { setDataRegister, setIsRegistered } from '~/features/UserSlice'

const ChangeGmail = () => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
    } = useForm<{ emailChange: string }>({
        mode: 'onChange',
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errMsg, setErrorMsg] = useState<string>('')
    const emailChange = watch('emailChange', '')

    const nav = useNavigate()
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (errors.emailChange) {
            setErrorMsg('')
        }
    }, [errors.emailChange])

    const onSubmit = useCallback(async () => {
        setIsLoading(true)
        setErrorMsg('')
        const response = await authApi.verify({ email: emailChange })
        if (response.err === 0) {
            dispatch(
                setDataRegister({
                    code: response.data ? response.data.code : '',
                    time: new Date(),
                    email: emailChange,
                })
            )
            dispatch(setIsRegistered({ isRegistered: false }))
            setIsLoading(false)
            nav(`${routes.REGISTER}/1`)
        } else {
            setErrorMsg(response.msg ? response.msg : '')
            setIsLoading(false)
        }
    }, [emailChange])

    return (
        <div className="flex w-3/5">
            <span className="min-w-[170px] text-[rgba(0, 0,0, .65)] text-[16px] pr-5">
                Địa chỉ email mới
            </span>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
                <input
                    type="text"
                    placeholder="Nhập địa chỉ email mới của bạn"
                    className={`${
                        errMsg !== '' || errors.emailChange
                            ? 'bg-[#fff6f7] border-[#ff424f] focus:border-[#ff424f]'
                            : 'border-[rgba(0, 0, 0, .14)] focus:border-black'
                    } w-full border border-solid rounded-sm shadow-input_me p-[10px] outline-none`}
                    {...register('emailChange', {
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                            message: 'Email không đúng định dạng',
                        },
                    })}
                />
                {(errMsg !== '' || errors.emailChange) && (
                    <div className="mt-2 text-[#ff424f] text-sm">
                        {errMsg ? errMsg : errors.emailChange?.message}
                    </div>
                )}
                <button
                    type="submit"
                    className={`mt-6 px-6 py-3 rounded-sm  ${
                        emailChange.length > 0 && !errors.emailChange
                            ? 'bg-main text-white hover:opacity-[0.9]'
                            : 'hover:cursor-not-allowed bg-[#facac0] text-white shadow-none'
                    }`}
                >
                    {isLoading ? (
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
            </form>
        </div>
    )
}

export default ChangeGmail
