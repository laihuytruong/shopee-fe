import { Empty, Pagination } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import homeApi from '~/apis/homeApi'
import { ProductHome } from '~/models/productInterfaces'

interface PaginationInfo {
    page: number | undefined
    pageSize: number | undefined
    totalCount: number | undefined
}

interface Props {
    isShowBtn: boolean
}

const ProductsHome: React.FC<Props> = ({ isShowBtn }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const pageNumber = searchParams.get('pageNumber')
    const [products, setProducts] = useState<ProductHome[] | undefined>([])
    const [count, setCount] = useState<number>(0)
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: pageNumber !== null && pageNumber !== undefined ? +pageNumber : 1,
        pageSize: 10,
        totalCount: 0,
    })
    const nav = useNavigate()

    useEffect(() => {
        const fetchProductsHome = async () => {
            const response = await homeApi.getProducts(
                paginationInfo.page,
                paginationInfo.pageSize
            )
            if (response.err === 0) {
                setPaginationInfo({
                    page: response.data?.page,
                    pageSize: response.data?.pageSize,
                    totalCount: response.count,
                })
                setProducts(response.data?.data)
            }
        }
        fetchProductsHome()
    }, [count])

    const handleChangePage = (page: number) => {
        setCount((prev) => prev + 1)
        setPaginationInfo({
            ...paginationInfo,
            page,
        })
        searchParams.set('pageNumber', page.toString())
        setSearchParams(searchParams)
    }

    return (
        <>
            <div className="flex flex-wrap">
                {products && products.length > 0 ? (
                    products.map((product) => (
                        <div className="p-[5px] w-1/6 h-[294px]">
                            <div className="hover:cursor-pointer hover:border-main hover:-translate-y-[1px] bg-white border border-solid border-[rgba(0, 0, 0, .8)] w-full h-full">
                                <div className="relative w-full h-[186px]">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={`${product.image[0]}`}
                                        alt="thumbnail"
                                    />
                                    <div
                                        className={`${
                                            product.discount &&
                                            +product.discount > 0
                                                ? 'visible'
                                                : 'invisible'
                                        } absolute flex items-center justify-center text-xs right-0 top-0 px-1 py-[2px] text-main bg-[#ffe97a]`}
                                    >
                                        {`-${product.discount}%`}
                                    </div>
                                </div>
                                <div className="p-2 w-full h-[98px] flex flex-col justify-between border-t border-solid border-[rgba(5, 5, 5, 0.06)]">
                                    <span className="line-clamp-2 text-ellipsis break-words overflow-hidden">
                                        {product.productName}
                                    </span>
                                    <div className="flex justify-between items-center text-main">
                                        <div>
                                            <span className="text-xs">đ</span>
                                            <span className="text-[16px]">
                                                {product.price.toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="text-xs text-[#0000008a]">
                                            Đã bán{' '}
                                            {`${
                                                product.sold < 1000
                                                    ? product.sold
                                                    : Math.round(
                                                          (+product.sold /
                                                              1000) *
                                                              10
                                                      ) /
                                                          10 +
                                                      'k'
                                            }`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <Empty />
                )}
            </div>
            <div className="flex justify-center">
                {isShowBtn &&
                paginationInfo.pageSize &&
                paginationInfo.totalCount &&
                paginationInfo.totalCount / paginationInfo.pageSize > 2 ? (
                    <button
                        onClick={() => {
                            setPaginationInfo({ ...paginationInfo, page: 2 })
                            setCount((prev) => prev + 1)
                            nav('daily_discover?pageNumber=2')
                        }}
                        className="mt-5 bg-white outline-none rounded px-5 py-[10px] shadow-buttonHome border border-solid border-[rgba(0, 0, 0, .09)] hover:cursor-pointer hover:bg-main hover:text-white"
                    >
                        XEM THÊM
                    </button>
                ) : (
                    <Pagination
                        defaultCurrent={2}
                        onChange={handleChangePage}
                        pageSize={paginationInfo.pageSize}
                        total={paginationInfo.totalCount}
                        className="mt-8 custom-pagination"
                    />
                )}
            </div>
        </>
    )
}

export default ProductsHome
