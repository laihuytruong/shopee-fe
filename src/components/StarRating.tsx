import React, { useState } from 'react'
import { productApi } from '~/apis'
import { useAppSelector } from '~/app/hooks'
import { selectAccessToken } from '~/features/UserSlice'
import { Product } from '~/models'
import icons from '~/utils/icons'

const { MdOutlineStar, IoMdStarOutline } = icons

interface Props {
    rating: number
    color: string
    product: Product
    setProduct: React.Dispatch<React.SetStateAction<Product>>
}

const StarRating: React.FC<Props> = ({
    rating,
    color,
    product,
    setProduct,
}) => {
    const [ratingStar, setRatingStar] = useState<number>(rating)

    const token = useAppSelector(selectAccessToken)

    const stars = []

    const handleRatingStar = async (star: number) => {
        console.log('star: ', star)
        if (product?._id !== undefined) {
            const pid = product?._id
            const response = await productApi.ratingProduct(token, pid, star)
            if (response.err === 0 && response.data) {
                setRatingStar(response.data.totalRating)
                setProduct(response.data)
            }
        }
    }

    for (let i = 1; i <= 5; i++) {
        if (i <= ratingStar) {
            stars.push(
                <MdOutlineStar
                    size={16}
                    onClick={() => handleRatingStar(i)}
                    color={color}
                    className="cursor-pointer"
                    key={i}
                />
            )
        } else {
            stars.push(
                <IoMdStarOutline
                    size={16}
                    color={color}
                    onClick={() => handleRatingStar(i)}
                    className="cursor-pointer"
                    key={i}
                />
            )
        }
    }

    return <div className="flex">{stars}</div>
}

export default StarRating
