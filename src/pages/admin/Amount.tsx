import React, { useEffect, useState } from 'react'
import { orderApi } from '~/apis'
import { useAppSelector } from '~/app/hooks'
import { LineChart } from '~/components'
import { selectAccessToken } from '~/features/UserSlice'
import { Order } from '~/models'
import {
    CompleteOrder,
    PendingOrder,
    TotalOrder,
    TotalSale,
} from '~/utils/svgIcons'

enum Type {
    TotalSales = 'sales',
    TotalOrders = 'orders',
    TotalCompletedOrders = 'done',
    TotalPendingOrders = 'waiting',
}

enum TypeText {
    TotalSales = 'Doanh số theo tháng',
    TotalOrders = 'Đơn hàng theo tháng',
    TotalCompletedOrders = 'Đơn hàng hoàn thành theo tháng',
    TotalPendingOrders = 'Đơn hàng đang đợi theo tháng',
}

enum Label {
    TotalSales = 'Doanh số bán',
    TotalOrders = 'Đơn hàng',
    TotalCompletedOrders = 'Đơn hàng hoàn thành',
    TotalPendingOrders = 'Đơn hàng đang đợi',
}

const Amount = () => {
    const token = useAppSelector(selectAccessToken)
    const [orders, setOrders] = useState<Order[]>([])
    const [totalSales, setTotalSales] = useState<number>(0)
    const [type, setType] = useState<string>(Type.TotalSales)
    const [dataChart, setDataChart] = useState<number[]>([])
    const [text, setText] = useState<string>(TypeText.TotalSales)
    const [label, setLabel] = useState<string>(Label.TotalSales)

    useEffect(() => {
        const fetchData = async () => {
            const response = await orderApi.getAllUserOrder(token, 1, 100)
            const responseTotal = await orderApi.getOrderByType(token, type)
            if (
                response.err === 0 &&
                response.data &&
                responseTotal.err === 0 &&
                responseTotal.data
            ) {
                setOrders(response.data)
                setDataChart(responseTotal.data)
            }
        }
        fetchData()
    }, [type])

    useEffect(() => {
        if (orders.length > 0) {
            const totalAmount = orders.reduce((sum, order) => {
                const orderTotal = order.products.reduce(
                    (productSum, product) => {
                        const productPrice =
                            (1 - product.productDetail.product.discount / 100) *
                            product.productDetail.price *
                            product.quantity
                        return productSum + productPrice
                    },
                    0
                )
                return sum + orderTotal
            }, 15000 * orders.length)
            setTotalSales(totalAmount)
        }
    }, [orders])

    return (
        <div>
            <h1 className="text-xl font-bold mt-2">TSHOP Dashboard</h1>
            <div className="mt-4 bg-white shadow-productCard flex justify-between items-center p-3">
                <div
                    onClick={() => {
                        setType(Type.TotalSales)
                        setText(TypeText.TotalSales)
                        setLabel(Label.TotalSales)
                    }}
                    className="bg-[#a998fa] w-[23%] p-3 rounded hover:cursor-pointer"
                >
                    <div className="mb-3 w-8 h-8 rounded-full border border-dashed border-main bg-white flex items-center justify-center">
                        <TotalSale />
                    </div>
                    <span className="text-sm font-medium capitalize">
                        Doanh số bán hàng (VNĐ)
                    </span>
                    <p className="text-lg font-bold mt-1">
                        {totalSales.toLocaleString()}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setType(Type.TotalOrders)
                        setText(TypeText.TotalOrders)
                        setLabel(Label.TotalOrders)
                    }}
                    className="bg-[#fed7aa] w-[23%] p-3 rounded hover:cursor-pointer"
                >
                    <div className="mb-3 w-8 h-8 rounded-full border border-dashed border-main bg-white flex items-center justify-center">
                        <TotalOrder />
                    </div>
                    <span className="text-sm font-medium capitalize">
                        Tổng số đơn hàng
                    </span>
                    <p className="text-lg font-bold mt-1">
                        {orders.length.toLocaleString()}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setType(Type.TotalCompletedOrders)
                        setText(TypeText.TotalCompletedOrders)
                        setLabel(Label.TotalCompletedOrders)
                    }}
                    className="bg-[#bbf7d0] w-[23%] p-3 rounded hover:cursor-pointer"
                >
                    <div className="mb-3 w-8 h-8 rounded-full border border-dashed border-main bg-white flex items-center justify-center">
                        <CompleteOrder />
                    </div>
                    <span className="text-sm font-medium capitalize">
                        Đơn hàng hoàn thành
                    </span>
                    <p className="text-lg font-bold mt-1">
                        {orders
                            .filter((item) => item.status === 'Done')
                            .length.toLocaleString()}
                    </p>
                </div>
                <div
                    onClick={() => {
                        setType(Type.TotalPendingOrders)
                        setText(TypeText.TotalPendingOrders)
                        setLabel(Label.TotalPendingOrders)
                    }}
                    className="bg-[#fecaca] w-[23%] p-3 rounded hover:cursor-pointer"
                >
                    <div className="mb-3 w-8 h-8 rounded-full border border-dashed border-main bg-white flex items-center justify-center">
                        <PendingOrder />
                    </div>
                    <span className="text-sm font-medium capitalize">
                        Đơn hàng đang đợi
                    </span>
                    <p className="text-lg font-bold mt-1">
                        {' '}
                        {orders
                            .filter(
                                (item) => item.status === 'Waiting Delivering'
                            )
                            .length.toLocaleString()}
                    </p>
                </div>
            </div>
            <div className="bg-white mt-4 pl-1 w-[780px] mx-auto rounded shadow-productCard">
                <LineChart sales={dataChart} label={label} text={text} />
            </div>
        </div>
    )
}

export default Amount
