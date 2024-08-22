import React, { useEffect, useState } from 'react'
import { Divider, Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { PaginationInfo, Product } from '~/models'
import { productApi } from '~/apis'
import icons from '~/utils/icons'
import { toast } from 'react-toastify'
import { ConfirmToast } from '~/components'
import { useNavigate } from 'react-router-dom'
import admin_routes from '~/config/admin_routes'
import { selectAccessToken } from '~/features/UserSlice'

const { HiOutlinePencilSquare, MdDeleteOutline } = icons

const AllProducts = () => {
    const dispatch = useAppDispatch()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
    const nav = useNavigate()
    const [products, setProducts] = useState<Product[]>([])
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 4,
        totalCount: 0,
        totalPage: 1,
    })

    useEffect(() => {
        const fetchProducts = async () => {
            const { page, pageSize } = paginationInfo
            const response = await productApi.getProducts(page, pageSize)
            if (response.err === 0 && response.data) {
                setProducts(response.data)
                setPaginationInfo({
                    page: response.page ? response.page : 1,
                    pageSize: response.pageSize ? response.pageSize : 5,
                    totalCount: response.totalCount ? response.totalCount : 0,
                    totalPage: response.totalPage ? response.totalPage : 1,
                })
            }
        }
        fetchProducts()
    }, [count, paginationInfo.page])

    const handleTableChange = (pagination: PaginationInfo) => {
        setPaginationInfo({
            ...paginationInfo,
            page: pagination.page,
            pageSize: pagination.pageSize,
        })
        dispatch(increment())
    }

    const handleUpdateProduct = (productId: string) => {
        nav(`/admin/products/update/${productId}`)
    }

    const handleDeleteProduct = async (productId: string) => {
        toast(
            <ConfirmToast
                message="Bạn có chắc chắn muốn xóa sản phẩm này?"
                onConfirm={() => confirmDeleteProduct(productId)}
                onCancel={() => console.log('Cancel')}
            />
        )
    }

    const confirmDeleteProduct = async (productId: string) => {
        try {
            const response = await productApi.deleteProduct(token, productId)
            if (response.err === 0) {
                toast.success('Sản phẩm đã được xóa thành công!')
                if (paginationInfo.page > 1 && products.length === 1) {
                    setPaginationInfo((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                    }))
                } else {
                    dispatch(increment())
                }
            } else {
                toast.error('Không thể xóa sản phẩm này!')
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const columns: TableColumnsType<Product> = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName',
            width: '43%',
            align: 'center',
        },
        {
            title: 'Tên thương hiệu',
            dataIndex: ['brand', 'brandName'],
            width: '12%',
            align: 'center',
        },
        {
            title: 'Tên phân loại thành phần',
            dataIndex: ['categoryItem', 'categoryItemName'],
            width: '15%',
            align: 'center',
        },
        {
            title: 'Đánh giá',
            dataIndex: 'totalRating',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Đã bán',
            dataIndex: 'sold',
            width: '5%',
            align: 'center',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            width: '10%',
            align: 'center',
            render: (image: string) => (
                <div className="flex items-center justify-center">
                    <img
                        src={image[0]}
                        alt="thumbnail"
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
            render: (product: Product) => (
                <span className="flex items-center justify-center">
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleUpdateProduct(product._id)
                        }}
                    >
                        <HiOutlinePencilSquare size={20} />
                    </span>
                    <Divider type="vertical" />
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProduct(product._id)
                        }}
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
                <h1 className="text-xl font-bold">DANH SÁCH SẢN PHẨM</h1>
                <button
                    className="bg-main px-4 py-2 text-white rounded hover:opacity-[0.9]"
                    onClick={() => nav(`${admin_routes.ADD_PRODUCTS}`)}
                >
                    Thêm sản phẩm
                </button>
            </div>
            <Table
                columns={columns}
                dataSource={products}
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
                onRow={(record) => ({
                    onClick: () => nav(`/admin/product-detail/${record.slug}`),
                })}
            />
        </div>
    )
}

export default AllProducts
