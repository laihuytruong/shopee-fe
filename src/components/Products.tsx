import { Empty, Pagination } from 'antd'
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { PaginationInfo, Product } from '~/models'
import { updateURLParams } from '~/utils/constants'
import StarRating from './StarRating'

interface Props {
    isShowBtn: boolean
    show?: boolean
    products: Product[]
    paginationInfo: PaginationInfo
    setCount: React.Dispatch<React.SetStateAction<number>>
    setPaginationInfo: React.Dispatch<React.SetStateAction<PaginationInfo>>
    pageShow: string
    search: string
}

const Products = (props: Props) => {
    const {
        isShowBtn,
        paginationInfo,
        products,
        setCount,
        setPaginationInfo,
        show,
        pageShow,
        search,
    } = props

    const nav = useNavigate()

    const handleChangePage = (page: number) => {
        setCount((prev) => prev + 1)
        setPaginationInfo({
            ...paginationInfo,
            page,
        })
        const newSearch = updateURLParams(search, 'page', page.toString())
        nav(`${pageShow}?${newSearch}`)
    }

    return (
        <>
            <div className="flex flex-wrap">
                {products.length > 0 ? (
                    products.map((product) => (
                        <NavLink
                            to={`/product-detail/${product.slug}`}
                            key={product._id}
                            className={`p-[5px] ${
                                !show ? 'w-1/6' : 'w-1/5'
                            } h-[310px]`}
                        >
                            <div
                                className={`${
                                    show
                                        ? 'hover:shadow-productCard'
                                        : 'hover:border-main'
                                } hover:cursor-pointer hover:-translate-y-[1px] bg-white border border-solid border-[rgba(0, 0, 0, .8)] w-full h-full`}
                            >
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
                                <div className="p-2 w-full h-[124px] flex flex-col justify-between border-t border-solid border-[rgba(5, 5, 5, 0.06)]">
                                    <span className="line-clamp-2 text-ellipsis break-words overflow-hidden">
                                        {product.productName}
                                    </span>
                                    <div>
                                        {product.totalRating === 0 ? (
                                            <span className="text-xs text-[rgba(0, 0, 0, .65)]">
                                                Chưa có đánh giá
                                            </span>
                                        ) : (
                                            <StarRating
                                                rating={product.totalRating}
                                            />
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center text-main pb-2">
                                        <div className="flex items-center">
                                            <span className="text-xs underline mr-[1px]">
                                                đ
                                            </span>
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
                        </NavLink>
                    ))
                ) : (
                    <Empty />
                )}
            </div>
            <div className="flex justify-center">
                {isShowBtn ? (
                    <button
                        onClick={() => {
                            setPaginationInfo({ ...paginationInfo, page: 2 })
                            setCount((prev) => prev + 1)
                            nav(
                                `daily_discover?page=${
                                    paginationInfo.totalPage >= 2 ? 2 : 1
                                }`
                            )
                        }}
                        className="mt-5 bg-white outline-none rounded px-5 py-[10px] shadow-buttonHome border border-solid border-[rgba(0, 0, 0, .09)] hover:cursor-pointer hover:bg-main hover:text-white"
                    >
                        XEM THÊM
                    </button>
                ) : products.length > 0 ? (
                    <Pagination
                        defaultCurrent={show ? 1 : 2}
                        onChange={handleChangePage}
                        pageSize={paginationInfo.pageSize}
                        total={paginationInfo.totalCount}
                        current={paginationInfo.page}
                        className="mt-8 custom-pagination"
                    />
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}

export default Products
