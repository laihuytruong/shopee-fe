import { Empty } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { orderApi, userApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import routes from '~/config/routes'
import { increment } from '~/features/CounterSlice'
import { selectAccessToken } from '~/features/UserSlice'
import { Order } from '~/models'
import { Cart } from '~/models/cartInterface'

enum Status {
    All = 'Tất Cả',
    WAITING_DELIVERING = 'Chờ Giao Hàng',
    DELIVERING = 'Giao Hàng',
    DONE = 'Hoàn Thành',
    CANCEL = 'Đã Hủy',
}

const statusMapping: { [key: string]: string } = {
    [Status.All]: 'Pending',
    [Status.WAITING_DELIVERING]: 'Waiting Delivering',
    [Status.DELIVERING]: 'Delivering',
    [Status.DONE]: 'Done',
    [Status.CANCEL]: 'Cancel',
}

const reverseStatusMapping = Object.fromEntries(
    Object.entries(statusMapping).map(([key, value]) => [value, key])
)

const Purchase = () => {
    const token = useAppSelector(selectAccessToken)
    const nav = useNavigate()
    const dispatch = useAppDispatch()

    const [orders, setOrders] = useState<Order[]>([])
    const [status, setStatus] = useState<string>(statusMapping[Status.All])
    const [active, setActive] = useState<string>(Status.All)
    const [orderTotal, setOrderTotal] = useState<{ [key: string]: number }>({})

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let response
                if (status === statusMapping[Status.All]) {
                    response = await orderApi.getAllOrder(token)
                } else {
                    response = await orderApi.getOrderByStatus(token, status)
                }

                if (response.err === 0 && response.data) {
                    setOrders(response.data)
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            }
        }
        fetchOrders()
    }, [status])

    useEffect(() => {
        const calculateOrderTotals = (): { [key: string]: number } => {
            if (orders.length === 0) {
                return {}
            }

            const orderTotals = orders.reduce(
                (totals: { [key: string]: number }, order: Order) => {
                    const orderTotal = order.products.reduce(
                        (subtotal, product) => {
                            const price = product.productDetail.price
                            const discount =
                                product.productDetail.product.discount
                            const discountedPrice =
                                discount > 0
                                    ? price * (1 - discount / 100)
                                    : price

                            const productTotal =
                                discountedPrice * product.quantity
                            return subtotal + productTotal
                        },
                        0
                    )

                    totals[order._id] = orderTotal
                    return totals
                },
                {}
            )

            return orderTotals
        }

        const orderTotals = calculateOrderTotals()
        setOrderTotal(orderTotals)
    }, [orders, status])

    const handleChangeStatus = (status: string) => {
        setStatus(statusMapping[status])
        setActive(status)
    }

    const handleReBuy = async (products: Cart[]) => {
        try {
            for (const product of products) {
                const response = await userApi.updateCart({
                    token,
                    pdId: product.productDetail._id,
                    variationOption: product.variationOption._id,
                    quantity: product.quantity,
                })

                if (response.err !== 0) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng',
                        showConfirmButton: false,
                        timer: 1000,
                    })
                    return
                }
            }

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Sản phẩm đã được thêm vào giỏ hàng',
                showConfirmButton: false,
                timer: 1000,
            }).then(() => {
                dispatch(increment())
                nav(routes.CART)
            })
        } catch (error) {
            console.error('Error adding products to cart:', error)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng',
                showConfirmButton: false,
                timer: 1000,
            })
        }
    }

    const handleCancelOrder = async (_id: string) => {
        const response = await orderApi.updateStatus(
            token,
            statusMapping[Status.CANCEL],
            _id
        )
        if (response.err === 0) {
            setStatus(statusMapping[Status.CANCEL])
            setActive(Status.CANCEL)
        }
    }

    console.log('orders: ', orders)
    console.log('orderTotal: ', orderTotal)

    return (
        <div>
            <div className="bg-white flex mb-3 sticky top-0 w-full z-10 rounded-tl-sm rounded-tr-sm">
                {Object.values(Status).map((statusValue) => (
                    <div
                        key={statusValue}
                        onClick={() => handleChangeStatus(statusValue)}
                        className={`${
                            active === statusValue
                                ? 'border-b-[#ee4d2d] text-main'
                                : 'border-b-[rgba(0, 0,0, .09)]'
                        } text-center w-1/5 border-b-2 border-solid hover:cursor-pointer hover:text-main text-[16px] py-4 `}
                    >
                        {statusValue}
                    </div>
                ))}
            </div>
            {orders && orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order._id} className="bg-white mb-3 w-full p-5">
                        <p className="text-main uppercase text-right pb-2 w-full border-b border-solid border-b-[rgba(0, 0, 0, .09)]">
                            {reverseStatusMapping[order.status]}
                        </p>
                        {order.products.length > 0 &&
                            order.products.map((product) => (
                                <div
                                    onClick={() =>
                                        nav(
                                            `/product-detail/${product.productDetail.product.slug}`
                                        )
                                    }
                                    className="flex flex-col py-5 hover:cursor-pointer"
                                >
                                    <div
                                        key={product.productDetail._id}
                                        className="flex items-center"
                                    >
                                        <img
                                            src={product.productDetail.image}
                                            alt="Thumbnail"
                                            className="w-20 h-20 mr-2"
                                        />
                                        <div className="flex flex-col gap-1 flex-1">
                                            <span className="line-clamp-1 text-[16px]">
                                                {
                                                    product.productDetail
                                                        .product.productName
                                                }
                                            </span>
                                            <div className="text-sm text-[#0000008A]">
                                                <span className="mr-1">
                                                    Phân Loại Hàng:
                                                </span>
                                                <span>
                                                    {
                                                        product.variationOption
                                                            .value
                                                    }
                                                </span>
                                            </div>
                                            <span className="text-sm">
                                                x{product.quantity}
                                            </span>
                                        </div>
                                        <div className="w-[15%]">
                                            {product.productDetail.product
                                                .discount > 0 ? (
                                                <p className="flex justify-end gap-[6px]">
                                                    <span className="flex items-start line-through text-[#0000008A]">
                                                        <span className="text-xs underline">
                                                            đ
                                                        </span>
                                                        {product.productDetail.price.toLocaleString()}
                                                    </span>
                                                    <span className="flex items-start text-main">
                                                        <span className="text-xs underline">
                                                            đ
                                                        </span>
                                                        {(
                                                            product
                                                                .productDetail
                                                                .price *
                                                            (1 -
                                                                product
                                                                    .productDetail
                                                                    .product
                                                                    .discount /
                                                                    100)
                                                        ).toLocaleString()}
                                                    </span>
                                                </p>
                                            ) : (
                                                <div className="flex items-start justify-end text-main">
                                                    <span className="text-xs underline">
                                                        đ
                                                    </span>
                                                    {product.productDetail.price.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        <div>
                            <div className="flex justify-end items-center pt-4 border-t border-solid border-t-[rgba(0, 0, 0, .09)]">
                                <span>Thành Tiền: </span>
                                <div className="ml-[10px] text-main text-2xl flex items-start">
                                    <span className="underline leading-none text-[18px]">
                                        đ
                                    </span>
                                    {orderTotal !== undefined &&
                                    Object.keys(orderTotal).length > 0 &&
                                    orderTotal[order._id]
                                        ? orderTotal[order._id].toLocaleString()
                                        : 0}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-3 mt-4">
                            <button
                                onClick={() => handleReBuy(order.products)}
                                className="py-3 px-6 text-white bg-main rounded hover:opacity-[0.9]"
                            >
                                Mua Lại
                            </button>
                            {(status ===
                                statusMapping[Status.WAITING_DELIVERING] ||
                                status ===
                                    statusMapping[Status.DELIVERING]) && (
                                <button
                                    onClick={() => handleCancelOrder(order._id)}
                                    className="py-3 px-6 text-[#555] bg-white rounded border border-solid border-rgba(0, 0, 0, .09) hover:bg-[#00000005]"
                                >
                                    Hủy Đơn Hàng
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="w-full h-[300px] bg-white flex items-center justify-center">
                    <Empty
                        image="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/orderlist/5fafbb923393b712b964.png"
                        imageStyle={{ height: 100 }}
                        description={
                            <span
                                style={{
                                    textAlign: 'center',
                                    display: 'block',
                                    fontSize: '18px',
                                }}
                            >
                                Chưa Có Đơn Hàng
                            </span>
                        }
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default Purchase
