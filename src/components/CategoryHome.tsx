import { Empty } from 'antd'
import React, { useEffect, useState } from 'react'
import homeApi from '~/apis/homeApi'
import { Category } from '~/models/categoryInterfaces'

const CategoryHome = () => {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await homeApi.getCategories()
                if (response.data && response.err === 0) {
                    setCategories(response.data)
                }
            } catch (error) {
                console.log('Error when fetch categories at home')
            }
        }
        fetchCategories()
    }, [])

    return (
        <div className="flex justify-center">
            {!categories ? (
                <Empty />
            ) : (
                categories.map((category) => (
                    <div
                        key={category._id}
                        className={`flex flex-col items-center border-b border-b-[rgba(0, 0, 0, .05)] border-solid border-r border-r-[rgba(0, 0, 0, .05)] hover:cursor-pointer hover:border-[rgba(0, 0, 0, .12)] hover:shadow-category`}
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
        </div>
    )
}

export default CategoryHome
