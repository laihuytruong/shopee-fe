import React from 'react'
import { useNavigate } from 'react-router-dom'
import { updateURLParams } from '~/utils/constants'
import { MenuList } from '~/components/user'
import { MenuItem } from '~/models'
import icons from '~/utils/icons'

interface Props {
    buttonActive: string
    setButtonActive: React.Dispatch<React.SetStateAction<string>>
    setCount: React.Dispatch<React.SetStateAction<number>>
    search: string
    pathname: string
    selectMenuItem: React.ReactNode
    handleSelect: (item?: MenuItem) => void
}

enum MenuItemEnum {
    AscPrice = 'Giá: Từ Thấp Đến Cao',
    DescPrice = 'Giá: Từ Cao Đến Thấp',
}

const { RiArrowDownSLine } = icons

const ButtonControl: React.FC<Props> = ({
    buttonActive,
    setButtonActive,
    setCount,
    search,
    pathname,
    selectMenuItem,
    handleSelect,
}) => {
    const nav = useNavigate()

    const menuList: MenuItem[] = [
        { children: MenuItemEnum.AscPrice, sort: 'price' },
        { children: MenuItemEnum.DescPrice, sort: '-price' },
    ]

    return (
        <div className="flex h-[34px] items-center">
            <span className="text-[#555]">Sắp xếp theo</span>
            <div className="ml-8 flex gap-2">
                <button
                    onClick={() => {
                        if (search.includes('search')) {
                            if (buttonActive !== 'Liên quan') {
                                setButtonActive('Liên quan')
                                setCount((prev) => prev + 1)
                                const newSearch = updateURLParams(
                                    search,
                                    'sort',
                                    'relevancy'
                                )
                                nav(`${pathname}?${newSearch}`)
                            }
                        } else if (buttonActive !== 'Phổ biến') {
                            setButtonActive('Phổ biến')
                            setCount((prev) => prev + 1)
                            const newSearch = updateURLParams(
                                search,
                                'sort',
                                'pop'
                            )
                            nav(`${pathname}?${newSearch}`)
                        }
                    }}
                    className={`${
                        buttonActive === 'Phổ biến'
                            ? 'bg-main text-white'
                            : 'bg-white'
                    } px-4 py-2 rounded`}
                >
                    {pathname.includes('search') ? 'Liên quan' : 'Phổ biến'}
                </button>
                <button
                    onClick={() => {
                        if (buttonActive !== 'Mới nhất') {
                            setButtonActive('Mới nhất')
                            setCount((prev) => prev + 1)
                            const newSearch = updateURLParams(
                                search,
                                'sort',
                                'ctime'
                            )
                            nav(`${pathname}?${newSearch}`)
                        }
                    }}
                    className={`${
                        buttonActive === 'Mới nhất'
                            ? 'bg-main text-white'
                            : 'bg-white'
                    } px-4 py-2 rounded`}
                >
                    Mới nhất
                </button>
                <button
                    onClick={() => {
                        if (buttonActive !== 'Bán chạy') {
                            setButtonActive('Bán chạy')
                            setCount((prev) => prev + 1)
                            const newSearch = updateURLParams(
                                search,
                                'sort',
                                'sales'
                            )
                            nav(`${pathname}?${newSearch}`)
                        }
                    }}
                    className={`${
                        buttonActive === 'Bán chạy'
                            ? 'bg-main text-white'
                            : 'bg-white'
                    } px-4 py-2 rounded`}
                >
                    Bán chạy
                </button>
                <MenuList
                    menuList={menuList}
                    handleSelect={handleSelect}
                    selectMenuItem={selectMenuItem}
                >
                    <div className="flex items-center justify-between w-[180px] bg-white px-2 py-2 rounded cursor-pointer">
                        <span
                            className={`w-80% ${
                                selectMenuItem !== 'Giá' && 'text-main'
                            }`}
                        >
                            {selectMenuItem}
                        </span>
                        <div className="w-20%">
                            <RiArrowDownSLine />
                        </div>
                    </div>
                </MenuList>
            </div>
        </div>
    )
}

export default ButtonControl
