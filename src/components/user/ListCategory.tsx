import { Empty } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import categoryApi from '~/apis/categoryApi'
import { Category, PaginationInfo } from '~/models'
import icons from '~/utils/icons'

const { MdOutlineNavigateNext, MdOutlineNavigateBefore } = icons

const ListCategory = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 0,
    })
    const [count, setCount] = useState<number>(0)

    const nav = useNavigate()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryApi.getCategories(
                    paginationInfo.page,
                    paginationInfo.pageSize
                )
                console.log('response.data: ', response.data)
                if (response.data && response.err === 0) {
                    setCategories(response.data.data)
                    setPaginationInfo({
                        page: +response.data.page,
                        pageSize: +response.data.pageSize,
                        totalCount: response.count ? +response.count : 0,
                        totalPage: +response.data.totalPage,
                    })
                }
            } catch (error) {
                console.log('Error when fetch categories at home')
            }
        }
        fetchCategories()
    }, [count])

    const handlePageChange = (newPage: number) => {
        setCount((prev) => prev + 1)
        setPaginationInfo((prevInfo) => ({
            ...prevInfo,
            page: newPage,
        }))
    }

    return (
        <div className="flex flex-wrap relative group">
            {!categories ? (
                <Empty />
            ) : (
                categories.map((category) => (
                    <div
                        key={category._id}
                        onClick={() => nav(`category/${category.slug}`)}
                        className={`flex flex-col items-center w-[10%] border-b border-b-[rgba(0, 0, 0, .05)] border-solid border-r border-r-[rgba(0, 0, 0, .05)] hover:cursor-pointer hover:border-[rgba(0, 0, 0, .12)] hover:shadow-category`}
                    >
                        <img
                            className="w-[70%] h-[70%]"
                            src={`${category.thumbnail}`}
                            alt="category"
                        />
                        <span className="h-[50px] text-center mb-[10px]">
                            {category.categoryName}
                        </span>
                    </div>
                ))
            )}

            {paginationInfo.page >= 2 && (
                <div
                    onClick={() => handlePageChange(paginationInfo.page - 1)}
                    className="group-hover:cursor-pointer group-hover:w-[50px] group-hover:h-[50px] group-hover:-left-6 w-[25px] h-[25px] bg-white rounded-full shadow-btn absolute top-1/2 -left-3 -translate-y-1/2 flex items-center justify-center "
                >
                    <MdOutlineNavigateBefore size={30} />
                </div>
            )}
            {paginationInfo.totalPage >= 2 &&
                paginationInfo.page < paginationInfo.totalPage && (
                    <div
                        onClick={() =>
                            handlePageChange(paginationInfo.page + 1)
                        }
                        className="group-hover:cursor-pointer group-hover:w-[50px] group-hover:h-[50px] group-hover:-right-6 w-[25px] h-[25px] bg-white rounded-full shadow-btn absolute top-1/2 -right-3 -translate-y-1/2 flex items-center justify-center"
                    >
                        <MdOutlineNavigateNext size={30} />
                    </div>
                )}
        </div>
    )
}

export default ListCategory
