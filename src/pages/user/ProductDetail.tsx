import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { configurationApi, userApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { StarRating } from '~/components'
import routes from '~/config/routes'
import { increment } from '~/features/CounterSlice'
import { selectAccessToken, selectUser } from '~/features/UserSlice'
import { Product, Configuration, User } from '~/models'
import icons from '~/utils/icons'

const { FaCartPlus } = icons

const ProductDetail = () => {
    const user: User = useAppSelector(selectUser)
    const token = useAppSelector(selectAccessToken)
    const [listProductDetail, setListProductDetail] = useState<Configuration[]>(
        []
    )
    const [product, setProduct] = useState<Product>()
    const [quantity, setQuantity] = useState<number>(1)
    const [totalDetail, setTotalDetail] = useState<number>(0)
    const [detailActive, setDetailActive] = useState<number>()
    const [imageShow, setImageShow] = useState<string>('')
    const [errMsg, setErrMsg] = useState<string>('')
    const [priceRange, setPriceRange] = useState<{
        minPrice: number
        maxPrice: number
    }>({
        minPrice: 0,
        maxPrice: 0,
    })
    const { slugProduct } = useParams()
    const nav = useNavigate()
    const dispatch = useAppDispatch()

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response =
                    await configurationApi.getConfigurationByDetail({
                        slug: slugProduct ? slugProduct : '',
                        token,
                    })
                if (response.err === 0 && response.data) {
                    setListProductDetail(response.data.configurations)
                    setProduct(
                        response.data.configurations[0].productDetailId.product
                    )
                    setPriceRange({
                        minPrice: response.data.minPrice,
                        maxPrice: response.data.maxPrice,
                    })
                    const total = response.data.configurations.reduce(
                        (accumulator, currentValue) =>
                            accumulator +
                            currentValue.productDetailId.inventory,
                        0
                    )
                    setTotalDetail(total)
                    setImageShow(
                        response.data.configurations[0].productDetailId.product
                            .image[1]
                    )
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchDetail()
    }, [slugProduct])

    const handleQuantity = (type: string) => {
        setQuantity((prevQuantity) => {
            if (type === 'increase') {
                return prevQuantity === totalDetail
                    ? totalDetail
                    : prevQuantity + 1
            } else if (type === 'decrease') {
                return prevQuantity > 1 ? prevQuantity - 1 : 1
            }
            return prevQuantity
        })
    }

    const handleClickDetail = (detail: Configuration, index: number) => {
        if (index !== undefined && index === detailActive) {
            setDetailActive(undefined)
            setImageShow(listProductDetail[0].productDetailId.product.image[1])
        } else {
            setDetailActive(index)
            setTotalDetail(detail.productDetailId.inventory)
            setImageShow(detail.productDetailId.image)
        }
    }

    const handleCart = async (isBuy: boolean) => {
        try {
            if (detailActive === undefined) {
                setErrMsg('Vui lòng chọn Phân loại hàng')
            } else {
                const response = await userApi.updateCart({
                    token,
                    pdId: listProductDetail[detailActive].productDetailId._id,
                    variationOption:
                        listProductDetail[detailActive].variationOptionId._id,
                    quantity: quantity,
                })
                if (isBuy === true) {
                    if (response.err === 0) {
                        setErrMsg('')
                        dispatch(increment())
                        nav(routes.CART)
                    }
                } else {
                    if (response.err === 0) {
                        setErrMsg('')
                        dispatch(increment())
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Sản phẩm đã được thêm vào giỏ hàng',
                            showConfirmButton: false,
                            timer: 1000,
                        })
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Thêm vào giỏ hàng thất bại',
                            showConfirmButton: false,
                            timer: 1000,
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="mt-5 w-main">
            <div className="flex gap-1 text-sm">
                <span className="text-[#05a]">Shopee {`> `}</span>
                <span>
                    <span className="text-[#05a]">
                        {product && product.categoryItem.category?.categoryName}
                    </span>{' '}
                    {` > `}
                </span>
                <span>
                    <span className="text-[#05a]">
                        {product && product.categoryItem.categoryItemName}
                    </span>
                    {` > `}
                </span>
                <span>{product && product.productName}</span>
            </div>
            <div className="mt-5 flex bg-white rounded shadow-buttonCategory">
                <div className="w-[450px] p-[15px]">
                    <div>
                        <img src={imageShow} alt="Ảnh" />
                    </div>
                    <div
                        className={`flex justify-center mt-[10px] w-full gap-3`}
                    >
                        {product?.image.map((image, index) => (
                            <>
                                {index > 0 && (
                                    <div
                                        onClick={() => setImageShow(image)}
                                        key={index}
                                        onMouseEnter={() => setImageShow(image)}
                                        onMouseLeave={() =>
                                            setImageShow(
                                                listProductDetail[0]
                                                    .productDetailId.product
                                                    .image[1]
                                            )
                                        }
                                        className={`hover:cursor-pointer hover:border-main border-2 border-solid w-[18%]`}
                                    >
                                        <img
                                            src={image}
                                            alt="Ảnh detail"
                                            className="w-full h-full"
                                        />
                                    </div>
                                )}
                            </>
                        ))}
                    </div>
                </div>
                <div className="flex-1 mt-5 ml-5 mr-[35px]">
                    <h1 className="text-xl font-medium line-clamp-2">
                        {product?.productName}
                    </h1>
                    <div className="mt-[10px] flex items-center">
                        <div className="flex items-center pr-[15px]">
                            <span className="border-b-[#ee4d2d] border-b border-solid mr-1 text-main text-[16px]">
                                {product?.totalRating}
                            </span>
                            <StarRating
                                rating={
                                    product?.totalRating
                                        ? product.totalRating
                                        : 0
                                }
                                color="#ee4d2d"
                            />
                        </div>
                        <div className="flex items-center px-[15px] border-x border-solid border-x-[rgba(0, 0, 0, .14)]">
                            <span className="text-[#767676] text-sm capitalize">
                                <span className="border-b border-solid border-b-[#555] text-[#222] text-[16px] mr-1 pb-[3px]">
                                    {product?.rating.length}
                                </span>{' '}
                                Đánh giá
                            </span>
                        </div>
                        <div className="flex items-center pl-[15px]">
                            <span className="text-[#767676] text-sm capitalize">
                                <span className="border-b border-solid border-b-[#555] text-[#222] text-[16px] mr-1 pb-[3px]">
                                    {product?.sold}
                                </span>{' '}
                                Đã bán
                            </span>
                        </div>
                    </div>
                    <div className="mt-[10px] flex items-center pt-[15px] py-5 text-main gap-4 font-medium text-3xl">
                        {product?.discount !== undefined &&
                            +product?.discount > 0 && (
                                <span className="pl-5 flex items-center text-[#929292] text-[16px] line-through">
                                    <span className="text-xs underline mr-[2px] font-thin pb-1">
                                        đ
                                    </span>
                                    {product?.price.toLocaleString()}
                                </span>
                            )}
                        {+priceRange.minPrice < +priceRange.maxPrice ? (
                            <>
                                <span
                                    className={`${
                                        product?.discount !== undefined &&
                                        product?.discount === 0 &&
                                        'pl-5'
                                    } flex items-start`}
                                >
                                    <span className="text-xl underline mr-1 font-thin">
                                        đ
                                    </span>
                                    {product?.discount !== undefined &&
                                    product.discount > 0
                                        ? (
                                              +priceRange.minPrice *
                                              (1 - product.discount / 100)
                                          ).toLocaleString()
                                        : priceRange.minPrice.toLocaleString()}
                                </span>
                                <span>-</span>
                                <span className="flex items-start">
                                    <span className="text-xl underline mr-1 font-thin">
                                        đ
                                    </span>
                                    {product?.discount !== undefined &&
                                    product.discount > 0
                                        ? (
                                              +priceRange.maxPrice *
                                              (1 - product.discount / 100)
                                          ).toLocaleString()
                                        : priceRange.maxPrice.toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="flex items-start pl-5">
                                <span className="text-xl underline mr-1 font-thin">
                                    đ
                                </span>
                                {product?.discount && product.discount > 0
                                    ? (
                                          +priceRange.maxPrice *
                                          (1 - product.discount / 100)
                                      ).toLocaleString()
                                    : priceRange.maxPrice.toLocaleString()}
                            </span>
                        )}
                        {product?.discount !== undefined &&
                            product.discount > 0 && (
                                <div className="px-1 py-1 bg-main rounded-sm text-white text-xs font-semibold">
                                    {product?.discount} GIẢM
                                </div>
                            )}
                    </div>
                    <div className="mt-[25px] px-5">
                        <div className="flex w-full">
                            <span className="w-[15%] text-[#757575] font-normal capitalize">
                                Vận chuyển
                            </span>
                            <div className="flex items-start">
                                <img
                                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/baa823ac1c58392c2031.svg"
                                    alt="transport icon"
                                    className="h-5 w-5 ml-[10px] mr-3"
                                />
                                <div className="text-[#636363] flex flex-col gap-1">
                                    <div className="flex capitalize">
                                        <span className="mr-6">
                                            Vận chuyển tới
                                        </span>
                                        <span className="font-medium text-[#000]">
                                            {user.address}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="capitalize mr-6">
                                            Phí vận chuyển
                                        </span>
                                        <span className="font-medium text-[#000]">
                                            đ15,000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center w-full mt-[25px] mb-10">
                            <span className="w-[15%] text-[#757575] font-normal capitalize">
                                {listProductDetail.length > 0 &&
                                    listProductDetail[0].variationOptionId
                                        .variationId.name}
                            </span>
                            <div className="flex-1 flex">
                                {listProductDetail.length > 0 &&
                                    listProductDetail.map((detail, index) => (
                                        <div
                                            key={detail._id}
                                            className={`hover:border-[#ee4d2d] hover:text-main hover:cursor-pointer flex items-center mr-3 gap-2 bg-white rounded-sm p-2 border border-solid ${
                                                detailActive !== undefined &&
                                                detailActive === index
                                                    ? 'border-main text-main'
                                                    : 'border-[rgba(0, 0, 0, .09)]'
                                            }`}
                                            onClick={() =>
                                                handleClickDetail(detail, index)
                                            }
                                            onMouseEnter={() =>
                                                setImageShow(
                                                    detail.productDetailId.image
                                                )
                                            }
                                            onMouseLeave={() =>
                                                setImageShow(
                                                    listProductDetail[0]
                                                        .productDetailId.product
                                                        .image[1]
                                                )
                                            }
                                        >
                                            <img
                                                src={
                                                    detail.productDetailId.image
                                                }
                                                alt="image"
                                                className="w-6 h-6"
                                            />
                                            <span>
                                                {detail.variationOptionId.value}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="w-[15%] text-[#757575] font-normal capitalize">
                                Số lượng
                            </span>
                            <div className="flex-1 bg-white">
                                <div className="flex items-center">
                                    <button
                                        onClick={() =>
                                            handleQuantity('decrease')
                                        }
                                        className="px-4 py-1 bg-transparent border border-solid border-[rgba(0, 0, 0, .09)] text-[rgba(0, 0, 0, .8)] font-light rounded-sm text-[16px]"
                                    >
                                        -
                                    </button>
                                    <span className="px-5 py-1 bg-transparent border-y border-solid border-y-[rgba(0, 0, 0, .09)] text-[rgba(0, 0, 0, .8)] text-[16px]">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleQuantity('increase')
                                        }
                                        className="px-4 py-1 bg-transparent border border-solid border-[rgba(0, 0, 0, .09)] text-[rgba(0, 0, 0, .8)] font-light rounded-sm text-[16px]"
                                    >
                                        +
                                    </button>
                                    <span className="ml-[15px] text-[#757575]">
                                        {totalDetail} có sẵn
                                    </span>
                                </div>
                                <p className="mt-[15px] text-[#ff424f]">
                                    {errMsg !== '' ? errMsg : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[25px] flex items-center px-5">
                        <button
                            onClick={() => handleCart(false)}
                            className="hover:bg-[#ffc5b22e] flex items-center gap-3 px-5 py-3 border border-solid border-main mr-[15px] bg-[#ffeee8] rounded-sm shadow-buttonHome text-main"
                        >
                            <FaCartPlus size={16} />
                            Thêm Vào Giỏ Hàng
                        </button>
                        <button
                            onClick={() => handleCart(true)}
                            className="hover:opacity-[0.9] flex items-center gap-3 px-10 py-3 border border-solid border-main mr-[15px] bg-main rounded-sm shadow-buttonHome text-white"
                        >
                            Mua Ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
