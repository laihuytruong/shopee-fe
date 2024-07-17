import React, { useCallback, useEffect, useState } from 'react'
import { Button, Divider, Modal, Table } from 'antd'
import type { TableColumnsType, UploadFile } from 'antd'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { categoryApi } from '~/apis'
import { Category, PaginationInfo } from '~/models'
import icons from '~/utils/icons'
import { InputCustom, UploadImages } from '~/components'
import { selectAccessToken } from '~/features/UserSlice'
import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'

const { HiOutlinePencilSquare, MdDeleteOutline } = icons

const AllCategories = () => {
    const dispatch = useAppDispatch()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
    const [categories, setCategories] = useState<Category[]>([])
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 5,
        totalCount: 0,
        totalPage: 1,
    })
    const [open, setOpen] = useState<boolean>(false)
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
    const [isAdd, setIsAdd] = useState<boolean>(true)
    const [categoryName, setCategoryName] = useState<string>('')
    const [type, setType] = useState<string | undefined>()
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [isReset, setIsReset] = useState<boolean>(false)

    useEffect(() => {
        const fetchCategories = async () => {
            const { page, pageSize } = paginationInfo
            const response = await categoryApi.getCategories(page, pageSize)
            if (response.err === 0 && response.data) {
                setCategories(response.data)
                setPaginationInfo({
                    page: response.page ? response.page : 1,
                    pageSize: response.pageSize ? response.pageSize : 5,
                    totalCount: response.totalCount ? response.totalCount : 0,
                    totalPage: response.totalPage ? response.totalPage : 1,
                })
            }
        }
        fetchCategories()
    }, [count])

    const handleTableChange = (pagination: PaginationInfo) => {
        setPaginationInfo({
            ...paginationInfo,
            page: pagination.page,
            pageSize: pagination.pageSize,
        })
        dispatch(increment())
    }

    const showModal = () => {
        setIsReset(false)
        setOpen(true)
    }

    const handleOk = async () => {
        try {
            setConfirmLoading(true)
            const thumbnail = fileList && (fileList[0]?.originFileObj as File)
            const checkExist = categories.some(
                (c) =>
                    c.categoryName.toLowerCase() === categoryName.toLowerCase()
            )
            if (!checkExist) {
                const formData = new FormData()
                formData.append('categoryName', categoryName)
                formData.append('thumbnail', thumbnail)
                const responseCreate = await categoryApi.createCategory(
                    token,
                    formData
                )
                console.log('responseCreate: ', responseCreate)
                dispatch(increment())
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        setIsReset(true)
        setCategoryName('')
        setFileList([])
        setOpen(false)
    }

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa phân loại này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy bỏ',
            })

            if (result.isConfirmed) {
                const response = await categoryApi.deleteCategory(
                    token,
                    categoryId
                )
                if (response.err === 0) {
                    Swal.fire('Đã xóa!', 'Phân loại đã được xóa.', 'success')
                    dispatch(increment())
                } else {
                    Swal.fire('Lỗi!', 'Không thể xóa phân loại này.', 'error')
                }
            }
        } catch (error) {
            console.log(error)
            Swal.fire('Lỗi!', 'Có lỗi xảy ra.', 'error')
        }
    }

    const columns: TableColumnsType<Category> = [
        {
            title: 'Tên phân loại',
            dataIndex: 'categoryName',
            width: '50%',
            align: 'center',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'thumbnail',
            width: '30%',
            align: 'center',
            render: (thumbnail: string) => (
                <div className="flex items-center justify-center">
                    <img
                        src={thumbnail}
                        alt="thumbnail"
                        className="w-[56px] h-w-[56px]"
                    />
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '20%',
            align: 'center',
            render: (category: Category) => (
                <span className="flex items-center justify-center">
                    <span className="hover:text-main hover:cursor-pointer">
                        <HiOutlinePencilSquare size={20} />
                    </span>
                    <Divider type="vertical" />
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() => handleDeleteCategory(category._id)}
                    >
                        <MdDeleteOutline size={20} />
                    </span>
                </span>
            ),
        },
    ]

    return (
        <div className="pt-2">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">DANH SÁCH PHÂN LOẠI</h1>
                <button
                    className="bg-main px-4 py-2 text-white rounded hover:opacity-[0.9]"
                    onClick={showModal}
                >
                    Thêm phân loại
                </button>

                <Modal
                    title="Thêm phân loại"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    footer={[
                        <Button
                            key="cancel"
                            onClick={handleCancel}
                            className="mr-2 modal-cancel-button"
                        >
                            Hủy bỏ
                        </Button>,
                        <Button
                            key="ok"
                            type="primary"
                            onClick={handleOk}
                            disabled={type == undefined ? false : true}
                            className={`modal-ok-button`}
                        >
                            Thêm
                        </Button>,
                    ]}
                >
                    <InputCustom
                        setType={setType}
                        setValue={setCategoryName}
                        valueData={categoryName}
                        valueName="categoryName"
                        placeholder="Nhập tên phân loại"
                        isReset={isReset}
                    />
                    <UploadImages
                        fileList={fileList}
                        setFileList={setFileList}
                        limitImage={1}
                    />
                </Modal>
            </div>
            <Table
                columns={columns}
                dataSource={categories}
                size="large"
                pagination={{
                    current: paginationInfo.page,
                    pageSize: paginationInfo.pageSize,
                    total: paginationInfo.totalCount,
                    onChange: (page, pageSize) =>
                        handleTableChange({
                            page,
                            pageSize,
                            totalCount: paginationInfo.totalCount,
                            totalPage: paginationInfo.totalPage,
                        }),
                }}
            />
        </div>
    )
}

export default AllCategories
