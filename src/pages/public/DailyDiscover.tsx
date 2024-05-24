import ProductsHome from '~/components/ProductsHome'

const DailyDiscover = () => {
    return (
        <div className="pt-[159px] w-main">
            <div className="mb-8 w-full relative flex justify-center h-14">
                <h1 className="px-5 flex items-center justify-center py-[18px] text-xl bg-main text-white z-10 rounded-lg">
                    GỢI Ý HÔM NAY
                </h1>
                <div className="absolute left-0 top-1/2 w-full border-t border-dotted border-t-black"></div>
            </div>
            <ProductsHome isShowBtn={false} />
        </div>
    )
}

export default DailyDiscover
