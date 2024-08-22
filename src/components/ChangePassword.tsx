import React, { useCallback, useEffect, useState } from 'react'
import InputCustom from './InputCustom'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { User } from '~/models'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { selectAccessToken, selectUser, setUser } from '~/features/UserSlice'
import { userApi } from '~/apis'
import icons from '~/utils/icons'
import { useNavigate } from 'react-router-dom'
import routes from '~/config/routes'

const { IoCloseCircleOutline } = icons

const ChangePassword = () => {
    const user: User = useAppSelector(selectUser)
    const token = useAppSelector(selectAccessToken)
    const { handleSubmit } = useForm<{
        oldPassword: string
        newPassword: string
    }>({ mode: 'onChange' })

    const [oldPassword, setOldPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [type, setType] = useState<string | undefined>()
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] =
        useState<boolean>(false)

    const dispatch = useAppDispatch()
    const nav = useNavigate()

    useEffect(() => {
        if (
            oldPassword !== '' ||
            newPassword !== '' ||
            confirmPassword !== ''
        ) {
            setErrorMsg('')
        }
    }, [oldPassword, newPassword, confirmPassword])

    const onSubmit = useCallback(async () => {
        try {
            const userData = {
                ...user,
                oldPassword,
                newPassword,
                confirmPassword,
                dateOfBirth: user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : new Date('2001-01-01'),
            }
            const response = await userApi.updateUser({
                user: userData as User,
                token,
            })
            if (response.err === 1) {
                setErrorMsg(response.msg ? response.msg : '')
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Đổi mật khẩu thành công',
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    dispatch(
                        setUser({
                            user: response.data ? response.data : ({} as User),
                        })
                    )
                    nav(routes.MY_ACCOUNT)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }, [oldPassword, newPassword, confirmPassword])

    return (
        <div className="px-[30px] pb-[10px] min-h-[520px]">
            <div className="py-[18px] border-b border-solid border-b-[#efefef]">
                <h1 className="text-[#333] text-[18px] font-medium">
                    Đổi mật khẩu
                </h1>
                <p className="text-[#555] text-sm mt-1">
                    Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho
                    người khác
                </p>
            </div>
            <div className="pt-[30px]">
                {errorMsg !== '' && (
                    <div className="text-[#ff424f] w-2/5 text-sm m-auto flex items-center gap-2 p-2 bg-[#fff6f7] border-[#ff424f] focus:border-[#ff424f] mb-5">
                        <IoCloseCircleOutline size={20} />
                        <span>{errorMsg}</span>
                    </div>
                )}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="m-auto w-full"
                >
                    <table className="w-[70%]">
                        <tr>
                            <td
                                className={`w-[30%] text-right text-[rgba(85, 85, 85, .8)] ${
                                    oldPassword.length >= 0 && type == undefined
                                        ? 'pb-[40px]'
                                        : 'pb-[60px]'
                                }`}
                            >
                                Mật khẩu cũ
                            </td>
                            <td className="flex-1 pl-5 pb-[30px]">
                                <InputCustom
                                    setValue={setOldPassword}
                                    setType={setType}
                                    valueName="oldPassword"
                                    valueData={oldPassword}
                                    placeholder="Nhập mật khẩu cũ"
                                    isPassword={true}
                                    showPassword={showOldPassword}
                                    setShowPassword={setShowOldPassword}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td
                                className={`w-[30%] text-right text-[rgba(85, 85, 85, .8)] ${
                                    newPassword.length >= 0 && type == undefined
                                        ? 'pb-[40px]'
                                        : 'pb-[60px]'
                                }`}
                            >
                                Mật khẩu mới
                            </td>
                            <td className="flex-1 pl-5 pb-[30px]">
                                <InputCustom
                                    setValue={setNewPassword}
                                    setType={setType}
                                    valueName="newPassword"
                                    valueData={newPassword}
                                    placeholder="Nhập mật khẩu mới"
                                    isPassword={true}
                                    showPassword={showNewPassword}
                                    setShowPassword={setShowNewPassword}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td
                                className={`w-[30%] text-right text-[rgba(85, 85, 85, .8)] ${
                                    confirmPassword.length >= 0 &&
                                    type == undefined
                                        ? 'pb-[40px]'
                                        : 'pb-[60px]'
                                }`}
                            >
                                Xác nhận mật khẩu
                            </td>
                            <td className="flex-1 pl-5 pb-[30px]">
                                <InputCustom
                                    setValue={setConfirmPassword}
                                    setType={setType}
                                    valueName="confirmPassword"
                                    valueData={confirmPassword}
                                    placeholder="Xác nhận mật khẩu"
                                    isPassword={true}
                                    showPassword={showConfirmPassword}
                                    setShowPassword={setShowConfirmPassword}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="w-1/5"></td>
                            <td className="flex-1 pl-5 pb-[30px]">
                                <button
                                    disabled={
                                        oldPassword !== '' &&
                                        newPassword !== '' &&
                                        confirmPassword !== '' &&
                                        type == undefined
                                            ? false
                                            : true
                                    }
                                    className={`px-5 h-10 bg-main text-white rounded-sm ${
                                        oldPassword !== '' &&
                                        newPassword !== '' &&
                                        confirmPassword !== '' &&
                                        type == undefined
                                            ? 'hover:opacity-[0.9]'
                                            : 'hover:cursor-not-allowed opacity-[0.7]'
                                    }`}
                                >
                                    Xác nhận
                                </button>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword
