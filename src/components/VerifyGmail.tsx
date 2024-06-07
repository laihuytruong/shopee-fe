import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'
import { authApi } from '~/apis'
import { useAppDispatch } from '~/app/hooks'
import { setDataRegister } from '~/features/UserSlice'
import icons from '~/utils/icons'

interface Props {
    onSubmit: (data: { code: string }) => void
    email: string
    errorMsg: string
    setErrorMsg: React.Dispatch<React.SetStateAction<string>>
    setCode: React.Dispatch<React.SetStateAction<string>>
}

const { IoCloseCircleOutline, FaArrowLeftLong } = icons

const VerifyGmail: React.FC<Props> = ({
    onSubmit,
    email,
    errorMsg,
    setErrorMsg,
    setCode,
}) => {
    const { register, handleSubmit, watch } = useForm<{ code: string }>()
    const dispatch = useAppDispatch()
    const code = watch('code', '')

    useEffect(() => {
        setCode(code)
    }, [code])

    const handleReCode = async () => {
        setErrorMsg('')
        const response = await authApi.verify({ email })
        if (response.err === 0) {
            dispatch(
                setDataRegister({
                    code: response.data ? response.data.code : '',
                    time: new Date(),
                    email: email,
                })
            )
        }
    }

    return (
        <>
            <div className="h-20 flex items-center px-8">
                <NavLink to={`/register`} className="hover:cursor-pointer">
                    <FaArrowLeftLong size={30} color="#ee4d2d" />
                </NavLink>
                <span className="text-center flex-1 text-xl text-[#222222]">
                    Nhập mã xác nhận
                </span>
            </div>
            <form
                className="mt-2 px-20 pb-[64px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                {errorMsg !== '' && (
                    <div className="flex gap-2 text-sm mb-[30px] bg-[#fff9fa] border border-solid border-[rgba(255, 66, 79, .2)] rounded-sm py-3 px-[15px]">
                        <IoCloseCircleOutline size={24} color="#ff424f" />
                        <p>{errorMsg}</p>
                    </div>
                )}
                <p className="text-center">Mã xác minh đã được gửi đến </p>
                <p className="text-center text-[16px]">{email}</p>
                <div className="mt-[50px] flex flex-col items-center">
                    <div className="w-[332px] mb-[70px] -mx-8 flex flex-col items-center justify-center">
                        <input
                            type="text"
                            className="w-full border-0 text-[27px] font-normal outline-none bg-transparent pl-1"
                            style={{ letterSpacing: '40px' }}
                            {...register('code')}
                            onKeyDown={(event) => {
                                if (
                                    (event.key < '0' || event.key > '9') &&
                                    event.key !== 'Backspace'
                                ) {
                                    event.preventDefault()
                                }
                            }}
                            maxLength={6}
                        />
                        <div className="w-full flex items-center justify-center">
                            <div className="mr-5 w-[35px] h-[1px] border-t border-solid border-t-[rgba(0, 0, 0, .26)]"></div>
                            <div className="mr-5 w-[35px] h-[1px] border-t border-solid border-t-[rgba(0, 0, 0, .26)]"></div>
                            <div className="mr-5 w-[35px] h-[1px] border-t border-solid border-t-[rgba(0, 0, 0, .26)]"></div>
                            <div className="mr-5 w-[35px] h-[1px] border-t border-solid border-t-[rgba(0, 0, 0, .26)]"></div>
                            <div className="mr-5 w-[35px] h-[1px] border-t border-solid border-t-[rgba(0, 0, 0, .26)]"></div>
                            <div className="mr-5 w-[35px] h-[1px] border-t border-solid border-t-[rgba(0, 0, 0, .26)]"></div>
                        </div>
                    </div>
                    <p className="text-center">
                        Bạn vẫn chưa nhận được?
                        <p
                            onClick={() => handleReCode()}
                            className="text-[#508be3] hover:cursor-pointer"
                        >
                            Gửi lại
                        </p>
                    </p>
                    {errorMsg === '' && (
                        <div className="mt-11 w-full">
                            <button
                                type="submit"
                                className={`w-full shadow-button_auth text-white h-10 px-[10px] outline-none rounded-sm bg-main ${
                                    code.length < 6 &&
                                    'opacity-[0.7] hover:cursor-not-allowed'
                                }`}
                            >
                                KẾ TIẾP
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </>
    )
}

export default VerifyGmail
