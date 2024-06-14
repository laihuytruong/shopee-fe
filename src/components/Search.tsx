import { Dropdown } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { productApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import {
    addSearchHistory,
    selectSearchHistory,
    sortSearchHistory,
    updateSearchHistory,
} from '~/features/SearchSlice'
import { Product, SearchHistory } from '~/models'
import icons from '~/utils/icons'
import { debounce } from 'lodash'
import { updateURLParams } from '~/utils/constants'

const { IoIosSearch } = icons

const Search = () => {
    const searchHistory: SearchHistory[] = useAppSelector(selectSearchHistory)
    const dispatch = useAppDispatch()

    const [searchText, setSearchText] = useState<string>('')
    const [searchData, setSearchData] = useState<Product[]>([])

    const { pathname, search } = useLocation()
    const nav = useNavigate()

    const debouncedSetSearchText = useCallback(
        debounce(async (text: string) => {
            const response = await productApi.getProducts(1, 10, text)
            console.log('text', text)
            console.log('response', response)
            setSearchData(response.data ? response.data.data : [])
        }, 500),
        []
    )

    useEffect(() => {
        if (pathname === '/') {
            setSearchText('')
        }
    }, [pathname])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
        debouncedSetSearchText(e.target.value)
    }

    const handleSelectSearchItem = (item: SearchHistory, isAdd?: boolean) => {
        setSearchText(item.name)
        if (isAdd) {
            dispatch(addSearchHistory(item))
        } else {
            dispatch(updateSearchHistory(item))
            dispatch(sortSearchHistory())
        }
        const newSearch = updateURLParams(search, 'keyword', item.name)
        nav(`${pathname === '/search' ? pathname : '/search'}?${newSearch}`)
    }

    return (
        <div className="max-w-[840px] bg-white rounded">
            <div className="w-full p-[3px] flex justify-between">
                <Dropdown
                    placement="bottomRight"
                    trigger={['hover']}
                    dropdownRender={() => {
                        return (
                            <>
                                {searchText.length > 0 &&
                                searchData.length > 0 ? (
                                    <div className=" flex flex-col shadow-search w-[757px] z-20">
                                        <h2 className="w-full pl-[10px] pt-[5px] pb-1 text-[14px] font-semibold bg-white">
                                            Các kết quả tìm kiếm
                                        </h2>
                                        {searchData.map((search) => (
                                            <div
                                                key={search._id}
                                                onClick={() =>
                                                    handleSelectSearchItem(
                                                        {
                                                            _id: search._id,
                                                            name: search.productName,
                                                            slug: search.slug,
                                                            clickAt: Date.now(),
                                                        },
                                                        true
                                                    )
                                                }
                                                className="w-full rounded-sm hover:bg-[#fafafa] hover:cursor-pointer bg-white overflow-hidden pl-4 py-[10px] pr-10 text-ellipsis whitespace-nowrap"
                                            >
                                                {search.productName}
                                            </div>
                                        ))}
                                    </div>
                                ) : searchHistory.length > 0 ? (
                                    <div className="rounded-sm flex flex-col shadow-search w-[757px]">
                                        <h2 className="w-full pl-[10px] pt-[5px] text-[14px] font-semibold bg-white">
                                            Tìm kiếm gần đây
                                        </h2>
                                        {searchHistory.map((search) => (
                                            <div
                                                key={search._id}
                                                onClick={() =>
                                                    handleSelectSearchItem({
                                                        _id: search._id,
                                                        name: search.name,
                                                        slug: search.slug,
                                                        clickAt: Date.now(),
                                                    })
                                                }
                                                className="w-full pl-4 pr-10 py-[10px] z-20 h-auto hover:bg-[#fafafa] bg-white hover:cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                                            >
                                                {search.name}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-[757px] z-20 bg-white overflow-hidden rounded-sm flex flex-col shadow-search">
                                        <span className="p-[10px] pr-10 w-full hover:bg-[#fafafa] hover:cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                                            Mua 1 tặng 1
                                        </span>
                                    </div>
                                )}
                            </>
                        )
                    }}
                >
                    <input
                        type="text"
                        placeholder="MUA 1 TẶNG 1"
                        className="flex-1 py-2 px-2 rounded outline-none text-primary"
                        value={searchText}
                        onChange={(e) => handleChange(e)}
                    />
                </Dropdown>
                <button className="w-[8%] bg-main rounded hover:opacity-[0.9] flex justify-center items-center">
                    <IoIosSearch size={20} />
                </button>
            </div>
        </div>
    )
}

export default Search
