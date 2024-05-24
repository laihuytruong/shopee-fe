import React, { useState } from 'react'
import { Banner, CategoryHome } from '~/components'
import ProductsHome from '~/components/ProductsHome'
import { listCodeDiscount } from '~/utils/constants'

const Home = () => {
    return (
        <>
            <div className="w-full pt-[149px] flex flex-col items-center bg-white">
                <div className="w-main flex gap-2">
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
                <div className="w-main mt-[10px] flex justify-around">
                    {listCodeDiscount.map((code) => (
                        <div
                            key={code.id}
                            className="flex flex-col items-center w-[12%] hover:-translate-y-[1px] hover:cursor-pointer"
                        >
                            <div className="w-[45px] h-[45px] rounded-full my-2">
                                <img
                                    className="w-[45px] h-[45px] object-contain"
                                    src={`${code.image}`}
                                    alt="image"
                                />
                            </div>
                            <span className="mb-2 text-[13px] text-[#222222] text-center">
                                {code.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-main bg-white mt-5 py-5">
                <div className="h-[38px] px-5 text-[#0000008a] text-[18px] border-b border-solid border-[rgba(0, 0, 0, .05)]">
                    DANH MỤC
                </div>
                <CategoryHome />
            </div>
            <div className="mt-5 w-main">
                <div className="sticky top-[119px] z-30 text-main text-[16px] bg-white px-[46px] py-[15px] text-center border-b-4 border-solid border-b-main">
                    GỢI Ý HÔM NAY
                </div>
                <div className="pt-[5px]">
                    <ProductsHome isShowBtn={true} />
                </div>
            </div>
        </>
    )
}

export default Home
