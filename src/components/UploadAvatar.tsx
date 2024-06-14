import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Upload, Modal } from 'antd'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'

interface Props {
    fileList: UploadFile[]
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
    })

const UploadAvatar: React.FC<Props> = ({fileList, setFileList}) => {
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as File)
        }
        setPreviewImage(file.url || (file.preview as string))
        setPreviewOpen(true)
    }

    const handleChange: UploadProps['onChange'] = ({ fileList }) => {
        setFileList(fileList.slice(-1)) 
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Chọn ảnh</div>
        </div>
    )

    return (
        <div className="flex flex-col gap-3 justify-center items-center">
            <Upload
                accept="image/jpeg,image/png,image/jpg"
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
            >
                {fileList.length === 0 ? uploadButton : null}
            </Upload>
            <p className='text-[#999] text-sm'>Định dạng:.JPEG, .PNG, .JPG</p>
            <Modal
                open={previewOpen}
                title="Preview Image"
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <img
                    alt="preview"
                    style={{ width: '100%' }}
                    src={previewImage}
                />
            </Modal>
        </div>
    )
}

export default UploadAvatar
