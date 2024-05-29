import React, { useRef } from 'react'
import { Carousel } from 'antd'
import icons from '~/utils/icons'
import { CarouselRef } from 'antd/es/carousel'
import { sliderImages } from '~/utils/constants'

const { MdOutlineNavigateBefore, MdOutlineNavigateNext } = icons

interface Props {
    height: string
}

const Banner: React.FC<Props> = ({ height }) => {
    const refCarousel = useRef<CarouselRef>(null)
    const handlePrevSlider = () => {
        if (refCarousel.current) {
            refCarousel.current.prev()
        }
    }

    const handleNextSlider = () => {
        if (refCarousel.current) {
            refCarousel.current.next()
        }
    }

    const settings = {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        dots: true,
        customPaging: (i: number) => <div key={i} className="custom-dot" />,
        appendDots: (dots: React.ReactNode) => (
            <div className="absolute bottom-[15px] flex justify-center w-full">
                <ul className="flex">{dots}</ul>
            </div>
        ),
    }

    return (
        <div className="relative group cursor-pointer">
            <div
                onClick={handlePrevSlider}
                className={`${
                    height !== '235px' && 'px-2'
                } absolute invisible group-hover:visible text-white transform -translate-y-1/2 left-0 z-30 top-1/2 py-4 bg-[#00000052] opacity-[0.8] hover:opacity-[1]`}
            >
                <MdOutlineNavigateBefore size={26} />
            </div>
            <Carousel {...settings} ref={refCarousel}>
                {sliderImages.map((item, index) => (
                    <div key={index}>
                        <img
                            src={`${item}`}
                            alt={`slider${index}`}
                            className={`h-[235px] w-full object-cover rounded-sm`}
                        />
                    </div>
                ))}
            </Carousel>

            <div
                onClick={handleNextSlider}
                className={`${
                    height !== '235px' && 'px-2'
                } absolute invisible group-hover:visible text-white transform -translate-y-1/2 right-0 z-30 top-1/2 py-4 bg-[#00000052] opacity-[0.8] hover:opacity-[1]`}
            >
                <MdOutlineNavigateNext size={26} />
            </div>
        </div>
    )
}

export default Banner
