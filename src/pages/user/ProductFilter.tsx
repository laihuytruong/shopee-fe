import { useEffect, useState } from 'react'
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router-dom'
import { brandApi, categoryItemApi, productApi } from '~/apis'
import { CategoryList, FilterPanel, Products } from '~/components'
import ButtonControl from '~/components/ButtonControl'
import {
    Brand,
    CategoryItem,
    Product,
    PaginationInfo,
    MenuItem,
} from '~/models'
import { updateURLParams } from '~/utils/constants'
import icons from '~/utils/icons'

const { MdOutlineNavigateNext, MdOutlineNavigateBefore, GrInfo } = icons

const ProductFilter = () => {
    const [searchParams] = useSearchParams()
    const pageNumber = searchParams.get('page')
    const sort = searchParams.get('sort')
    const totalRating = searchParams.get('totalRating')
    const price = searchParams.get('price')
    const brandSearch = searchParams.get('brand')
    const categoryItemSearch = searchParams.get('categoryItem')
    const keywordSearch = searchParams.get('keyword')

    const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [products, setProducts] = useState<Product[]>([])
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
                const product = await productApi.getProduct(
                    keywordSearch ? keywordSearch : undefined
                )
                console.log('product: ', product)
                if (product.err === 1) {
                    const [responseCategory, responseBrand] = await Promise.all(
                        [
                            categoryItemApi.getCategoryItemBySlug(slugCategory),
                            brandApi.getBrand(slugCategory),
                        ]
                    )

                    if (responseBrand.data && responseCategory.data) {
                        setCategoryItems([
                            {
                                _id: 'category',
                                categoryItemName: responseCategory.data[0]
                                    .category
                                    ? responseCategory.data[0].category
                                          .categoryName
                                    : '',
                                slug: responseCategory.data[0].category
                                    ? responseCategory.data[0].category.slug
                                    : '',
                            },
                            ...responseCategory.data,
                        ])
                        setBrands(responseBrand.data)
                    }
                } else {
                    const responseCategory =
                        await categoryItemApi.getCategoryItemBySlug(
                            product.data?.categoryItem.category?.slug
                        )
                    const responseBrand = await brandApi.getBrand(
                        product.data?.brand.slug
                    )
                    if (responseBrand.data && responseCategory.data) {
                        setCategoryItems([
                            {
                                _id: 'category',
                                categoryItemName: responseCategory.data[0]
                                    .category
                                    ? responseCategory.data[0].category
                                          .categoryName
                                    : '',
                                slug: responseCategory.data[0].category
                                    ? responseCategory.data[0].category.slug
                                    : '',
                            },
                            ...responseCategory.data,
                        ])
                        setBrands(responseBrand.data)
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchProductData = async () => {
            const responseProduct = await productApi.filterProduct(
                slugCategory,
                paginationInfo.page,
                paginationInfo.pageSize,
                sort ? sort : '',
                totalRating ? +totalRating : 0,
                price ? price : undefined,
                brandSearch ? brandSearch : undefined,
                categoryItemSearch ? categoryItemSearch : undefined
            )
            if (responseProduct.data) {
                setProducts(responseProduct.data.data)
                setPaginationInfo({
                    page: +responseProduct.data?.page ?? 1,
                    pageSize: +responseProduct.data?.pageSize ?? 10,
                    totalPage: +responseProduct.data?.totalPage ?? 1,
                    totalCount: responseProduct.count
                        ? +responseProduct.count
                        : 0,
                })
            }
        }

        fetchProductData()
    }, [count])

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
        <div className="mt-[149px] w-main flex">
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
                    products={products}
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
