import { useNavigate, useParams } from 'react-router-dom'
import routes from '~/config/routes'

const Payment_Announce = () => {
    const { type_payment } = useParams()
    const nav = useNavigate()

    return (
        <div className="w-full h-[300px] flex justify-center items-center">
            <div className="bg-white rounded w-[400px] flex flex-col justify-center gap-6 p-4 shadow-buttonHome">
                <h1 className="text-xl pb-2 border-b border-solid border-b-[rgba(0, 0, 0, .09)]">
                    {type_payment === 'success'
                        ? 'Thanh Toán Thành Công'
                        : 'Oops! Thanh Toán Thất Bại Mất Rồi'}
                </h1>
                <button
                    onClick={() => nav('/' + routes.HOME)}
                    className={`px-6 py-3 rounded-sm w-[80%] text-white hover:opacity-[0.9] ${
                        type_payment === 'success' ? 'bg-main' : 'bg-[#d8232a]'
                    }`}
                >
                    {type_payment === 'success'
                        ? 'Tiếp Tục Mua Hàng'
                        : 'Quay Lại Trang Chủ'}
                </button>
            </div>
        </div>
    )
}

export default Payment_Announce
