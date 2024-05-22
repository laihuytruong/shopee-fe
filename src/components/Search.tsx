import React from 'react'
import icons from '~/utils/icons'

const { IoIosSearch } = icons

const Search = () => {
    return (
        <div className="max-w-[840px] bg-white rounded">
            <div className="w-full p-[3px] flex justify-between">
                <input
                    type="text"
                    placeholder="MUA 1 TẶNG 1"
                    className="flex-1 py-2 px-2 rounded outline-none text-primary"
                />
                <button className="w-[8%] bg-main rounded hover:opacity-[0.9] flex justify-center items-center">
                    <IoIosSearch size={20} />
                </button>
            </div>
        </div>
    )
}

export default Search
