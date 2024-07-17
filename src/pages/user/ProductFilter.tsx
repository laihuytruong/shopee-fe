import { useEffect, useState } from 'react'
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router-dom'
import { brandApi, categoryItemApi, productApi } from '~/apis'
import { useAppSelector } from '~/app/hooks'
import {
    CategoryList,
    FilterPanel,
    Products,
    ButtonControl,
} from '~/components'
import { selectAccessToken } from '~/features/UserSlice'
import {
    Brand,
    CategoryItem,
    Product,
    PaginationInfo,
    MenuItem,
} from '~/models'
import { isProductArray, updateURLParams } from '~/utils/constants'
import icons from '~/utils/icons'

const { MdOutlineNavigateNext, MdOutlineNavigateBefore, GrInfo } = icons

const ProductFilter = () => {
    const token = useAppSelector(selectAccessToken)

    const [searchParams] = useSearchParams()
    const pageNumber = searchParams.get('page')
    const sort = searchParams.get('sort')
    const totalRating = searchParams.get('totalRating')
    const price = searchParams.get('price')
    const brandSearch = searchParams.get('brand')
    const keywordSearch = searchParams.get('keyword')

    const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [productSearch, setProductSearch] = useState<Product>({} as Product)
    const [searchData, setSearchData] = useState<Product[]>([])
    const [originalSearchData, setOriginalSearchData] = useState<Product[]>([])
    const [active, setActive] = useState<number>(0)
    const [buttonActive, setButtonActive] = useState<string>('Phổ biến')
    const [selectMenuItem, setSelectMenuItem] = useState<React.ReactNode>('Giá')
    const [count, setCount] = useState<number>(0)
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: pageNumber ? +pageNumber : 1,
        pageSize: 10,
        totalPage: 1,
        totalCount: 0,
    })

    const { slugCategory } = useParams()
    const { pathname, search } = useLocation()
    const nav = useNavigate()
    const activeStyle =
        'p-2 shadow-buttonCategory bg-transparent rounded-sm border border-solid border-[rgba(0, 0, 0, .09)] bg-[#f9f9f9]'
    const nonActiveStyle =
        'hover:cursor-default p-2 rounded-sm border border-solid border-[rgba(0, 0, 0, .09)] bg-[#f9f9f9]'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await productApi.search(
                    keywordSearch ? keywordSearch : '',
                    token
                )
                if (product.err === 1 || product.data?.length === 0) {
                    const [responseCategoryItem, responseBrand] =
                        await Promise.all([
                            categoryItemApi.getCategoryItemBySlug(slugCategory),
                            brandApi.getBrand(slugCategory),
                        ])
                    console.log({ responseCategoryItem, responseBrand })
                    if (responseBrand.data && responseCategoryItem.data) {
                        setCategoryItems([
                            {
                                _id: 'category',
                                categoryItemName: responseCategoryItem.data[0]
                                    .category
                                    ? responseCategoryItem.data[0].category
                                          .categoryName
                                    : '',
                                slug: responseCategoryItem.data[0].category
                                    ? responseCategoryItem.data[0].category.slug
                                    : '',
                            },
                            ...responseCategoryItem.data,
                        ])
                        setBrands(responseBrand.data)
                    }
                } else if (product.data && isProductArray(product.data)) {
                    const responseProductSearch =
                        await productApi.filterProduct(
                            product.data[0].categoryItem.slug,
                            token,
                            paginationInfo.page,
                            paginationInfo.pageSize
                        )
                    const responseCategoryItem =
                        await categoryItemApi.getCategoryItemBySlug(
                            product.data[0].categoryItem.category &&
                                product.data[0].categoryItem.category.slug
                        )
                    const responseBrand = await brandApi.getBrand(
                        product.data[0].categoryItem.category &&
                            product.data[0].categoryItem.category.slug
                    )
                    setProductSearch(product.data[0])
                    if (
                        responseBrand.data &&
                        responseCategoryItem.data &&
                        responseProductSearch.data
                    ) {
                        setCategoryItems(responseCategoryItem.data)
                        setBrands(responseBrand.data)
                        setSearchData(responseProductSearch.data)
                        setOriginalSearchData(responseProductSearch.data)
                        setPaginationInfo({
                            page: responseProductSearch.page
                                ? +responseProductSearch.page
                                : 1,
                            pageSize: responseProductSearch.pageSize
                                ? +responseProductSearch.pageSize
                                : 10,
                            totalPage: responseProductSearch?.totalPage
                                ? +responseProductSearch.totalPage
                                : 1,
                            totalCount: responseProductSearch.totalCount
                                ? +responseProductSearch.totalCount
                                : 0,
                        })
                    }
                } else if (product.data) {
                    const responseProductSearch =
                        await productApi.filterProduct(
                            product.data[0].slug,
                            token,
                            paginationInfo.page,
                            paginationInfo.pageSize
                        )
                    const responseCategoryItem =
                        await categoryItemApi.getCategoryItemBySlug(
                            product.data[0].category?.slug
                        )
                    const responseBrand = await brandApi.getBrand(
                        product.data[0].category?.slug
                    )
                    if (
                        responseBrand.data &&
                        responseCategoryItem.data &&
                        responseProductSearch.data
                    ) {
                        setCategoryItems(responseCategoryItem.data)
                        setBrands(responseBrand.data)
                        setSearchData(responseProductSearch.data)
                        setOriginalSearchData(responseProductSearch.data)
                        setPaginationInfo({
                            page: responseProductSearch.page
                                ? +responseProductSearch.page
                                : 1,
                            pageSize: responseProductSearch.pageSize
                                ? +responseProductSearch.pageSize
                                : 10,
                            totalPage: responseProductSearch?.totalPage
                                ? +responseProductSearch.totalPage
                                : 1,
                            totalCount: responseProductSearch.totalCount
                                ? +responseProductSearch.totalCount
                                : 0,
                        })
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [keywordSearch])

    useEffect(() => {
        const fetchProductData = async () => {
            const responseProduct = await productApi.filterProduct(
                Object.keys(productSearch).length > 0
                    ? productSearch.categoryItem.category?.slug
                    : slugCategory,
                token,
                paginationInfo.page,
                paginationInfo.pageSize
            )
            let productsToFilter: Product[] = []

            if (responseProduct.data) {
                productsToFilter = responseProduct.data
            }
            const filter = await productApi.filter(
                token,
                originalSearchData.length > 0
                    ? originalSearchData
                    : productsToFilter,
                paginationInfo.page,
                paginationInfo.pageSize,
                sort ? sort : '',
                totalRating ? +totalRating : 0,
                price ? price : undefined,
                brandSearch ? brandSearch : undefined
            )
            if (filter.err === 0 && filter.data) {
                if (searchData.length > 0) {
                    setSearchData(filter.data)
                } else {
                    setProducts(filter.data)
                }
                setPaginationInfo({
                    page: filter.page ? +filter.page : 1,
                    pageSize: filter.pageSize ? +filter.pageSize : 10,
                    totalPage: filter?.totalPage ? +filter.totalPage : 1,
                    totalCount: filter.totalCount ? +filter.totalCount : 0,
                })
            } else if (responseProduct.err === 0 && responseProduct.data) {
                setProducts(responseProduct.data)
                setPaginationInfo({
                    page: responseProduct.page ? +responseProduct.page : 1,
                    pageSize: responseProduct.pageSize
                        ? +responseProduct.pageSize
                        : 10,
                    totalPage: responseProduct?.totalPage
                        ? +responseProduct.totalPage
                        : 1,
                    totalCount: responseProduct.totalCount
                        ? +responseProduct.totalCount
                        : 0,
                })
            }
        }

        fetchProductData()
    }, [count, keywordSearch])

    const handlePageChange = (newPage: number) => {
        setCount((prev) => prev + 1)
        setPaginationInfo((prev) => ({
            ...prev,
            page: newPage,
        }))
        const newSearch = updateURLParams(search, 'page', newPage.toString())
        nav(`${pathname}?${newSearch}`)
    }

    const handleSelect = (item?: MenuItem) => {
        if (item && item.sort) {
            setSelectMenuItem(item.children)
            setCount((prev) => prev + 1)
            const newSearch = updateURLParams(search, 'sort', item.sort)
            nav(`${pathname}?${newSearch}`)
        }
    }

    return (
        <div className="mt-[30px] w-main flex">
            <div className="w-[190px] mr-5">
                {!pathname.includes('search') && (
                    <div>
                        <CategoryList
                            categoryItems={categoryItems}
                            search={search}
                            active={active}
                            setActive={setActive}
                            setCount={setCount}
                        />
                    </div>
                )}
                <div>
                    <FilterPanel
                        brands={brands}
                        setCount={setCount}
                        pathname={pathname}
                        search={search}
                    />
                </div>
            </div>
            <div className="flex-1">
                {pathname.includes('search') && (
                    <div className="flex px-5">
                        <GrInfo size={20} />
                        <h1 className="text-[#555] text-[16px] ml-2 mb-6">
                            Kết quả tìm kiếm cho từ khoá
                            <span className="text-main ml-1 text-[14px]">{`'${keywordSearch}'`}</span>
                        </h1>
                    </div>
                )}
                <div className="bg-[rgba(0, 0, 0, .03)] px-5 py-[13px] flex items-center justify-between">
                    <div className="w-4/5">
                        <ButtonControl
                            buttonActive={buttonActive}
                            setButtonActive={setButtonActive}
                            setCount={setCount}
                            search={search}
                            pathname={pathname}
                            selectMenuItem={selectMenuItem}
                            handleSelect={handleSelect}
                        />
                    </div>
                    <div className="flex gap-[18px] items-center w-1/5 justify-end">
                        <span>
                            <span className="text-main">
                                {paginationInfo.page}
                            </span>
                            <span>/{paginationInfo.totalPage}</span>
                        </span>
                        <div>
                            <button
                                onClick={() =>
                                    handlePageChange(
                                        Math.max(1, paginationInfo.page - 1)
                                    )
                                }
                                className={`${
                                    paginationInfo.page === 1
                                        ? `${nonActiveStyle}`
                                        : `${activeStyle}`
                                }`}
                            >
                                <MdOutlineNavigateBefore
                                    color={`${
                                        paginationInfo.page === 1
                                            ? 'rgba(0, 0, 0, .26)'
                                            : 'rgba(0, 0, 0, .8)'
                                    }`}
                                    size={16}
                                />
                            </button>
                            <button
                                onClick={() =>
                                    handlePageChange(
                                        Math.min(
                                            paginationInfo.totalPage,
                                            paginationInfo.page + 1
                                        )
                                    )
                                }
                                className={`${
                                    paginationInfo.page ===
                                    paginationInfo.totalPage
                                        ? `${nonActiveStyle}`
                                        : `${activeStyle}`
                                }`}
                            >
                                <MdOutlineNavigateNext
                                    color={`${
                                        paginationInfo.page ===
                                        paginationInfo.totalPage
                                            ? 'rgba(0, 0, 0, .26)'
                                            : 'rgba(0, 0, 0, .8)'
                                    }`}
                                    size={16}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <Products
                    isShowBtn={false}
                    show={true}
                    paginationInfo={paginationInfo}
                    products={searchData.length > 0 ? searchData : products}
                    setCount={setCount}
                    setPaginationInfo={setPaginationInfo}
                    pageShow={pathname}
                    search={search}
                />
            </div>
        </div>
    )
}

export default ProductFilter
