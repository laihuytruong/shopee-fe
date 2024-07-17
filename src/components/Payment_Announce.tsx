import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productApi, productDetailApi, userApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import routes from '~/config/routes'
import { deleteCart, selectCart, setCheckItem } from '~/features/CartSlice'
import { increment } from '~/features/CounterSlice'
import { selectAccessToken } from '~/features/UserSlice'
import { Cart } from '~/models/cartInterface'

const Payment_Announce = () => {
    const cartBuyList: Cart[] = useAppSelector(selectCart)
    const token = useAppSelector(selectAccessToken)

    const { type_payment } = useParams()
    const nav = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        const updateData = async () => {
            if (type_payment === 'success') {
                dispatch(setCheckItem({}))
                dispatch(deleteCart())
                dispatch(increment())
                await userApi.deleteAllItemCart({
                    items: cartBuyList.map((item) => ({
                        pdId: item.productDetail._id,
                        variationOption: item.variationOption._id,
                    })),
                    token,
                    checkAll: false,
                })
                await productApi.updateQuantity(cartBuyList, token)
                await productDetailApi.updateInventory(cartBuyList, token)
            }
        }
        updateData()
    }, [type_payment])

    return (
        <div className="w-full h-[300px] flex justify-center items-center">
            <div className="bg-white rounded w-[400px] flex flex-col justify-center gap-6 p-4 shadow-buttonHome">
                <h1 className="text-xl pb-2 border-b border-solid border-b-[rgba(0, 0, 0, .09)]">
                    {type_payment === 'success'
                        ? 'Thanh Toán Thành Công'
                        : type_payment === 'error' &&
                          'Oops! Thanh Toán Thất Bại Mất Rồi'}
                </h1>
                <button
                    onClick={() => {
                        if (type_payment === 'success') {
                            nav(routes.ORDER)
                        } else if (type_payment === 'error') {
                            nav('/' + routes.HOME)
                        }
                    }}
                    className={`px-6 py-3 rounded-sm w-[80%] text-white hover:opacity-[0.9] ${
                        type_payment === 'success'
                            ? 'bg-main'
                            : type_payment === 'error' && 'bg-[#d8232a]'
                    }`}
                >
                    {type_payment === 'success'
                        ? 'Tiếp Tục Mua Hàng'
                        : type_payment === 'error' && 'Quay Lại Trang Chủ'}
                </button>
            </div>
        </div>
    )
}

export default Payment_Announce
