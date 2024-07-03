import { ChangeEvent, useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { selectAccessToken, selectUser, setUser } from '~/features/UserSlice'
import { User } from '~/models'
import type { DatePickerProps, UploadFile } from 'antd'
import { DatePicker, Space, Modal } from 'antd'
import dayjs from 'dayjs'
import { maskEmail, maskPhoneNumber, updateURLParams } from '~/utils/constants'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChangeGmail, InputCustom, UploadAvatar } from '~/components/user'
import { userApi } from '~/apis'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { increment } from '~/features/CounterSlice'

const MyAccount = () => {
    const user: User = useAppSelector(selectUser)
    const token = useAppSelector(selectAccessToken)
    const dispatch = useAppDispatch()
    const [formValue, setFormValue] = useState<{
        email: string
        sex: string
        dateOfBirth: Date | null
    }>({
        email: user.email,
        sex: user.sex,
        dateOfBirth: user.dateOfBirth,
    })

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [phoneNumber, setPhoneNumber] = useState<string>(
        user.phoneNumber ? user.phoneNumber : ''
    )
    const [name, setName] = useState<string>(user.name ? user.name : '')
    const [username, setUsername] = useState<string>(
        user.username ? user.username : ''
    )
    const [address, setAddress] = useState<string>(
        user.address ? user.address : ''
    )
    const [type, setType] = useState<string | undefined>()

    const initialFileList: UploadFile[] = user.avatar
        ? [{ uid: '-1', name: 'avatar.png', status: 'done', url: user.avatar }]
        : []

    const [fileList, setFileList] = useState<UploadFile[]>(initialFileList)

    const { handleSubmit } = useForm<{
        username: string
        name: string
        address: string
        phoneNumber: string
        email: string
        sex: string
        dateOFBirth: Date
        avatar: File
    }>({ mode: 'onChange' })

    const { pathname, search } = useLocation()
    const nav = useNavigate()

    const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormValue({
            ...formValue,
            sex: event.target.value,
        })
    }

    const onChange: DatePickerProps['onChange'] = (date) => {
        setFormValue({
            ...formValue,
            dateOfBirth: date ? date.toDate() : null,
        })
    }

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleOk = async () => {
        try {
            const dateOfBirth = user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString()
                : new Date('2001-01-01')
            const userData = {
                ...user,
                phoneNumber,
                dateOfBirth: dateOfBirth,
            }
            const response = await userApi.updateUser({
                user: userData as User,
                token,
            })
            dispatch(
                setUser({
                    user: response.data ? response.data : ({} as User),
                })
            )
            setIsModalOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        setPhoneNumber('')
    }

    console.log('phoneNumber: ', phoneNumber)

    const onSubmit = useCallback(() => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cập nhật hồ sơ',
            showConfirmButton: false,
            timer: 1500,
        }).then(async () => {
            const userData = {
                ...user,
                username,
                name,
                address,
                phoneNumber,
                email: formValue.email,
                sex: formValue.sex,
                dateOfBirth: formValue.dateOfBirth
                    ? new Date(formValue.dateOfBirth)
                    : new Date('01/01/2001'),
            }
            const response = await userApi.updateUser({
                user: userData as User,
                token,
            })
            const file = fileList && (fileList[0].originFileObj as File)
            const responseUpload = await userApi.uploadAvatar({
                token: token,
                avatar: file,
            })
            if (response.err === 0 || responseUpload.err === 0) {
                if (response.data) {
                    dispatch(
                        setUser({
                            user: response.data
                                ? {
                                      ...response.data,
                                      avatar: responseUpload.data
                                          ? responseUpload.data.avatar
                                          : response.data.avatar,
                                  }
                                : ({} as User),
                        })
                    )
                    dispatch(increment())
                }
            }
        })
    }, [formValue, username, name, address, phoneNumber, fileList])

    return (
        <div className="px-[30px] pb-[10px] min-h-[500px]">
            <div className="py-[18px] border-b border-solid border-b-[#efefef]">
                <h1 className="text-[#333] text-[18px] font-medium">
                    {search.includes('change-email')
                        ? 'Thay đổi địa chỉ email'
                        : 'Hồ Sơ Của Tôi'}
                </h1>
                {!search.includes('change-email') && (
                    <p className="text-[#555] text-sm mt-1">
                        Quản lý thông tin hồ sơ để bảo mật tài khoản
                    </p>
                )}
            </div>
            <div className="pt-[30px] flex">
                {!search.includes('change-email') ? (
                    <>
                        <div className="flex-1 pr-[50px]">
                            <Modal
                                title={`${
                                    phoneNumber !== ''
                                        ? 'Thay đổi số điện thoại'
                                        : 'Thêm số điện thoại'
                                }`}
                                open={isModalOpen}
                                onOk={handleOk}
                                onCancel={handleCancel}
                                okText="Lưu"
                                okButtonProps={{
                                    className: 'custom-ok-button',
                                }}
                                cancelButtonProps={{
                                    className: 'custom-cancel-button',
                                }}
                            >
                                <InputCustom
                                    setValue={setPhoneNumber}
                                    setType={setType}
                                    valueName="phoneNumber"
                                    initValue={user.phoneNumber}
                                    isPhone={true}
                                    placeholder="Nhập số điện thoại"
                                    valueData={phoneNumber}
                                />
                            </Modal>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <table className="w-[602px]">
                                    <tr>
                                        <td className="w-1/5 text-right text-[rgba(85, 85, 85, .8)] pb-[54px]">
                                            Tên đăng nhập
                                        </td>
                                        <td className="flex-1 pl-5 pb-[30px]">
                                            <InputCustom
                                                setValue={setUsername}
                                                setType={setType}
                                                valueName="username"
                                                initValue={user.username}
                                                valueData={user.username}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/5 text-right text-[rgba(85, 85, 85, .8)] pb-[50px]">
                                            Tên
                                        </td>
                                        <td className="flex-1 pl-5 pb-[30px]">
                                            <InputCustom
                                                setValue={setName}
                                                setType={setType}
                                                valueName="name"
                                                initValue={user.name}
                                                valueData={user.name}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/5 text-right text-[rgba(85, 85, 85, .8)] pb-[50px]">
                                            Địa chỉ
                                        </td>
                                        <td className="flex-1 pl-5 pb-[30px]">
                                            <InputCustom
                                                setValue={setAddress}
                                                setType={setType}
                                                valueName="name"
                                                initValue={user.address}
                                                valueData={user.address}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/5 text-right text-[rgba(85, 85, 85, .8)] pb-[30px]">
                                            Email
                                        </td>
                                        <td className="flex-1 pl-5 pb-[30px]">
                                            <span>
                                                {maskEmail(formValue.email)}
                                            </span>
                                            <span
                                                onClick={() => {
                                                    const newSearch =
                                                        updateURLParams(
                                                            search,
                                                            'change-email',
                                                            true
                                                        )
                                                    nav(
                                                        `${pathname}?${newSearch}`
                                                    )
                                                }}
                                                className="ml-2 underline text-blue-600 hover:cursor-pointer"
                                            >
                                                Thay đổi
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/5 text-right text-[rgba(85, 85, 85, .8)] pb-[30px]">
                                            Số điện thoại
                                        </td>
                                        <td className="flex-1 pl-5 pb-[30px]">
                                            <span>
                                                {user.phoneNumber ? (
                                                    <>
                                                        {maskPhoneNumber(
                                                            user.phoneNumber
                                                        )}
                                                        <span
                                                            onClick={showModal}
                                                            className="ml-2 underline text-blue-600 hover:cursor-pointer"
                                                        >
                                                            Thay đổi
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span
                                                        onClick={showModal}
                                                        className="underline text-blue-600 hover:cursor-pointer"
                                                    >
                                                        Thêm
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/5 text-right text-[rgba(85, 85, 85, .8)] pb-[30px]">
                                            Giới tính
                                        </td>
                                        <td className="flex-1 pl-5 pb-[30px] flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    id="male"
                                                    value="male"
                                                    onChange={
                                                        handleGenderChange
                                                    }
                                                    checked={
                                                        formValue.sex === 'male'
                                                    }
                                                />
                                                <label htmlFor="male">
                                                    Nam
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    id="female"
                                                    value="female"
                                                    onChange={
                                                        handleGenderChange
                                                    }
                                                    checked={
                                                        formValue.sex ===
                                                        'female'
                                                    }
                                                />
                                                <label htmlFor="female">
                                                    Nữ
                                                </label>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    id="other"
                                                    value="other"
                                                    onChange={
                                                        handleGenderChange
                                                    }
                                                    checked={
                                                        formValue.sex ===
                                                        'other'
                                                    }
                                                />
                                                <label htmlFor="other">
                                                    Khác
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/5 text-right text-[rgba(85, 85, 85, .8)] pb-[30px]">
                                            Ngày sinh
                                        </td>
                                        <td className="flex-1 pl-5 pb-[30px]">
                                            <Space direction="vertical">
                                                <DatePicker
                                                    format={{
                                                        format: 'DD/MM/YYYY',
                                                        type: 'mask',
                                                    }}
                                                    value={
                                                        formValue.dateOfBirth
                                                            ? dayjs(
                                                                  formValue.dateOfBirth
                                                              )
                                                            : undefined
                                                    }
                                                    onChange={onChange}
                                                />
                                            </Space>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-1/5"></td>
                                        <td className="flex-1 pl-5 pb-[30px]">
                                            <button
                                                disabled={
                                                    type == undefined
                                                        ? false
                                                        : true
                                                }
                                                className={`px-5 h-10 bg-main text-white rounded-sm ${
                                                    type == undefined
                                                        ? 'hover:opacity-[0.9]'
                                                        : 'hover:cursor-not-allowed opacity-[0.7]'
                                                }`}
                                            >
                                                Lưu
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </div>
                        <div className="w-[232px] h-auto">
                            <div className="h-1/2 w-full border-l border-solid border-l-[#efefef] flex justify-center items-center">
                                <UploadAvatar
                                    fileList={fileList}
                                    setFileList={setFileList}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <ChangeGmail />
                )}
            </div>
        </div>
    )
}

export default MyAccount
