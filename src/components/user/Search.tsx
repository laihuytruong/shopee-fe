import { Dropdown } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { productApi } from '~/apis'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import {
    addSearchHistory,
    deleteItem,
    selectSearchHistory,
    sortSearchHistory,
    updateSearchHistory,
} from '~/features/SearchSlice'
import { CategoryItem, Product, SearchHistory } from '~/models'
import icons from '~/utils/icons'
import { debounce } from 'lodash'
import { isProductArray, updateURLParams } from '~/utils/constants'
import { selectAccessToken } from '~/features/UserSlice'

const { IoIosSearch, IoMdClose } = icons

const Search = () => {
    const searchHistory: SearchHistory[] = useAppSelector(selectSearchHistory)
    const token = useAppSelector(selectAccessToken)
    const dispatch = useAppDispatch()

    const [searchText, setSearchText] = useState<string>('')
    const [searchProductData, setSearchProductData] = useState<Product[]>([])
    const [searchCategoryItemData, setSearchCategoryItemData] = useState<
        CategoryItem[]
    >([])
    const [isShowSearchHistory, setIsShowSearchHistory] =
        useState<boolean>(false)

    const { pathname, search } = useLocation()
    const nav = useNavigate()

    const debouncedSetSearchText = useCallback(
        debounce(async (text: string) => {
            const response = await productApi.search(text, token)
            if (
                response.err === 0 &&
                response.data &&
                response.data.length > 0
            ) {
                if (response.data) {
                    if (isProductArray(response.data)) {
                        setSearchCategoryItemData([])
                        setSearchProductData(response.data)
                    } else {
                        setSearchProductData([])
                        setSearchCategoryItemData(response.data)
                    }
                }
            } else {
                setSearchCategoryItemData([])
                setSearchProductData([])
            }
        }, 200),
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
        if (e.target.value.length > 0) {
            setIsShowSearchHistory(false)
        } else {
            setIsShowSearchHistory(true)
        }
    }

    const handleSelectSearchItem = (item: SearchHistory, isAdd?: boolean) => {
        setSearchText(item.name)
        if (isAdd && isAdd === true) {
            dispatch(addSearchHistory(item))
        } else {
            dispatch(updateSearchHistory(item))
            dispatch(sortSearchHistory())
        }
        const newSearch = updateURLParams(search, 'keyword', item.name)
        nav(`${pathname === '/search' ? pathname : '/search'}?${newSearch}`)
    }

    const handleDeleteItemHistory = (search: SearchHistory) => {
        dispatch(deleteItem(search))
    }
    const handleOnMouseEnter = async () => {
        const response = await productApi.search(searchText, token)
        if (response.err === 0 && response.data) {
            if (isProductArray(response.data)) {
                setSearchCategoryItemData([])
                setSearchProductData(response.data)
            } else {
                setSearchProductData([])
                setSearchCategoryItemData(response.data)
            }
        } else {
            setSearchCategoryItemData([])
            setSearchProductData([])
        }
    }

    console.log('searchCategoryItemData: ', searchCategoryItemData)

    return (
        <div className="max-w-[840px] bg-white rounded">
            <div className="w-full p-[3px] flex justify-between">
                <Dropdown
                    placement="bottomRight"
                    trigger={['hover']}
                    dropdownRender={() => {
                        return (
                            <>
                                {searchText.length > 0 ? (
                                    <div className=" flex flex-col shadow-search w-[757px] z-20">
                                        {(searchProductData.length > 0 ||
                                            searchCategoryItemData.length >
                                                0) && (
                                            <div className="bg-white w-full">
                                                <h2 className="w-full pl-[10px] pt-[5px] pb-1 text-[14px] font-semibold">
                                                    Các kết quả tìm kiếm
                                                </h2>
                                                {searchProductData.length > 0
                                                    ? searchProductData.map(
                                                          (search) => (
                                                              <div>
                                                                  <div
                                                                      onClick={() =>
                                                                          handleSelectSearchItem(
                                                                              {
                                                                                  _id: search._id,
                                                                                  name: search.productName,
                                                                                  slug: search.slug,
                                                                                  clickAt:
                                                                                      Date.now(),
                                                                              },
                                                                              true
                                                                          )
                                                                      }
                                                                      className="hover:text-main w-full rounded-sm hover:bg-[#fafafa] hover:cursor-pointer overflow-hidden pl-4 py-[10px] pr-10 text-ellipsis whitespace-nowrap"
                                                                  >
                                                                      {
                                                                          search.productName
                                                                      }
                                                                  </div>
                                                              </div>
                                                          )
                                                      )
                                                    : searchCategoryItemData.map(
                                                          (search) => (
                                                              <div>
                                                                  <div
                                                                      onClick={() =>
                                                                          handleSelectSearchItem(
                                                                              {
                                                                                  _id: search._id,
                                                                                  name: search.categoryItemName,
                                                                                  slug: search.slug,
                                                                                  clickAt:
                                                                                      Date.now(),
                                                                              },
                                                                              true
                                                                          )
                                                                      }
                                                                      className="hover:text-main w-full rounded-sm hover:bg-[#fafafa] hover:cursor-pointer overflow-hidden pl-4 py-[10px] pr-10 text-ellipsis whitespace-nowrap"
                                                                  >
                                                                      {
                                                                          search.categoryItemName
                                                                      }
                                                                  </div>
                                                              </div>
                                                          )
                                                      )}
                                            </div>
                                        )}
                                    </div>
                                ) : searchHistory.length > 0 &&
                                  isShowSearchHistory ? (
                                    <div className="rounded-sm flex flex-col shadow-search w-[757px]">
                                        <h2 className="w-full pl-[10px] pt-[5px] text-[14px] font-semibold bg-white">
                                            Tìm kiếm gần đây
                                        </h2>
                                        {searchHistory.map((search) => (
                                            <div
                                                key={search._id}
                                                className="w-full group pl-4 pr-3 py-[10px] z-20 h-auto flex items-center justify-between hover:bg-[#fafafa] bg-white hover:cursor-pointer"
                                            >
                                                <span
                                                    onClick={() =>
                                                        handleSelectSearchItem({
                                                            _id: search._id,
                                                            name: search.name,
                                                            slug: search.slug,
                                                            clickAt: Date.now(),
                                                        })
                                                    }
                                                    className="flex-1 line-clamp-1 pr-[2px]"
                                                >
                                                    {search.name}
                                                </span>

                                                <span
                                                    onClick={() =>
                                                        handleDeleteItemHistory(
                                                            search
                                                        )
                                                    }
                                                    className="text-right group-hover:visible invisible hover:cursor-pointer"
                                                >
                                                    <IoMdClose size={16} />
                                                </span>
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
                        onMouseEnter={() => {
                            setIsShowSearchHistory(true)
                            handleOnMouseEnter()
                        }}
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
