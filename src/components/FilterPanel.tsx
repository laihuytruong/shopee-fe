import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brand, PriceInput } from '~/models'
import { updateURLParams } from '~/utils/constants'
import icons from '~/utils/icons'

interface Props {
    brands: Brand[]
    pathname: string
    search: string
    setCount: React.Dispatch<React.SetStateAction<number>>
}

const { MdFilterAlt, MdOutlineStar, IoMdStarOutline } = icons

const FilterPanel: React.FC<Props> = ({
    brands,
    setCount,
    pathname,
    search,
}) => {
    const [checkedItems, setCheckedItems] = useState<{
        [key: string]: boolean
    }>({})
    const [price, setPrice] = useState<PriceInput>({
        minPrice: '',
        maxPrice: '',
    })
    const [error, setError] = useState<string>('')

    const [starRows] = useState([5, 4, 3, 2, 1])

    const nav = useNavigate()

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        brand?: Brand
    ) => {
        if (brand) {
            const isChecked = event.target.checked

            setCheckedItems((prev) => ({
                ...prev,
                [brand._id]: isChecked,
            }))

            const urlParams = new URLSearchParams(search)
            const brandsQuery = urlParams.get('brand')
            let brandsArray = brandsQuery ? brandsQuery.split(',') : []

            if (isChecked) {
                brandsArray.push(brand._id)
                console.log('brandsArray: ', brandsArray)
            } else {
                brandsArray = brandsArray.filter((id) => id !== brand._id)
                console.log('brandsArray: ', brandsArray)
            }
            let newSearch
            if (brandsArray.length > 0) {
                newSearch = updateURLParams(search, 'brand', brandsArray)
            } else {
                newSearch = updateURLParams(search, 'brand', '')
            }
            setCount((prev) => prev + 1)
            nav(`${pathname}?${newSearch}`)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPrice({
            ...price,
            [name]: value,
        })
    }

    const handleSubmit = () => {
        setCount((prev) => prev + 1)
        if (price.minPrice !== '' && price.maxPrice !== '') {
            if (/^\d*$/.test(price.minPrice) && /^\d*$/.test(price.maxPrice)) {
                const priceParam = updateURLParams(
                    search,
                    'price',
                    `${price.minPrice},${price.maxPrice}`
                )
                nav(`${pathname}?${priceParam}`)
                setError('')
            } else {
                setError('Khoảng giá chỉ được nhập số')
            }
        } else {
            setError('Vui lòng điền khoảng giá phù hợp')
        }
    }

    return (
        <div>
            <div className="flex items-center mb-[10px] mt-[30px] gap-[10px] font-bold text-[16px]">
                <MdFilterAlt className="text-gray-400" />
                <h1>BỘ LỌC TÌM KIẾM</h1>
            </div>
            <div>
                <div className="border-b border-solid border-b-[rgba(0, 0, 0, .09)] py-5">
                    <h3 className="mb-[10px]">Theo Thương Hiệu</h3>
                    {brands.map((brand) => (
                        <div key={brand._id} className="flex items-center py-2">
                            <input
                                type="checkbox"
                                className="mr-[10px] cursor-pointer"
                                checked={checkedItems[brand._id] || false}
                                onChange={(event) =>
                                    handleCheckboxChange(event, brand)
                                }
                            />
                            <span>{brand.brandName}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="py-5 border-b border-solid border-b-[rgba(0, 0, 0, .09)]">
                <h3>Khoảng giá</h3>
                <div className="mt-5 mb-[10px] flex justify-center items-center text-xs">
                    <input
                        type="text"
                        className="outline-none w-20 pl-1 h-[30px] bg-white border border-solid border-[rgba(0, 0, 0, .26)] rounded-sm shadow-input"
                        placeholder="đ TỪ"
                        name="minPrice"
                        onChange={(e) => handleInputChange(e)}
                    />
                    <div className="flex-1 h-[1px] bg-[#bdbdbd] mx-[10px]"></div>
                    <input
                        type="text"
                        className="outline-none w-20 pl-1 h-[30px] bg-white border border-solid border-[rgba(0, 0, 0, .26)] rounded-sm shadow-input"
                        placeholder="đ ĐẾN"
                        name="maxPrice"
                        onChange={(e) => handleInputChange(e)}
                    />
                </div>
                {error !== '' && (
                    <div className="text-xs text-[#ff424f] py-[10px] text-center">
                        {error}
                    </div>
                )}
                <button
                    onClick={() => handleSubmit()}
                    className="mt-[10px] w-full text-white bg-main rounded-sm py-[6px]"
                >
                    ÁP DỤNG
                </button>
            </div>
            <div className="py-5 border-b border-solid border-b-[rgba(0, 0, 0, .09)]">
                <h3 className="mb-[10px]">Đánh Giá</h3>
                {starRows.map((numColoredStars, rowIndex) => {
                    return (
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
                                        onClick={() => {
                                            setCount((prev) => prev + 1)
                                            const newSearch = updateURLParams(
                                                search,
                                                'totalRating',
                                                numColoredStars
                                            )
                                            nav(`${pathname}?${newSearch}`)
                                        }}
                                    />
                                ) : (
                                    <IoMdStarOutline
                                        key={starIndex}
                                        size={18}
                                        color="rgb(255, 167, 39)"
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setCount((prev) => prev + 1)
                                            const newSearch = updateURLParams(
                                                search,
                                                'totalRating',
                                                numColoredStars
                                            )
                                            nav(`${pathname}?${newSearch}`)
                                        }}
                                    />
                                )
                            )}
                            {rowIndex !== 0 && (
                                <span className="ml-1 cursor-pointer">
                                    trở lên
                                </span>
                            )}
                        </div>
                    )
                })}
            </div>
            <button className="mt-5 w-full text-white bg-main rounded-sm py-[6px]">
                XÓA TẤT CẢ
            </button>
        </div>
    )
}

export default FilterPanel
