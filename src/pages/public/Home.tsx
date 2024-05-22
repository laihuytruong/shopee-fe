import React from 'react'
import { Banner } from '../../components'

const Home = () => {
    return (
        <div className="w-main h-[235px] mt-[149px] flex gap-2">
            <div className="w-3/5 h-full">
                <Banner />
            </div>
            <div className="w-2/5 h-full flex flex-col gap-[5px]">
                <img
                    src="https://cf.shopee.vn/file/vn-50009109-35e1611b56552099059c7a91b07c9cac_xhdpi"
                    alt="banner1"
                    className="rounded-sm h-[115px]"
                />
                <img
                    src="https://cf.shopee.vn/file/vn-50009109-c04aa59b33d99dc80c1b0930457a8857_xhdpi"
                    alt="banner2"
                    className="rounded-sm h-[115px]"
                />
            </div>
        </div>
    )
}

export default Home
