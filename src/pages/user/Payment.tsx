import { useEffect, useState } from 'react'
import { useAppSelector } from '~/app/hooks'
import { selectCart } from '~/features/CartSlice'
import { selectAccessToken, selectUser } from '~/features/UserSlice'
import { User } from '~/models'
import { Cart } from '~/models/cartInterface'
import icons from '~/utils/icons'
import { loadStripe } from '@stripe/stripe-js'
import { stripeApi } from '~/apis'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

const { FaLocationDot } = icons

const Payment = () => {
    const user: User = useAppSelector(selectUser)
    const token = useAppSelector(selectAccessToken)
    const cartBuyList: Cart[] = useAppSelector(selectCart)

    const [totalAmount, setTotalAmount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const total = cartBuyList.reduce((acc, item) => {
            return acc + item.productDetail.price * item.quantity
        }, 0)
        setTotalAmount(total)
    }, [cartBuyList])

    const handlePayment = async () => {
        setIsLoading(true)
        const stripe = await loadStripe(`${import.meta.env.VITE_STRIPE_KEY}`)
        const response = await stripeApi.payment({
            token,
            cart: cartBuyList,
        })
        if (response.err === 0 && response.data) {
            setIsLoading(false)
            const result = await stripe?.redirectToCheckout({
                sessionId: response.data.id,
            })
            if (result && result.error) {
                console.log(result.error.message)
            }
        } else {
            setIsLoading(false)
            console.log(response.err)
        }
    }

    return (
        <div className="w-main">
            <div className="mt-3 pt-7 pb-6 px-[30px] bg-white">
                <h1 className="text-main font-medium text-xl flex items-center rounded">
                    <FaLocationDot className="mr-2" />
                    Địa Chỉ Nhận Hàng
                </h1>
                <div className="mt-4">
                    <span className="text-[#222] font-bold text-[16px]">
                        {user.name}
                    </span>
                    <span className="text-[#222] font-bold text-[16px] ml-2">
                        {user.phoneNumber}
                    </span>
                    <span className="ml-5 text-[16px]">{user.address}</span>
                </div>
            </div>
            <div className="mt-3">
                {cartBuyList.length > 0 &&
                    cartBuyList.map((cart, index) => (
                        <div className="py-6 px-[30px] bg-white rounded mb-3">
                            {index === 0 && (
                                <div className="flex items-center text-[16px] mb-5">
                                    <span className="w-[55%] text-[#222]">
                                        Sản Phẩm
                                    </span>
                                    <span className="text-[#0000008A] w-[15%] text-center">
                                        Đơn Giá
                                    </span>
                                    <span className="text-[#0000008A] w-[15%] text-center">
                                        Số Lượng
                                    </span>
                                    <span className="text-[#0000008A] w-[15%] text-center">
                                        Thành Tiền
                                    </span>
                                </div>
                            )}
                            <div>
                                <div className="flex items-center">
                                    <div className="flex items-center gap-4 w-[55%]">
                                        <img
                                            src={cart.productDetail.image}
                                            alt="Image detail"
                                            className="w-10 h-10 object-cover"
                                        />
                                        <p className="line-clamp-1 w-3/5 text-sm text-[#222]">
                                            {
                                                cart.productDetail.product
                                                    .productName
                                            }
                                        </p>
                                        <div className="flex text-center items-center text-sm text-[#929292]">
                                            <span>
                                                {
                                                    cart.variationOption
                                                        .variationId.name
                                                }
                                                :{' '}
                                            </span>
                                            <span>
                                                {cart.variationOption.value}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-[15%] text-center">
                                        {cart.productDetail.price.toLocaleString()}
                                    </div>
                                    <span className="text-center w-[15%]">
                                        {cart.quantity}
                                    </span>
                                    <span className="w-[15%] text-center flex items-start justify-center">
                                        <span className="text-xs underline">
                                            đ
                                        </span>
                                        {(
                                            cart.productDetail.price *
                                            cart.quantity
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center mt-6">
                                    <span className="w-[85%] text-right">
                                        Phí Vận chuyển:
                                    </span>
                                    <span className="w-[15%] text-center flex items-start justify-center">
                                        <span className="text-xs underline">
                                            đ
                                        </span>{' '}
                                        {(15000).toLocaleString()}
                                    </span>
                                </div>

                                <div className="mt-6 border-t border-solid border-t-[rgba(0,0,0,.09)] pt-5 flex items-center">
                                    <span className="w-[85%] text-right">
                                        Tổng số tiền ({cart.quantity}) sản phẩm:{' '}
                                    </span>
                                    <span className="text-center flex items-start justify-center text-main text-xl w-[15%]">
                                        <span className="text-sm underline">
                                            đ
                                        </span>
                                        {(
                                            cart.productDetail.price *
                                                cart.quantity +
                                            15000
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="bg-white rounded p-6">
                <div className="flex gap-3 items-center">
                    <h1 className="text-xl font-medium">
                        Phương Thức Thanh Toán
                    </h1>
                    <button className="bg-main p-3 rounded-sm hover:cursor-default text-white">
                        Thẻ Tín Dụng/Ghi Nợ
                    </button>
                </div>
                <div className="pt-4 border-t border-solid border-t-[rgba(0,0,0,.09)] mt-8 flex flex-col items-end text-[14px] gap-2">
                    <p className="flex items-center w-full">
                        <span className="w-[87%] text-right">
                            Tổng Tiền Hàng
                        </span>
                        <div className="flex items-start w-[13%] justify-end">
                            <span className="text-xs underline">đ</span>
                            {totalAmount.toLocaleString()}
                        </div>
                    </p>
                    <p className="flex items-center w-full">
                        <span className="w-[87%] text-right">
                            Phí Vận Chuyển
                        </span>
                        <span className="flex items-start w-[13%] justify-end">
                            <span className="text-xs underline">đ</span>
                            {(15000 * cartBuyList.length).toLocaleString()}
                        </span>
                    </p>
                    <p className="flex items-center w-full">
                        <span className="w-[87%] text-right">
                            Tổng Thanh Toán
                        </span>
                        <span className="flex items-start w-[13%] justify-end text-main text-xl">
                            <span className="text-xs underline">đ</span>
                            {(
                                totalAmount +
                                15000 * cartBuyList.length
                            ).toLocaleString()}
                        </span>
                    </p>
                </div>
                <div
                    onClick={() => handlePayment()}
                    className="pt-4 border-t border-solid border-t-[rgba(0,0,0,.09)] mt-8 text-right"
                >
                    <button className="px-10 py-3 bg-main rounded-sm hover:opacity-[0.9] text-white">
                        {isLoading ? (
                            <>
                                <span className="mr-1">Đặt Hàng</span>
                                <Spin
                                    indicator={
                                        <LoadingOutlined
                                            style={{ fontSize: 24 }}
                                            spin
                                        />
                                    }
                                />
                            </>
                        ) : (
                            'Đặt Hàng'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Payment
