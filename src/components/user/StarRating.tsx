import React from 'react'
import icons from '~/utils/icons'

const { MdOutlineStar, IoMdStarOutline } = icons

interface Props {
    rating: number
    color: string
}

const StarRating: React.FC<Props> = ({ rating, color }) => {
    const stars = []

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(
                <MdOutlineStar
                    size={16}
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
                    className="cursor-pointer"
                    key={i}
                />
            )
        }
    }

    return <div className="flex">{stars}</div>
}

export default StarRating
