import React, { useEffect, useState } from 'react'
import { Select, Input, Typography, Card, Form, Button } from 'antd'
import { brandApi, categoryApi, categoryItemApi, productApi } from '~/apis'
import { Brand, Category, CategoryItem } from '~/models'
import { useAppSelector } from '~/app/hooks'
import { selectAccessToken } from '~/features/UserSlice'
import { toast } from 'react-toastify'
import admin_routes from '~/config/admin_routes'
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input
const { Title } = Typography

const AddProducts = () => {
    const [brands, setBrands] = useState<Brand[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([])
    const [selectCategory, setSelectCategory] = useState<string>('')
    const [selectedItem, setSelectedItem] = useState<{
        brand: string
        categoryItem: string
    }>({
        brand: '',
        categoryItem: '',
    })
    const [productName, setProductName] = useState<string>('')
    const token = useAppSelector(selectAccessToken)
    const nav = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const responseCategory = await categoryApi.getCategories(1, 100)
            if (responseCategory.err === 0 && responseCategory.data) {
                setCategories(responseCategory.data)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchCategoryItem = async () => {
            const responseCategoryItem =
                await categoryItemApi.getCategoryItemBySlug(selectCategory)
            const responseBrand = await brandApi.getBrandsBySlug(selectCategory)
            if (
                responseCategoryItem.err === 0 &&
                responseBrand.err === 0 &&
                responseCategoryItem.data &&
                responseBrand.data
            ) {
                setCategoryItems(responseCategoryItem.data)
                setBrands(responseBrand.data)
            } else {
                setCategoryItems([])
                setBrands([])
            }
        }
        fetchCategoryItem()
    }, [selectCategory])

    const handleSubmit = async () => {
        const response = await productApi.createProduct(
            token,
            productName,
            selectedItem.brand,
            selectedItem.categoryItem
        )
        if (response.err === 0 && response.data) {
            nav(`${admin_routes.ADD_PRODUCTS}/${response.data._id}`)
            setProductName('')
            setSelectedItem({ brand: '', categoryItem: '' })
        } else {
            toast.error('Thêm sản phẩm thất bại')
        }
    }

    return (
        <Card className="mt-4" bordered={false}>
            <Title level={2}>Thêm Sản Phẩm</Title>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Tên sản phẩm" required>
                    <TextArea
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        rows={3}
                        className="focus:border-main hover:border-main"
                    />
                </Form.Item>
                <Form.Item label="Tên ngành hàng" required>
                    <Select
                        onChange={(value) => setSelectCategory(value)}
                        value={selectCategory}
                        className="w-full"
                    >
                        <Select.Option value="">{`-- Chọn ngành hàng --`}</Select.Option>
                        {categories.map((category) => (
                            <Select.Option
                                value={category.slug}
                                key={category._id}
                            >
                                {category.categoryName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Tên hãng hàng" required>
                    <Select
                        onChange={(value) =>
                            setSelectedItem({
                                ...selectedItem,
                                categoryItem: value,
                            })
                        }
                        value={selectedItem.categoryItem}
                        className="w-full"
                    >
                        <Select.Option value="">{`-- Chọn hãng hàng --`}</Select.Option>
                        {categoryItems.map((categoryItem) => (
                            <Select.Option
                                value={categoryItem._id}
                                key={categoryItem._id}
                            >
                                {categoryItem.categoryItemName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Tên thương hiệu" required>
                    <Select
                        onChange={(value) =>
                            setSelectedItem({
                                ...selectedItem,
                                brand: value,
                            })
                        }
                        value={selectedItem.brand}
                        className="w-full"
                    >
                        <Select.Option value="">{`-- Chọn thương hiệu --`}</Select.Option>
                        {brands.map((brand) => (
                            <Select.Option value={brand._id} key={brand._id}>
                                {brand.brandName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="custom-bg"
                    >
                        Tiếp theo
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AddProducts
