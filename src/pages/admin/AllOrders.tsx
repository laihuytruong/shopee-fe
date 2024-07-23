import { DatePicker, Divider, Select, Table, TableColumnsType } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { orderApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { selectAccessToken } from '~/features/UserSlice'
import { Order, PaginationInfo } from '~/models'
import icons from '~/utils/icons'

const { RangePicker } = DatePicker
const { IoIosSearch, HiOutlinePencilSquare, MdDeleteOutline } = icons

const AllOrders = () => {
    const dispatch = useAppDispatch()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 5,
        totalCount: 0,
        totalPage: 1,
    })
    const [orders, setOrders] = useState<Order[]>([])

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await orderApi.getAllUserOrder(
                token,
                paginationInfo.page,
                paginationInfo.pageSize
            )
            if (response.err === 0 && response.data) {
                setOrders(response.data)
                setPaginationInfo({
                    page: response.page ? response.page : 1,
                    pageSize: response.pageSize ? response.pageSize : 8,
                    totalCount: response.totalCount ? response.totalCount : 0,
                    totalPage: response.totalPage ? response.totalPage : 1,
                })
            }
        }
        fetchOrders()
    }, [count, paginationInfo.page])

    const handleTableChange = (pagination: PaginationInfo) => {
        setPaginationInfo({
            ...paginationInfo,
            page: pagination.page,
            pageSize: pagination.pageSize,
        })
        dispatch(increment())
    }

    const columns: TableColumnsType<Order> = [
        {
            title: 'Người mua hàng',
            dataIndex: ['orderBy', 'username'],
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
            width: '20%',
            align: 'center',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: '10%',
            align: 'center',
            render: (createdAt: string) =>
                moment(createdAt).format('DD/MM/YYYY'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'status',
            width: '10%',
            align: 'center',
        },
    ]

    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-bold mt-2">DANH SÁCH ĐƠN HÀNG</h1>
            <div className="flex items-center justify-end mt-2 mb-6">
                <span className="mr-2">Ngày đặt hàng</span>
                <RangePicker />
            </div>
            <div className="flex items-center gap-4 mb-4">
                <button className="p-[6px] px-4 bg-[#ccc] rounded-sm hover:opacity-[0.9]">
                    Đặt lại
                </button>
                <button className="p-[6px] px-4 bg-main text-white rounded-sm opacity-[0.9] hover:opacity-[1]">
                    Giao hàng loạt
                </button>
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
