import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography } from 'antd'
import { UploadFile } from 'antd/es/upload/interface'
import { useParams } from 'react-router-dom'
import { UploadImages } from '~/components'
import { toast } from 'react-toastify'
import { productDetailApi } from '~/apis'
import { useAppSelector } from '~/app/hooks'
import { selectAccessToken } from '~/features/UserSlice'

const { Title } = Typography

const AddProductDetail = () => {
    const token = useAppSelector(selectAccessToken)

    const [price, setPrice] = useState<number>(0)
    const [inventory, setInventory] = useState<number>(0)
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const { productId } = useParams()

    const handleSubmit = async () => {
        const thumbnail = fileList && (fileList[0]?.originFileObj as File)
        if (fileList.length === 0) {
            toast.error('Vui lòng chọn hình ảnh thumbnail!')
            return
        }
        const formData = new FormData()
        formData.append('image', thumbnail)
        formData.append('price', price.toString())
        formData.append('inventory', inventory.toString())
        formData.append('product', productId ? productId : '')

        const response = await productDetailApi.create(token, formData)
        if (response.err === 0 && response.data) {
            toast.success('Thêm sản phẩm chi tiết thành công!')
            setPrice(0)
            setInventory(0)
            setFileList([])
        } else {    
            toast.error('Thêm sản phẩm chi tiết thất bại')
        }
    }

    return (
        <Card className="mt-4" bordered={false}>
            <Title level={2}>Thêm Sản Phẩm Chi Tiết</Title>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Giá" required>
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(+e.target.value)}
                        className="hover:border-main focus:border-main"
                    />
                </Form.Item>
                <Form.Item label="Số lượng tồn kho" required>
                    <Input
                        type="number"
                        value={inventory}
                        onChange={(e) => setInventory(+e.target.value)}
                        className="hover:border-main focus:border-main"
                    />
                </Form.Item>
                <Form.Item label="Hình ảnh" required>
                    <UploadImages
                        fileList={fileList}
                        setFileList={setFileList}
                        limitImage={1}
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="custom-bg mr-4"
                    >
                        Thêm
                    </Button>
                    <Button type="primary" className="custom-bg">
                        Tiếp theo
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default AddProductDetail
