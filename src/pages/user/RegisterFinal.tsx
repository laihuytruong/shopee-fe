import { useCallback, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { authApi } from '~/apis'
import { useAppSelector } from '~/app/hooks'
import { CreatePassword, VerifyGmail } from '~/components'
import {
    selectCodeRegister,
    selectCodeTimeRegister,
    selectEmailRegister,
} from '~/features/UserSlice'
import icons from '~/utils/icons'
import { useCookies } from 'react-cookie'

const { FaCheck, IoMdArrowDropright } = icons

interface ActiveStep {
    step: VerifyStep
    name: string
    isActive: boolean
    icon?: React.ReactNode
}

enum VerifyStep {
    VerifyGmail = 1,
    CreatePassword,
    Complete,
}

const RegisterFinal = () => {
    const [cookies, setCookie] = useCookies()
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [code, setCode] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const { step } = useParams()
    const nav = useNavigate()

    const codeTime = useAppSelector(selectCodeTimeRegister)
    const codeRegister = useAppSelector(selectCodeRegister)
    const email = useAppSelector(selectEmailRegister)

    const steps: ActiveStep[] = [
        {
            step: VerifyStep.VerifyGmail,
            name: 'Xác minh gmail',
            isActive: true,
        },
        {
            step: VerifyStep.CreatePassword,
            name: 'Tạo mật khẩu',
            isActive:
                step === '' + VerifyStep.CreatePassword ||
                step === '' + VerifyStep.Complete,
        },
        {
            step: VerifyStep.Complete,
            name: 'Hoàn thành',
            isActive: step === '' + VerifyStep.Complete,
            icon: <FaCheck />,
        },
    ]

    useEffect(() => {
        const now = new Date().getTime()
        const codeGeneratedTime = new Date(codeTime).getTime()
        const fifteenMinutesInMilliseconds = 15 * 60 * 1000

        if (now - codeGeneratedTime > fifteenMinutesInMilliseconds) {
            setErrorMsg(
                'Mã xác minh vừa nhập đã hết hạn. Vui lòng yêu cầu gửi lại mã mới.'
            )
        }
    }, [codeTime])

    const onSubmit = useCallback(() => {
        if (code !== codeRegister) {
            setErrorMsg(
                'Mã xác minh vừa nhập không chính xác. Vui lòng gửi lại để nhận mã mới.'
            )
        } else {
            nav('/register/2')
        }
    }, [code, codeRegister])

    const onSubmitCreatePassword = useCallback(async () => {
        try {
            const response = await authApi.register({ email, password })
            console.log('response', response)
            if (response.err === 0) {
                if (response.data && response.accessToken) {
                    const user = {
                        userId: response.data._id,
                        token: response.accessToken,
                    }
                    setCookie('user', user, { path: '/' })
                    nav('/register/3')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }, [password])

    return (
        <div className="w-full flex justify-center items-center">
            <div className="py-[50px] w-[500px] h-auto">
                <div className="flex justify-between mb-[60px]">
                    {steps.map((step, index) => (
                        <>
                            <div className="px-[5px] py-[10px] w-[30%] flex flex-col items-center">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full border border-solid ${
                                        step.isActive
                                            ? 'border-[rgba(0, 0, 0, .26)] bg-[#6c0] text-white'
                                            : 'border-[#00000042] text-[#00000042]'
                                    }`}
                                >
                                    {step.step}
                                </div>
                                <p
                                    className={`mt-[5px] ${
                                        step.isActive
                                            ? 'text-[#6c0]'
                                            : 'text-[#00000042]'
                                    } text-xs`}
                                >
                                    {step.name}
                                </p>
                            </div>
                            {index < 2 && (
                                <div className="flex items-center">
                                    <div className="bg-[#00000042] h-[1px] w-[85px] relative bottom-[10px]">
                                        <IoMdArrowDropright
                                            color="#00000042"
                                            className="absolute -right-2 -top-[7px]"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ))}
                </div>
                <div className="bg-white rounded shadow-form_verify ">
                    {step === '1' ? (
                        <VerifyGmail
                            onSubmit={onSubmit}
                            email={email}
                            errorMsg={errorMsg}
                            setErrorMsg={setErrorMsg}
                            setCode={setCode}
                        />
                    ) : step === '2' ? (
                        <CreatePassword
                            password={password}
                            setPassword={setPassword}
                            onSubmitCreatePassword={onSubmitCreatePassword}
                        />
                    ) : (
                        <div className="p-3">
                            <h2 className="text-xl text-center mb-2">
                                Hoàn thành quá trình đăng ký
                            </h2>
                            <NavLink to={'/'} className='w-full text-center text-main block'>Quay lại trang chủ</NavLink>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RegisterFinal
