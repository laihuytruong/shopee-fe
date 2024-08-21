import { DatePicker, Select, Table, TableColumnsType } from 'antd'
import moment from 'moment'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { orderApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { selectAccessToken } from '~/features/UserSlice'
import { Order, PaginationInfo } from '~/models'
import icons from '~/utils/icons'
import type { TimeRangePickerProps } from 'antd'
import { debounce } from 'lodash'
import { toast } from 'react-toastify'

const { RangePicker } = DatePicker
const { IoIosSearch } = icons

const AllOrders = () => {
    const dispatch = useAppDispatch()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 4,
        totalCount: 0,
        totalPage: 1,
    })
    const [orders, setOrders] = useState<Order[]>([])
    const [date, setDate] = useState<{
        minDate: string
        maxDate: string
    } | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const [orderStatus, setOrderStatus] = useState<string>('')

    useEffect(() => {
        const fetchOrders = async () => {
            let response
            if (date !== null) {
                response = await orderApi.filter(
                    token,
                    paginationInfo.page,
                    paginationInfo.pageSize,
                    date.minDate,
                    date.maxDate
                )
            } else if (orderStatus !== 'All' && orderStatus !== '') {
                response = await orderApi.getAllOrderByStatus(
                    token,
                    orderStatus,
                    paginationInfo.page,
                    paginationInfo.pageSize
                )
            } else {
                response = await orderApi.getAllUserOrder(
                    token,
                    paginationInfo.page,
                    paginationInfo.pageSize
                )
            }
            if (response.err === 0 && response.data) {
                setOrders(response.data)
                setPaginationInfo({
                    page: response.page || 1,
                    pageSize: response.pageSize || 4,
                    totalCount: response.totalCount || 0,
                    totalPage: response.totalPage || 1,
                })
            } else {
                setOrders([])
                setPaginationInfo({
                    page: 1,
                    pageSize: 4,
                    totalCount: 0,
                    totalPage: 1,
                })
            }
        }
        fetchOrders()
    }, [count, paginationInfo.page, date, orderStatus])

    const handleTableChange = (pagination: PaginationInfo) => {
        setPaginationInfo({
            ...paginationInfo,
            page: pagination.page,
            pageSize: pagination.pageSize,
        })
        dispatch(increment())
    }

    const handleChangeDate: TimeRangePickerProps['onChange'] = (
        dates,
        dateStrings
    ) => {
        if (!dates || dateStrings[0] === '' || dateStrings[1] === '') {
            setDate(null)
            setPaginationInfo({ ...paginationInfo, page: 1 })
            dispatch(increment())
        } else {
            setDate({ minDate: dateStrings[0], maxDate: dateStrings[1] })
            setPaginationInfo({ ...paginationInfo, page: 1 })
        }
    }

    const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
        onDebouncedSetSearchText(e.target.value)
    }

    const onDebouncedSetSearchText = useCallback(
        debounce(async (text: string) => {
            if (text !== '') {
                const response = await orderApi.search(
                    token,
                    1,
                    paginationInfo.pageSize,
                    text
                )
                console.log('response', response)
                if (response.err === 0 && response.data) {
                    setOrders(response.data)
                    setPaginationInfo({
                        page: response.page || 1,
                        pageSize: response.pageSize || 4,
                        totalCount: response.totalCount || 0,
                        totalPage: response.totalPage || 1,
                    })
                } else {
                    setOrders([])
                    setPaginationInfo({
                        page: 1,
                        pageSize: 4,
                        totalCount: 0,
                        totalPage: 1,
                    })
                }
            } else {
                dispatch(increment())
            }
        }, 200),
        []
    )

    const handleChangeOrderStatus = (value: string) => {
        setOrderStatus(value)
    }

    const handleUpdateStatus = async (order: Order, status: string) => {
        try {
            const response = await orderApi.updateStatus(
                token,
                status,
                order._id
            )
            if (response.err === 0 && response.data) {
                toast.success('Cập nhật trạng thái thành công!')
                dispatch(increment())
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau!')
        }
    }

    const columns: TableColumnsType<Order> = [
        {
            title: 'Người mua hàng',
            dataIndex: ['orderBy', 'name'],
            width: '20%',
            align: 'center',
        },
        {
            title: 'Địa chỉ',
            dataIndex: ['orderBy', 'address'],
            width: '20%',
            align: 'center',
        },
        {
            title: 'SĐT',
            dataIndex: ['orderBy', 'phoneNumber'],
            width: '10%',
            align: 'center',
        },
        {
            title: 'Ngày mua hàng',
            dataIndex: 'createdAt',
            width: '10%',
            align: 'center',
            render: (createdAt: string) =>
                moment(createdAt).format('DD/MM/YYYY-HH:mm:ss'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '15%',
            align: 'center',
            render: (status: string) => {
                const statusRender =
                    status === 'Waiting Delivering'
                        ? 'Chờ vận chuyển'
                        : status === 'Delivering'
                        ? 'Đang vận chuyển'
                        : status === 'Done'
                        ? 'Hoàn thành'
                        : 'Đã hủy'
                return <div>{statusRender}</div>
            },
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'products',
            width: '15%',
            align: 'center',
            render: (products: Order['products']) => {
                const totalAmount = products.reduce((sum, product) => {
                    const productPrice =
                        (1 - product.productDetail.product.discount / 100) *
                        product.productDetail.price *
                        product.quantity
                    return sum + productPrice
                }, 15000)

                return <div>{totalAmount.toLocaleString()} VND</div>
            },
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '10%',
            align: 'center',
            render: (order: Order) => (
                <>
                    {order.status === 'Waiting Delivering' ? (
                        <button
                            onClick={() =>
                                handleUpdateStatus(order, 'Delivering')
                            }
                            className="p-[6px] w-full bg-main text-white rounded-sm hover:opacity-[0.9]"
                        >
                            Giao hàng
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                handleUpdateStatus(order, 'Waiting Delivering')
                            }
                            className="p-[6px] w-full bg-[#ccc] rounded-sm hover:opacity-[0.9]"
                        >
                            Đặt lại
                        </button>
                    )}
                </>
            ),
        },
    ]

    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-bold mt-2">DANH SÁCH ĐƠN HÀNG</h1>
            <div className="flex items-center justify-end mt-2 mb-6">
                <span className="mr-2">Ngày đặt hàng</span>
                <RangePicker onChange={handleChangeDate} />
            </div>
            <div className="flex items-center gap-4 mb-4">
                <Select
                    className="w-[200px]"
                    placeholder={`${
                        orderStatus === '' && 'Lọc theo trạng thái đơn'
                    }`}
                    onChange={handleChangeOrderStatus}
                    value={orderStatus !== '' ? orderStatus : undefined}
                >
                    <Select.Option value={'All'}>Tất cả</Select.Option>
                    <Select.Option value={'Waiting Delivering'}>
                        Chờ vận chuyển
                    </Select.Option>
                    <Select.Option value={'Delivering'}>
                        Đang vận chuyển
                    </Select.Option>
                    <Select.Option value={'Done'}>Hoàn thành</Select.Option>
                    <Select.Option value={'Cancel'}>Đã hủy</Select.Option>
                </Select>
                <div
                    className={`${
                        isFocus
                            ? 'border-[#ff424f] focus:border-[#ff424f]'
                            : 'focus:border-black border-[rgba(0, 0, 0, .14)]'
                    }
                    w-3/5 flex items-center shadow-input_auth border border-solid hover:border-[#ff424f]`}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                >
                    <input
                        type="text"
                        value={searchText}
                        onChange={handleSearch}
                        className="p-[6px] w-full outline-none"
                        placeholder="Tìm kiếm đơn hàng theo tên người dùng hoặc địa chỉ"
                    />
                    <button
                        type="button"
                        className="pl-3 pr-4 bg-transparent outline-none border-none"
                    >
                        <IoIosSearch />
                    </button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={orders}
                size="large"
                tableLayout="fixed"
                pagination={{
                    current: paginationInfo.page,
                    pageSize: paginationInfo.pageSize,
                    total: paginationInfo.totalCount,
                    onChange: (page, pageSize) =>
                        handleTableChange({
                            page,
                            pageSize,
                            totalCount: paginationInfo.totalCount,
                            totalPage: paginationInfo.totalPage,
                        }),
                }}
            />
        </div>
    )
}

export default AllOrders
