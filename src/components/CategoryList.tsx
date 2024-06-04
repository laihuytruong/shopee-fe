import { NavLink } from 'react-router-dom'
import { CategoryItem } from '~/models'
import icons from '~/utils/icons'

interface Props {
    categoryItems: CategoryItem[]
    active: number
    search: string
    setActive: React.Dispatch<React.SetStateAction<number>>
    setCount: React.Dispatch<React.SetStateAction<number>>
}

const { IoMdArrowDropright, FaList } = icons

const CategoryList: React.FC<Props> = ({
    categoryItems,
    search,
    active,
    setActive,
    setCount,
}) => {
    return (
        <div>
            <div className="hover:cursor-pointer flex items-center border-b border-solid border-b-[rgba(0, 0, 0, .05)] mb-[10px] h-[50px] gap-[10px] font-bold text-[16px]">
                <FaList />
                <h1>Tất Cả Danh Mục</h1>
            </div>
            {categoryItems.length > 0 &&
                categoryItems.map((categoryItem, index) => (
                    <NavLink
                        key={categoryItem._id}
                        to={`/category/${categoryItem.slug}${
                            search ? search : ''
                        }`}
                        className={`${
                            active === index && 'text-main'
                        } pl-3 py-2 pr-[10px] flex items-center relative`}
                        onClick={() => {
                            setCount((prev) => prev + 1)
                            setActive(index)
                        }}
                    >
                        {active === index && (
                            <span className="absolute top-1/2 left-0 transform -translate-y-1/2">
                                <IoMdArrowDropright />
                            </span>
                        )}
                        <span>{categoryItem.categoryItemName}</span>
                    </NavLink>
                ))}
        </div>
    )
}

export default CategoryList
