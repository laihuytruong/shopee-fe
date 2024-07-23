import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { selectAccessToken } from '~/features/UserSlice'
import { PaginationInfo, Product } from '~/models'
import { productApi } from '~/apis'

const AllProducts = () => {
    const dispatch = useAppDispatch()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
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
            width: '20%',
            align: 'center',
            render: (image: string) => (
                <div className="flex items-center justify-center">
                    <img
                        src={image.length > 1 ? image[1] : image[0]}
                        alt="thumbnail"
                        className="w-[56px] h-w-[56px]"
                    />
                </div>
            ),
        },
    ]

    return (
        <div className="pt-2">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">DANH SÁCH SẢN PHẨM</h1>
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
            />
        </div>
    )
}

export default AllProducts
