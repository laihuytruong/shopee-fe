import { Empty } from 'antd'
import { ChangeEvent, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { userApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import routes from '~/config/routes'
import { cartBuy, selectCheckItem, setCheckItem } from '~/features/CartSlice'
import { increment } from '~/features/CounterSlice'
import { selectAccessToken, selectUser } from '~/features/UserSlice'
import { User } from '~/models'
import { Cart } from '~/models/cartInterface'

const CartList = () => {
    const user: User = useAppSelector(selectUser)
    const token = useAppSelector(selectAccessToken)
    const checkItem: { [key: string]: boolean } =
        useAppSelector(selectCheckItem)
    const nav = useNavigate()
    const dispatch = useAppDispatch()

    const [checkedItems, setCheckedItems] = useState<{
        [key: string]: boolean
    }>(checkItem)
    const [checkAll, setCheckAll] = useState<boolean>(false)
    const [totalProductPay, setTotalProductPay] = useState<{
        count: number
        price: number
    }>({
        count: 0,
        price: 0,
    })
    const [quantities, setQuantities] = useState<{ [key: string]: number }>(
        user.cart.reduce((acc, cart) => {
            acc[cart._id] = cart.quantity
            return acc
        }, {} as { [key: string]: number })
    )

    useEffect(() => {
        let selectedItems = user.cart.filter((cart) => checkedItems[cart._id])
        selectedItems = selectedItems.map((cart) => {
            if (cart.productDetail.product.discount) {
                return {
                    ...cart,
                    quantity: quantities[cart._id],
                    productDetail: {
                        ...cart.productDetail,
                        price:
                            cart.productDetail.price *
                            (1 - cart.productDetail.product.discount / 100),
                    },
                }
            }
            return cart
        })
        handleProductPay(selectedItems)
    }, [checkedItems, quantities])

    const handleCheckboxChange = (
        e: ChangeEvent<HTMLInputElement>,
        itemId: string
    ) => {
        setCheckedItems({
            ...checkedItems,
            [itemId]: e.target.checked,
        })
        if (!e.target.checked) {
            setCheckAll(false)
        } else {
            const allChecked = user.cart.every(
                (cart) => cart._id === itemId || checkedItems[cart._id]
            )
            setCheckAll(allChecked)
        }
    }

    const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked
        setCheckAll(isChecked)
        const newCheckItems = user.cart.reduce((acc, cart) => {
            acc[cart._id] = isChecked
            return acc
        }, {} as { [key: string]: boolean })
        setCheckedItems(newCheckItems)
    }

    const handleProductPay = (selectedItems?: Cart[]) => {
        const result: Cart[] = selectedItems ? selectedItems : []
        const count = result.length
        const price = result.reduce(
            (total, cart) => total + cart.productDetail.price * cart.quantity,
            0
        )
        console.log(price)
        setTotalProductPay({ count, price })
    }

    const handleDeleteItemCart = async (cart: Cart) => {
        try {
            const response = await userApi.deleteItemCart({
                pdId: cart.productDetail._id,
                token,
                variationOption: cart.variationOption._id,
            })
            if (response.err === 0) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Xóa sản phẩm thành công',
                    showConfirmButton: false,
                    timer: 1000,
                }).then(() => {
                    setTotalProductPay({
                        count: 0,
                        price: 0,
                    })
                    dispatch(increment())
                })
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Xóa sản phẩm thất bại',
                    showConfirmButton: false,
                    timer: 1000,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteAllItemCart = async () => {
        try {
            const itemsToDelete = user.cart.filter(
                (cartItem) => checkedItems[cartItem._id]
            )
            if (itemsToDelete.length > 0) {
                const result = await Swal.fire({
                    title: `Bạn có chắc chắn muốn xóa ${
                        checkAll ? user.cart.length : itemsToDelete.length
                    } sản phẩm không?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ee4d2d',
                    cancelButtonColor: 'red',
                    confirmButtonText: 'Có',
                    cancelButtonText: 'Trở lại',
                })

                if (result.isConfirmed) {
                    const response = await userApi.deleteAllItemCart({
                        token,
                        checkAll: checkAll ? true : false,
                        items: checkAll
                            ? null
                            : itemsToDelete.map((item) => ({
                                  pdId: item.productDetail._id,
                                  variationOption: item.variationOption._id,
                              })),
                    })
                    if (response.err === 0) {
                        setTotalProductPay({
                            count: 0,
                            price: 0,
                        })
                        dispatch(increment())
                    }
                }
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Vui lòng chọn sản phẩm',
                    showConfirmButton: false,
                    timer: 1500,
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleQuantity = (type: string, itemId: string, max: number) => {
        setQuantities((prevQuantities) => {
            const newQuantity = prevQuantities[itemId]
            if (type === 'increase') {
                return {
                    ...prevQuantities,
                    [itemId]: newQuantity === max ? max : newQuantity + 1,
                }
            } else if (type === 'decrease') {
                return {
                    ...prevQuantities,
                    [itemId]: newQuantity > 1 ? newQuantity - 1 : 1,
                }
            }
            return prevQuantities
        })
    }

    const handleBuy = () => {
        const filterItem = user.cart.filter(
            (cartItem) => checkedItems[cartItem._id]
        )
        if (filterItem.length > 0) {
            const itemsBuy = filterItem.map((cartItem: Cart) => ({
                ...cartItem,
                productDetail: {
                    ...cartItem.productDetail,
                    price:
                        cartItem.productDetail.price *
                        (1 - cartItem.productDetail.product.discount / 100),
                },
                quantity: quantities[cartItem._id],
            }))
            dispatch(setCheckItem(checkedItems))
            dispatch(cartBuy(itemsBuy))
            nav(routes.PAYMENT)
        } else {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Vui lòng chọn sản phẩm để thanh toán',
                showConfirmButton: false,
                timer: 1000,
            }).then(() => {
                dispatch(setCheckItem(checkedItems))
            })
        }
    }
    console.log('checkItem: ', checkItem)

    return (
        <div className="w-main relative">
            {user.cart && user.cart.length > 0 ? (
                <>
                    <div className="h-[55px] w-full bg-white shadow-buttonCategory rounded text-[#888] my-3 px-5 text-sm flex items-center">
                        <div className="flex items-center gap-4 text-[#000000CC] pl-5 w-1/2">
                            <input
                                type="checkbox"
                                className="hover:cursor-pointer checkbox-orange h-4 w-4 border border-solid border-[rgba(0, 0, 0, .14)] rounded-sm shadow-input_me "
                                checked={checkAll}
                                onChange={handleCheckAll}
                            />
                            <span>Sản Phẩm</span>
                        </div>
                        <span className="w-[12%] text-center">Đơn Giá</span>
                        <span className="w-[12%] text-center">Số Lượng</span>
                        <span className="w-[12%] text-center">Số Tiền</span>
                        <span className="w-[12%] text-center">Thao tác</span>
                    </div>
                    {user.cart.map((cart) => (
                        <div
                            key={cart._id}
                            className="flex items-center bg-white mb-3 shadow-buttonCategory rounded-sm px-5 pb-5 pt-[15px] text-[#000000de]"
                        >
                            <div className="flex items-center gap-4 text-[#000000de] pl-5 w-1/2">
                                <input
                                    type="checkbox"
                                    className="hover:cursor-pointer checkbox-orange h-4 w-4 border border-solid border-[rgba(0, 0, 0, .14)] rounded-sm shadow-input_me "
                                    checked={checkedItems[cart._id] || false}
                                    onChange={(e) =>
                                        handleCheckboxChange(e, cart._id)
                                    }
                                />
                                <NavLink
                                    to={`/product-detail/${cart.productDetail.product.slug}`}
                                >
                                    <img
                                        src={cart.productDetail.image}
                                        alt="Image detail"
                                        className="w-20 h-20 object-cover"
                                        onClick={() =>
                                            nav(
                                                `/product-detail/${cart.productDetail.product.slug}`
                                            )
                                        }
                                    />
                                </NavLink>
                                <NavLink
                                    to={`/product-detail/${cart.productDetail.product.slug}`}
                                    className="line-clamp-2 w-1/2"
                                >
                                    {cart.productDetail.product.productName}
                                </NavLink>
                                <div className="flex-1 text-center">
                                    <div>
                                        <span>
                                            {
                                                cart.variationOption.variationId
                                                    .name
                                            }
                                            :{' '}
                                        </span>
                                        <span>
                                            {cart.variationOption.value}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="w-[12%] text-center">
                                {cart.productDetail.product.discount
                                    ? (
                                          cart.productDetail.price *
                                          (1 -
                                              cart.productDetail.product
                                                  .discount /
                                                  100)
                                      ).toLocaleString()
                                    : cart.productDetail.price.toLocaleString()}
                            </span>
                            <div className="w-[12%] flex flex-col items-center justify-center">
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={() =>
                                            handleQuantity(
                                                'decrease',
                                                cart._id,
                                                cart.productDetail.inventory
                                            )
                                        }
                                        className="px-4 bg-transparent border border-solid border-[rgba(0, 0, 0, .09)] text-[rgba(0, 0, 0, .8)] font-light rounded-sm text-[16px]"
                                    >
                                        -
                                    </button>
                                    <div className="px-5 bg-transparent border-y border-solid border-y-[rgba(0, 0, 0, .09)] text-[rgba(0, 0, 0, .8)] text-[16px]">
                                        {quantities[cart._id]}
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleQuantity(
                                                'increase',
                                                cart._id,
                                                cart.productDetail.inventory
                                            )
                                        }
                                        className="px-4 bg-transparent border border-solid border-[rgba(0, 0, 0, .09)] text-[rgba(0, 0, 0, .8)] font-light rounded-sm text-[16px]"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-main text-xs mt-[2px]">
                                    Còn {cart.productDetail.inventory} sản phẩm
                                </p>
                            </div>
                            <span className="w-[12%] text-center flex items-start justify-center text-main">
                                <span className="text-xs underline">đ</span>
                                {(
                                    (cart.productDetail.product.discount
                                        ? cart.productDetail.price *
                                          (1 -
                                              cart.productDetail.product
                                                  .discount /
                                                  100)
                                        : cart.productDetail.price) *
                                    quantities[cart._id]
                                ).toLocaleString()}
                            </span>
                            <span
                                onClick={() => handleDeleteItemCart(cart)}
                                className="w-[12%] text-center hover:cursor-pointer"
                            >
                                Xóa
                            </span>
                        </div>
                    ))}
                    <div className="sticky bottom-0 bg-white shadow-input_me h-[100px] z-10 mt-3 flex items-center justify-between p-5">
                        <div className="pl-5 flex items-center gap-4">
                            <input
                                type="checkbox"
                                className="hover:cursor-pointer checkbox-orange h-4 w-4 border border-solid border-[rgba(0, 0, 0, .14)] rounded-sm shadow-input_me "
                                checked={checkAll}
                                onChange={handleCheckAll}
                            />
                            <span
                                className="hover:cursor-pointer"
                                onClick={() => {
                                    setCheckAll((prev) => {
                                        if (prev === true) {
                                            setCheckedItems({})
                                            return false
                                        } else {
                                            setCheckedItems(
                                                user.cart.reduce(
                                                    (acc, cart) => {
                                                        acc[cart._id] = !prev
                                                        return acc
                                                    },
                                                    {} as {
                                                        [key: string]: boolean
                                                    }
                                                )
                                            )
                                            return true
                                        }
                                    })
                                }}
                            >
                                Chọn Tất Cả ({user.cart.length})
                            </span>
                            <span
                                onClick={() => handleDeleteAllItemCart()}
                                className="hover:cursor-pointer"
                            >
                                Xóa
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-[16px]">
                            <span>
                                Tổng Thanh Toán ({totalProductPay.count} Sản
                                Phẩm):
                            </span>
                            <span className="flex items-start text-main text-2xl">
                                <span className="underline text-sm">đ</span>
                                {totalProductPay.price.toLocaleString()}
                            </span>
                            <button
                                onClick={handleBuy}
                                className="bg-main text-white px-9 py-[13px] rounded-sm hover:opacity-[0.9]"
                            >
                                Mua Hàng
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="p-5 flex flex-col justify-center items-center">
                    <Empty
                        description="Không có sản phẩm nào trong giỏ hàng"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                    <button
                        onClick={() => nav(`/${routes.HOME}`)}
                        className="hover:opacity-[0.9] outline-none p-[10px] text-white rounded-sm bg-main"
                    >
                        Mua ngay
                    </button>
                </div>
            )}
        </div>
    )
}

export default CartList
