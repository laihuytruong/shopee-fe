import { NavLink, useNavigate } from 'react-router-dom'
import routes from '~/config/routes'
import { useCallback, useState } from 'react'
import icons from '~/utils/icons'
import { authApi } from '~/apis'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '~/app/hooks'
import { setDataRegister } from '~/features/UserSlice'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

const { FcGoogle } = icons

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<{ email: string }>({ mode: 'onChange' })
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const email = watch('email', '')
    const nav = useNavigate()
    const dispatch = useAppDispatch()

    const onSubmit = useCallback(async () => {
        setIsLoading(true)
        const response = await authApi.verify({ email })
        if (response.err === 0) {
            dispatch(
                setDataRegister({
                    code: response.data ? response.data.code : '',
                    time: new Date(),
                    email,
                })
            )
            setIsLoading(false)
            nav('/register/1')
        }
    }, [email])
    console.log('errors: ', errors)

    return (
        <div className="w-full">
            <div className="bg-[#ed4d2d] h-[600px] flex justify-center">
                <div className=" w-[1040px] bg-custom h-full flex items-center">
                    <form
                        className="w-full h-[452px]"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="bg-white h-full rounded shadow-form_auth w-[400px] float-right">
                            <h2 className="w-full px-[30px] py-[22px] text-xl text-[#222]">
                                Đăng ký
                            </h2>
                            <div className="px-[30px] pb-[30px]">
                                <input
                                    type="text"
                                    placeholder="Nhập email..."
                                    className={`outline-none rounded-sm border border-solid p-3 shadow-input_auth w-full mb-1 ${
                                        errors.email
                                            ? 'bg-[#fff6f7] border-[#ff424f] focus:border-[#ff424f]'
                                            : 'border-[rgba(0, 0, 0, .14)] focus:border-black'
                                    }`}
                                    {...register('email', {
                                        required: 'Vui lòng điền vào mục này',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                            message:
                                                'Email không đúng định dạng',
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <span className="text-[#ff424f] text-xs">
                                        {errors.email.message}
                                    </span>
                                )}
                                <button
                                    type="submit"
                                    className={`px-[10px] mb-[10px] rounded-sm w-full mt-3 bg-main ${
                                        email !== ''
                                            ? 'cursor-pointer opacity-[1]'
                                            : 'cursor-not-allowed opacity-[0.7]'
                                    } text-white py-[10px]`}
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
                                <div className="mt-[25px] text-[12px] flex flex-col items-center">
                                    <span>
                                        Bằng việc đăng kí, bạn đã đồng ý với
                                        Shopee về
                                    </span>
                                    <span className="text-main">
                                        Điều khoản dịch vụ
                                        <span className="text-black"> & </span>
                                        Chính sách bảo mật
                                    </span>
                                </div>
                                <div className="mt-[30px] text-[14px] text-[rgba(0, 0, 0, .26)] text-center">
                                    Bạn đã có tài khoản?
                                    <NavLink
                                        to={routes.LOGIN}
                                        className="text-main ml-1"
                                    >
                                        Đăng nhập
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
