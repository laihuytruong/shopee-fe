import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Select, Card, Typography, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadFile } from 'antd/es/upload/interface'
import { brandApi, categoryItemApi } from '~/apis' // Cập nhật đường dẫn theo dự án của bạn
import { Brand, CategoryItem } from '~/models' // Cập nhật đường dẫn theo dự án của bạn

const { TextArea } = Input
const { Title } = Typography

const AddProductDetail = () => {
    const [brands, setBrands] = useState<Brand[]>([])
    const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([])
    const [selectedItem, setSelectedItem] = useState<{
        brand: string
        categoryItem: string
    }>({
        brand: '',
        categoryItem: '',
    })
    const [price, setPrice] = useState<string>('')
    const [productName, setProductName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [fileList, setFileList] = useState<UploadFile[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const responseBrands = await brandApi.getBrands(1, 100)
            const responseCategoryItems =
                await categoryItemApi.getCategoryItems(1, 100)
            if (
                responseBrands.err === 0 &&
                responseCategoryItems.err === 0 &&
                responseBrands.data &&
                responseCategoryItems.data
            ) {
                setBrands(responseBrands.data)
                setCategoryItems(responseCategoryItems.data)
            }
        }
        fetchData()
    }, [])

    const handleSubmit = () => {
        // Xử lý logic submit ở đây
        console.log({
            productName,
            price,
            description,
            selectedItem,
            fileList,
        })
    }

    const handleChange = ({ fileList }: { fileList: UploadFile[] }) =>
        setFileList(fileList)

    return (
        <Card className="mt-4" bordered={false}>
            <Title level={2}>Thêm Sản Phẩm Chi Tiết</Title>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Tên sản phẩm" required>
                    <Input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="custom-input"
                    />
                </Form.Item>
                <Form.Item label="Giá" required>
                    <Input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="custom-input"
                    />
                </Form.Item>
                <Form.Item label="Mô tả" required>
                    <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="custom-textarea"
                    />
                </Form.Item>
                <Form.Item label="Tên phân loại thành phần" required>
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
                        <Select.Option value="">{`-- Chọn phân loại thành phần --`}</Select.Option>
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
                <Form.Item label="Hình ảnh" required>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={() => false} 
                        multiple={true} 
                    >
                        Tải ảnh lên
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="bg-main"
                    >
                        Tiếp theo
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AddProductDetail
