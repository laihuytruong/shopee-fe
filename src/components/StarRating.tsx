import React from 'react'
import icons from '~/utils/icons'

const { MdOutlineStar, IoMdStarOutline } = icons

interface Props {
    rating: number
}

const StarRating: React.FC<Props> = ({ rating }) => {
    const stars = []

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(
                <MdOutlineStar
                    size={16}
                    color="rgb(255, 167, 39)"
                    className="cursor-pointer"
                    key={i}
                />
            )
        } else {
            stars.push(
                <IoMdStarOutline
                    size={16}
                    color="rgb(255, 167, 39)"
                    className="cursor-pointer"
                    key={i}
                />
            )
        }
    }

    return <div className="flex">{stars}</div>
}

export default StarRating
