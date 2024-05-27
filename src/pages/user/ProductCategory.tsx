import { Dropdown } from 'antd'
import { useEffect, useState } from 'react'
import {
    NavLink,
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from 'react-router-dom'
import brandApi from '~/apis/brandApi'
import categoryItemApi from '~/apis/categoryItemApi'
import productApi from '~/apis/productApi'
import { MenuItemsOrNull } from '~/components'
import Products from '~/components/Products'
import { Brand } from '~/models/brandInterfaces'
import { CategoryItem } from '~/models/categoryInterfaces'
import { PaginationInfo } from '~/models/generalInterface'
import { Product } from '~/models/productInterfaces'
import icons from '~/utils/icons'

const {
    FaList,
    IoMdArrowDropright,
    MdFilterAlt,
    MdOutlineStar,
    IoMdStarOutline,
    RiArrowDownSLine,
    MdOutlineNavigateNext,
    MdOutlineNavigateBefore,
} = icons

const ProductCategory = () => {
    const [searchParams] = useSearchParams()
    const pageNumber = searchParams.get('page')
    const sort = searchParams.get('sort')

    const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [active, setActive] = useState<number>(0)
    const [buttonActive, setButtonActive] = useState<string>('Phổ biến')
    const [count, setCount] = useState<number>(0)
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: pageNumber ? +pageNumber : 1,
        pageSize: 2,
        totalCount: 0,
    })

    const { slugCategory } = useParams()
    const { pathname, search } = useLocation()
    const nav = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [responseCategory, responseBrand] = await Promise.all([
                    categoryItemApi.getCategoryItemBySlug(slugCategory),
                    brandApi.getBrand(slugCategory),
                ])
                if (responseBrand.data && responseCategory.data) {
                    setCategoryItems([
                        {
                            _id: 'category',
                            categoryItemName: responseCategory.data[0].category
                                ? responseCategory.data[0].category.categoryName
                                : '',
                            slug: responseCategory.data[0].category
                                ? responseCategory.data[0].category.slug
                                : '',
                        },
                        ...responseCategory.data,
                    ])
                    setBrands(responseBrand.data)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchProductData = async () => {
            const responseProduct = await productApi.getProductBySlug(
                slugCategory,
                paginationInfo.page,
                paginationInfo.pageSize,
                sort ? sort : ''
            )
            if (responseProduct.data) {
                setProducts(responseProduct.data.data)
                setPaginationInfo({
                    page: +responseProduct.data?.page ?? 1,
                    pageSize: +responseProduct.data?.pageSize ?? 10,
                    totalCount: responseProduct.count
                        ? +responseProduct.count
                        : 0,
                })
            }
        }

        fetchProductData()
    }, [count])

    const starRows = [5, 4, 3, 2, 1]
    console.log('search: ', search)

    return (
        <div className="mt-[149px] w-main flex">
            <div className="w-[190px] mr-5">
                <div>
                    <div className="flex items-center border-b border-solid border-b-[rgba(0, 0, 0, .05)] mb-[10px] h-[50px] gap-[10px] font-bold text-[16px]">
                        <FaList />
                        <h1>Tất Cả Danh Mục</h1>
                    </div>

                    {categoryItems.length > 0 &&
                        categoryItems.map((categoryItem, index) => (
                            <NavLink
                                key={categoryItem._id}
                                to={`/category/${categoryItem.slug}${
                                    search ? search : ''
                                }`}
                                className={`${
                                    active === index && 'text-main'
                                } pl-3 py-2 pr-[10px] flex items-center relative`}
                                onClick={() => {
                                    setCount((prev) => prev + 1)
                                    setActive(index)
                                }}
                            >
                                {active === index && (
                                    <span className="absolute top-1/2 left-0 transform -translate-y-1/2">
                                        <IoMdArrowDropright />
                                    </span>
                                )}
                                <span>{categoryItem.categoryItemName}</span>
                            </NavLink>
                        ))}
                </div>
                <div>
                    <div className="flex items-center mb-[10px] mt-[30px] gap-[10px] font-bold text-[16px]">
                        <MdFilterAlt className="text-gray-400" />
                        <h1>BỘ LỌC TÌM KIẾM</h1>
                    </div>
                    <div>
                        <div className="border-b border-solid border-b-[rgba(0, 0, 0, .09)] py-5">
                            <h3 className="mb-[10px]">Theo Danh Mục</h3>
                            {categoryItems &&
                                categoryItems.map((category) => (
                                    <div
                                        key={category._id}
                                        className="flex items-center py-2"
                                    >
                                        <input
                                            type="checkbox"
                                            name=""
                                            id=""
                                            className="mr-[10px]"
                                        />
                                        <span className="">{`${category.categoryItemName}`}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div>
                        <div className="border-b border-solid border-b-[rgba(0, 0, 0, .09)] py-5">
                            <h3 className="mb-[10px]">Theo Thương hiệu</h3>
                            {brands &&
                                brands.map((brand) => (
                                    <div
                                        key={brand._id}
                                        className="flex items-center py-2"
                                    >
                                        <input
                                            type="checkbox"
                                            name=""
                                            id=""
                                            className="mr-[10px]"
                                        />
                                        <span className="">{`${brand.brandName}`}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="py-5 border-b border-solid border-b-[rgba(0, 0, 0, .09)]">
                        <h3>Khoảng giá</h3>
                        <div className="mt-5 mb-[10px] flex justify-center items-center text-xs">
                            <input
                                type="text"
                                className="w-20 pl-1 h-[30px] bg-white border border-solid border-[rgba(0, 0, 0, .26)] rounded-sm shadow-input"
                                placeholder="đ TỪ"
                            />
                            <div className="flex-1 h-[1px] bg-[#bdbdbd] mx-[10px]"></div>
                            <input
                                type="text"
                                className="w-20 pl-1 h-[30px] bg-white border border-solid border-[rgba(0, 0, 0, .26)] rounded-sm shadow-input"
                                placeholder="đ ĐẾN"
                            />
                        </div>
                        <button className="mt-[10px] w-full text-white bg-main rounded-sm py-[6px]">
                            ÁP DỤNG
                        </button>
                    </div>
                    <div className="py-5 border-b border-solid border-b-[rgba(0, 0, 0, .09)]">
                        <h3 className="mb-[10px]">Đánh Giá</h3>
                        <div>
                            {starRows.map((numColoredStars, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    className="flex px-1 py-[5px] items-center"
                                >
                                    {Array.from({ length: 5 }, (_, starIndex) =>
                                        starIndex < numColoredStars ? (
                                            <MdOutlineStar
                                                key={starIndex}
                                                size={16}
                                                color="rgb(255, 167, 39)"
                                                className="cursor-pointer"
                                            />
                                        ) : (
                                            <IoMdStarOutline
                                                key={starIndex}
                                                size={18}
                                                color="rgb(255, 167, 39)"
                                                className="cursor-pointer"
                                            />
                                        )
                                    )}
                                    {rowIndex !== 0 && (
                                        <span className="ml-1 cursor-pointer">
                                            trở lên
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="mt-5 w-full text-white bg-main rounded-sm py-[6px]">
                        XÓA TẤT CẢ
                    </button>
                </div>
            </div>
            <div className="flex-1">
                <div className="bg-[rgba(0, 0, 0, .03)] px-5 py-[13px] flex items-center justify-between">
                    <div className="flex h-[34px] items-center">
                        <span className="text-[#555] ">Sắp xếp theo</span>
                        <div className="ml-8 flex gap-2">
                            <button
                                onClick={() => {
                                    if (buttonActive !== 'Phổ biến') {
                                        setButtonActive('Phổ biến')
                                    }
                                }}
                                className={`${
                                    buttonActive === 'Phổ biến'
                                        ? 'bg-main text-white'
                                        : 'bg-white'
                                } px-4 py-2 rounded`}
                            >
                                Phổ biến
                            </button>
                            <button
                                onClick={() => {
                                    if (buttonActive !== 'Mới nhất') {
                                        setButtonActive('Mới nhất')
                                        setCount((prev) => prev + 1)
                                        nav(
                                            `${pathname}${search}${
                                                search ? '&' : '?'
                                            }sort=-createdAt`
                                        )
                                    }
                                }}
                                className={`${
                                    buttonActive === 'Mới nhất'
                                        ? 'bg-main text-white'
                                        : 'bg-white'
                                } px-4 py-2 rounded`}
                            >
                                Mới nhất
                            </button>
                            <button
                                onClick={() => {
                                    if (buttonActive !== 'Bán chạy') {
                                        setButtonActive('Bán chạy')
                                    }
                                }}
                                className={`${
                                    buttonActive === 'Bán chạy'
                                        ? 'bg-main text-white'
                                        : 'bg-white'
                                } px-4 py-2 rounded`}
                            >
                                Bán chạy
                            </button>
                            <Dropdown
                                menu={{
                                    items: MenuItemsOrNull([
                                        'Giá: Thấp đến Cao',
                                        'Giá: Cao đến Thấp',
                                    ]),
                                }}
                            >
                                <div className="flex items-center justify-between bg-white px-4 py-2 rounded cursor-pointer">
                                    <span className="mr-20">Giá</span>
                                    <RiArrowDownSLine />
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="flex gap-[18px] items-center">
                        <span>
                            <span className="text-main">1</span>
                            <span>
                                /
                                {paginationInfo.totalCount /
                                    paginationInfo.pageSize >
                                0
                                    ? paginationInfo.totalCount /
                                      paginationInfo.pageSize
                                    : 1}
                            </span>
                        </span>
                        <div>
                            <button className="p-2 rounded-sm border border-solid border-[rgba(0, 0, 0, .09)] bg-[#f9f9f9]">
                                <MdOutlineNavigateBefore
                                    color="rgba(0, 0, 0, .26)"
                                    size={16}
                                />
                            </button>
                            <button className="p-2 shadow-buttonCategory bg-transparent rounded-sm border border-solid border-[rgba(0, 0, 0, .09)] bg-[#f9f9f9]">
                                <MdOutlineNavigateNext
                                    color="rgba(0, 0, 0, .8)"
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
                    pageShow={`category/${categoryItems[0]?.slug}`}
                    search={search}
                />
            </div>
        </div>
    )
}

export default ProductCategory
