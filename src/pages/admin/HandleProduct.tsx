import React, { useEffect, useState } from 'react'
import { Select, Input, Typography, Card, Form, Button, UploadFile } from 'antd'
import {
    brandApi,
    categoryApi,
    categoryItemApi,
    productApi,
    productDetailApi,
} from '~/apis'
import { Brand, Category, CategoryItem, Product } from '~/models'
import { useAppSelector } from '~/app/hooks'
import { selectAccessToken } from '~/features/UserSlice'
import { toast } from 'react-toastify'
import admin_routes from '~/config/admin_routes'
import { useNavigate, useParams } from 'react-router-dom'
import { UploadImages } from '~/components'
import Swal from 'sweetalert2'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

const { TextArea } = Input
const { Title } = Typography

const HandleProduct = () => {
    const [product, setProduct] = useState<Product>({} as Product)
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
    const [price, setPrice] = useState<number>(0)
    const [singleFile, setSingleFile] = useState<UploadFile[]>([])
    const [multipleFile, setMultipleFile] = useState<UploadFile[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const token = useAppSelector(selectAccessToken)
    const nav = useNavigate()

    const { pId } = useParams()

    useEffect(() => {
        const fetchProduct = async () => {
            if (pId) {
                const response = await productApi.getProductById(pId)
                if (
                    response.err === 0 &&
                    response.data &&
                    response.data.categoryItem.category
                ) {
                    const responseDetail =
                        await productDetailApi.getProductDetail(
                            response.data.slug,
                            1,
                            100
                        )
                    if (responseDetail.err === 0 && responseDetail.data) {
                        const productImages = response.data.image || []
                        const productDetailImages = responseDetail.data.map(
                            (item) => item.image
                        )

                        const filteredImages = productImages.filter(
                            (image) => !productDetailImages.includes(image)
                        )

                        setProduct(response.data)
                        setProductName(response.data.productName)
                        setPrice(response.data.price)
                        setSelectCategory(
                            response.data.categoryItem.category?.slug
                        )
                        setSelectedItem({
                            brand: response.data.brand._id,
                            categoryItem: response.data.categoryItem._id,
                        })
                        setSingleFile(
                            productImages.length > 0
                                ? [
                                      {
                                          uid: '-1',
                                          name: 'thumbnail.png',
                                          status: 'done',
                                          url: productImages[0],
                                      },
                                  ]
                                : []
                        )

                        if (filteredImages.length > 1) {
                            setMultipleFile(
                                filteredImages.slice(1).map((url, index) => ({
                                    uid: `-${index + 2}`,
                                    name: `image${index + 1}.png`,
                                    status: 'done',
                                    url,
                                }))
                            )
                        }
                    }
                }
            }
        }
        fetchProduct()
    }, [pId])

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
        const formData = new FormData()

        if (singleFile.length === 0) {
            toast.error('Vui lòng chọn hình ảnh thumbnail!')
            return
        }

        const thumbnail = singleFile[0]?.originFileObj
            ? (singleFile[0]?.originFileObj as File)
            : await fetch(singleFile[0]?.url ?? '')
                  .then((res) => res.blob())
                  .then(
                      (blob) =>
                          new File([blob], singleFile[0].name, {
                              type: blob.type,
                          })
                  )

        formData.append('image', thumbnail)

        if (multipleFile && multipleFile.length > 0) {
            for (const file of multipleFile) {
                if (file.originFileObj) {
                    formData.append('image', file.originFileObj as File)
                } else if (file.url) {
                    const existingFile = await fetch(file.url)
                        .then((res) => res.blob())
                        .then(
                            (blob) =>
                                new File([blob], file.name, { type: blob.type })
                        )
                    formData.append('image', existingFile)
                }
            }
        }

        formData.append('productName', productName)
        formData.append('price', price.toString())
        formData.append('brand', selectedItem.brand)
        formData.append('categoryItem', selectedItem.categoryItem)
        setIsLoading(true)
        if (pId === undefined) {
            const response = await productApi.createProduct(token, formData)
            if (response.err === 0 && response.data) {
                setIsLoading(false)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Thêm sản phẩm thành công',
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    nav(admin_routes.ALL_PRODUCTS)
                    setProductName('')
                    setPrice(0)
                    setSelectedItem({ brand: '', categoryItem: '' })
                    setSingleFile([])
                    setMultipleFile([])
                })
            } else {
                toast.error('Thêm sản phẩm thất bại')
            }
        } else {
            const response = await productApi.updateProduct(
                token,
                pId,
                formData
            )
            if (response.err === 0) {
                setIsLoading(false)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Cập nhật sản phẩm thành công',
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    nav(admin_routes.ALL_PRODUCTS)
                })
            } else {
                toast.error('Cập nhật sản phẩm thất bại')
            }
        }
    }

    return (
        <Card className="mt-4" bordered={false}>
            <Title level={2}>
                {pId !== undefined ? 'Cập nhật sản phẩm' : 'Thêm Sản Phẩm'}
            </Title>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Tên sản phẩm" required>
                    <TextArea
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        rows={3}
                        className="focus:border-main hover:border-main"
                    />
                </Form.Item>
                <Form.Item label="Giá" required>
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(+e.target.value)}
                        className="focus:border-main hover:border-main"
                    />
                </Form.Item>
                <Form.Item label="Tên ngành hàng" required>
                    <Select
                        onChange={(value) => setSelectCategory(value)}
                        value={selectCategory}
                        defaultValue={
                            product?.categoryItem?.category?.categoryName
                        }
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
                        defaultValue={product?.categoryItem?.categoryItemName}
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
                        defaultValue={product?.brand?.brandName}
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
                <Form.Item label="Ảnh bìa" required>
                    <UploadImages
                        fileList={singleFile}
                        setFileList={setSingleFile}
                        limitImage={1}
                    />
                </Form.Item>
                <Form.Item label="Hình ảnh mô tả sản phẩm" required>
                    <UploadImages
                        fileList={multipleFile}
                        setFileList={setMultipleFile}
                        limitImage={5}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={
                            productName !== '' &&
                            price !== 0 &&
                            selectedItem.brand !== '' &&
                            selectedItem.categoryItem !== '' &&
                            singleFile.length > 0 &&
                            multipleFile.length > 0
                                ? false
                                : true
                        }
                        className="custom-bg"
                    >
                        {isLoading ? (
                            <Spin
                                indicator={
                                    <LoadingOutlined
                                        style={{ fontSize: 24 }}
                                        spin
                                    />
                                }
                            />
                        ) : pId === undefined ? (
                            'Thêm'
                        ) : (
                            'Cập nhật'
                        )}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default HandleProduct
