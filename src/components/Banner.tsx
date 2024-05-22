import React, { useRef } from 'react'
import { Carousel } from 'antd'
import sliderImages from '~/assets/image/sliderImages'
import icons from '~/utils/icons'
import { CarouselRef } from 'antd/es/carousel'
const { MdOutlineNavigateBefore, MdOutlineNavigateNext } = icons

const Banner: React.FC = () => {
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
                className="absolute invisible group-hover:visible text-white transform -translate-y-1/2 left-0 z-30 top-1/2 py-4 bg-[#00000052] opacity-[0.8] hover:opacity-[1]"
            >
                <MdOutlineNavigateBefore size={20} />
            </div>
            <Carousel {...settings} ref={refCarousel}>
                {sliderImages.map((item, index) => (
                    <div key={index}>
                        <img
                            src={`${item}`}
                            alt={`slider${index}`}
                            className="h-[235px] w-full object-cover rounded-sm"
                        />
                    </div>
                ))}
            </Carousel>

            <div
                onClick={handleNextSlider}
                className="absolute invisible group-hover:visible text-white transform -translate-y-1/2 right-0 z-30 top-1/2 py-4 bg-[#00000052] opacity-[0.8] hover:opacity-[1]"
            >
                <MdOutlineNavigateNext size={20} />
            </div>
        </div>
    )
}

export default Banner
