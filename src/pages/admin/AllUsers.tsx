import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { userApi } from '~/apis'
import { PaginationInfo, Role, User } from '~/models'
import icons from '~/utils/icons'
import { ConfirmToast } from '~/components'
import { selectAccessToken } from '~/features/UserSlice'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

const { MdDeleteOutline } = icons

const AllUsers = () => {
    const dispatch = useAppDispatch()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
    const [users, setUsers] = useState<User[]>([])
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 5,
        totalCount: 0,
        totalPage: 1,
    })
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await userApi.getAllUsers(
                token,
                paginationInfo.page,
                paginationInfo.pageSize
            )
            if (response.err === 0 && response.data) {
                setUsers(response.data)
                setPaginationInfo({
                    page: response.page ? response.page : 1,
                    pageSize: response.pageSize ? response.pageSize : 8,
                    totalCount: response.totalCount ? response.totalCount : 0,
                    totalPage: response.totalPage ? response.totalPage : 1,
                })
            } else {
                setUsers([])
            }
        }
        fetchUsers()
    }, [count, paginationInfo.page])

    const handleTableChange = (pagination: PaginationInfo) => {
        setPaginationInfo({
            ...paginationInfo,
            page: pagination.page,
            pageSize: pagination.pageSize,
        })
        dispatch(increment())
    }

    const handleDeleteUser = async (userId: string) => {
        toast(
            <ConfirmToast
                message="Bạn có chắc chắn muốn xóa người dùng này?"
                onConfirm={() => confirmDeleteUser(userId)}
                onCancel={() => console.log('Cancel')}
            />
        )
    }

    const confirmDeleteUser = async (userId: string) => {
        try {
            const response = await userApi.deleteUser(token, userId)
            if (response.err === 0) {
                toast.success('Người dùng đã được xóa thành công!')
                if (paginationInfo.page > 1 && users.length === 1) {
                    setPaginationInfo((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                    }))
                } else {
                    dispatch(increment())
                }
            } else {
                toast.error('Không thể xóa người dùng này!')
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const handleReset = async () => {
        try {
            if (selectedRowKeys.length === 0) {
                toast.warning('Vui lòng chọn ít nhất 1 người dùng để đặt lại')
            } else {
                const response = await userApi.updateUserByAdmin(
                    token,
                    selectedRowKeys,
                    import.meta.env.VITE_USER
                )
                if (response.err === 0) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Đặt lại thành công',
                        showConfirmButton: false,
                        timer: 1000,
                    }).then(() => {
                        dispatch(increment())
                        setSelectedRowKeys([])
                    })
                }
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra!')
        }
    }

    const handleGrantPermission = async () => {
        try {
            if (selectedRowKeys.length === 0) {
                toast.warning('Vui lòng chọn ít nhất 1 người dùng để cấp quyền')
            } else {
                const response = await userApi.updateUserByAdmin(
                    token,
                    selectedRowKeys,
                    import.meta.env.VITE_ADMIN
                )
                if (response.err === 0) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Cấp quyền thành công',
                        showConfirmButton: false,
                        timer: 1000,
                    }).then(() => {
                        dispatch(increment())
                        setSelectedRowKeys([])
                    })
                }
            }
        } catch (error) {
            console.log('error: ', error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys)
        },
    }

    const columns: TableColumnsType<User> = [
        {
            title: 'Username',
            dataIndex: 'username',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '15%',
            align: 'center',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            width: '15%',
            align: 'center',
            render: (address: string) => <div className="">{address}</div>,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            width: '10%',
            align: 'center',
            render: (dateOfBirth: string) => (
                <div>{new Date(dateOfBirth).toLocaleDateString('en-GB')}</div>
            ),
        },
        {
            title: 'Giới tính',
            dataIndex: 'sex',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            width: '10%',
            align: 'center',
            render: (role: Role) => (
                <div>
                    {role.roleName === 'user' ? 'Người dùng' : 'Quản trị'}
                </div>
            ),
        },
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            width: '10%',
            align: 'center',
            render: (avatar: string) => (
                <div className="flex items-center justify-center">
                    <img
                        src={avatar}
                        alt="image"
                        className="w-[56px] h-w-[56px]"
                    />
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '10%',
            align: 'center',
            render: (user: User) => (
                <span className="flex items-center justify-center">
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() => handleDeleteUser(user._id)}
                    >
                        <MdDeleteOutline size={20} />
                    </span>
                </span>
            ),
        },
    ]

    return (
        <div className="pt-2">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">DANH SÁCH NGƯỜI DÙNG</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="bg-[#626262] border-none outline-none rounded-sm p-2 text-white hover:opacity-[0.9]"
                    >
                        Đặt lại
                    </button>
                    <button
                        onClick={handleGrantPermission}
                        className="bg-main border-none outline-none rounded-sm p-2 text-white hover:opacity-[0.9]"
                    >
                        Cấp quyền quản trị
                    </button>
                </div>
            </div>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={users}
                rowKey="_id"
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

export default AllUsers
