import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import productApi from '~/apis/productApi'
import ProductsHome from '~/components/user/Products'
import { PaginationInfo } from '~/models/generalInterface'
import { Product } from '~/models/productInterfaces'

const DailyDiscover = () => {
    const [searchParams] = useSearchParams()
    const page = searchParams.get('page')
    const [products, setProducts] = useState<Product[]>([])
    const [count, setCount] = useState<number>(0)
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: page ? +page : 1,
        pageSize: 1,
        totalCount: 0,
        totalPage: 0,
    })

    useEffect(() => {
        const fetchProductHome = async () => {
            const response = await productApi.getProducts(paginationInfo.page)
            if (response.err === 0) {
                if (response.data) {
                    setProducts(response.data)
                    setPaginationInfo({
                        page: response.page ? +response.page : 1,
                        pageSize: response.pageSize ? +response.pageSize : 10,
                        totalPage: response?.totalPage
                            ? +response.totalPage
                            : 1,
                        totalCount: response.totalCount
                            ? +response.totalCount
                            : 0,
                    })
                }
            }
        }
        fetchProductHome()
    }, [count])

    return (
        <div className="pt-10 w-main">
            <div className="mb-8 w-full relative flex justify-center h-14">
                <h1 className="px-5 flex items-center justify-center py-[18px] text-xl bg-main text-white z-10 rounded-lg">
                    GỢI Ý HÔM NAY
                </h1>
                <div className="absolute left-0 top-1/2 w-full border-t border-dotted border-t-black"></div>
            </div>
            <ProductsHome
                isShowBtn={false}
                products={products}
                paginationInfo={paginationInfo}
                setCount={setCount}
                setPaginationInfo={setPaginationInfo}
                pageShow="daily_discover"
            />
        </div>
    )
}

export default DailyDiscover
