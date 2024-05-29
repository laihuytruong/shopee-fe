import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Banner, CategoryHome } from '~/components'
import { PaginationInfo, Product } from '~/models'
import { productApi } from '~/apis'
import { Products } from '~/components'
import { listCodeDiscount } from '~/utils/constants'

const Home = () => {
    const [searchParams] = useSearchParams()
    const page = searchParams.get('page')
    const [products, setProducts] = useState<Product[]>([])
    const [count, setCount] = useState<number>(0)
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: searchParams ? +searchParams : 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0,
    })
    const { pathname, search } = useLocation()

    useEffect(() => {
        const fetchProductHome = async () => {
            const response = await productApi.getProducts()
            if (response.err === 0) {
                if (response.data) {
                    setProducts(response.data.data)
                    setPaginationInfo({
                        page: +response.data?.page ?? 1,
                        pageSize: +response.data?.pageSize ?? 10,
                        totalPage: +response.data?.totalPage ?? 1,
                        totalCount: response.count ? +response.count : 0,
                    })
                }
            }
        }
        fetchProductHome()
    }, [page, count])

    return (
        <>
            <div className="w-full pt-[149px] flex flex-col items-center bg-white">
                <div className="w-main flex gap-2">
                    <div className="w-3/5 h-full">
                        <Banner height="235px" />
                    </div>
                    <div className="w-2/5 h-full flex flex-col gap-[5px]">
                        <img
                            src="https://cf.shopee.vn/file/vn-50009109-35e1611b56552099059c7a91b07c9cac_xhdpi"
                            alt="banner1"
                            className="rounded-sm h-[115px]"
                        />
                        <img
                            src="https://cf.shopee.vn/file/vn-50009109-c04aa59b33d99dc80c1b0930457a8857_xhdpi"
                            alt="banner2"
                            className="rounded-sm h-[115px]"
                        />
                    </div>
                </div>
                <div className="w-main mt-[10px] flex justify-around">
                    {listCodeDiscount.map((code) => (
                        <div
                            key={code.id}
                            className="flex flex-col items-center w-[12%] hover:-translate-y-[1px] hover:cursor-pointer"
                        >
                            <div className="w-[45px] h-[45px] rounded-full my-2">
                                <img
                                    className="w-[45px] h-[45px] object-contain"
                                    src={`${code.image}`}
                                    alt="image"
                                />
                            </div>
                            <span className="mb-2 text-[13px] text-[#222222] text-center">
                                {code.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-main bg-white mt-5 py-5">
                <div className="h-[38px] px-5 text-[#0000008a] text-[18px] border-b border-solid border-[rgba(0, 0, 0, .05)]">
                    DANH MỤC
                </div>
                <CategoryHome />
            </div>
            <div className="mt-5 w-main">
                <div className="sticky top-[119px] z-30 text-main text-[16px] bg-white px-[46px] py-[15px] text-center border-b-4 border-solid border-b-main">
                    GỢI Ý HÔM NAY
                </div>
                <div className="pt-[5px]">
                    <Products
                        isShowBtn={true}
                        products={products}
                        paginationInfo={paginationInfo}
                        setCount={setCount}
                        setPaginationInfo={setPaginationInfo}
                        pageShow={pathname}
                        search={search}
                    />
                </div>
            </div>
        </>
    )
}

export default Home
