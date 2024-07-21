import React, { useEffect, useState } from 'react'
import { Button, Divider, Modal, Table } from 'antd'
import type { TableColumnsType, UploadFile } from 'antd'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { categoryApi } from '~/apis'
import { Category, PaginationInfo } from '~/models'
import icons from '~/utils/icons'
import { ConfirmToast, InputCustom, UploadImages } from '~/components'
import { selectAccessToken } from '~/features/UserSlice'
import { toast } from 'react-toastify'

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
    const [isAdd, setIsAdd] = useState<boolean>(true)
    const [categoryName, setCategoryName] = useState<string>('')
    const [type, setType] = useState<string | undefined>()
    const [isReset, setIsReset] = useState<boolean>(false)
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [categoryId, setCategoryId] = useState<string>('')

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
    }, [count, paginationInfo.page])

    const handleTableChange = (pagination: PaginationInfo) => {
        setPaginationInfo({
            ...paginationInfo,
            page: pagination.page,
            pageSize: pagination.pageSize,
        })
        dispatch(increment())
    }

    const showModal = () => {
        if (isAdd) {
            setCategoryName('')
            setFileList([])
            setIsReset(true)
            setOpen(true)
        } else {
            setIsReset(false)
            setOpen(true)
        }
    }

    const handleOk = async () => {
        try {
            const thumbnail = fileList && (fileList[0]?.originFileObj as File)
            const checkExist = categories.some(
                (c) =>
                    c.categoryName.toLowerCase() === categoryName.toLowerCase()
            )
            if (fileList.length === 0) {
                toast.error('Vui lòng chọn hình ảnh thumbnail!')
                return
            }
            const formData = new FormData()
            formData.append('categoryName', categoryName)
            formData.append('thumbnail', thumbnail)
            if (isAdd) {
                if (!checkExist) {
                    const responseCreate = await categoryApi.createCategory(
                        token,
                        formData
                    )
                    if (responseCreate.err === 0) {
                        setOpen(false)
                        setIsAdd(true)
                        setIsReset(false)
                        toast.success('Phân loại đã được thêm thành công!')

                        if (categories.length === paginationInfo.pageSize) {
                            setPaginationInfo((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                            }))
                        } else {
                            dispatch(increment())
                        }
                    } else {
                        toast.error('Không thể thêm phân loại!')
                    }
                } else {
                    toast.warn('Phân loại đã tồn tại!')
                }
            } else if (categoryId !== '') {
                const responseUpdate = await categoryApi.updateCategory(
                    token,
                    categoryId,
                    formData
                )
                if (responseUpdate.err === 0) {
                    setOpen(false)
                    setIsAdd(true)
                    setIsReset(false)
                    dispatch(increment())
                    toast.success('Phân loại đã được cập nhật thành công!')
                } else {
                    toast.error('Không thể cập nhật phân loại!')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const handleUpdateCategory = (category: Category) => {
        try {
            console.log('category: ', category)
            setIsAdd(false)
            setOpen(true)
            setCategoryName(category.categoryName)
            setCategoryId(category._id)
            setFileList(
                category.thumbnail
                    ? [
                          {
                              uid: '-1',
                              name: 'thumbnail.png',
                              status: 'done',
                              url: category.thumbnail,
                          },
                      ]
                    : []
            )
        } catch (error) {
            console.log(error)
        }
    }
    const handleCancel = () => {
        if (isAdd) {
            setIsReset(true)
            setCategoryName('')
            setFileList([])
            setOpen(false)
            setIsAdd(true)
        } else {
            setOpen(false)
            setIsAdd(true)
            setIsReset(false)
        }
    }

    const handleDeleteCategory = async (categoryId: string) => {
        toast(
            <ConfirmToast
                message="Bạn có chắc chắn muốn xóa phân loại này?"
                onConfirm={() => confirmDeleteCategory(categoryId)}
                onCancel={() => console.log('Cancel')}
            />
        )
    }

    const confirmDeleteCategory = async (categoryId: string) => {
        try {
            const response = await categoryApi.deleteCategory(token, categoryId)
            if (response.err === 0) {
                toast.success('Phân loại đã được xóa thành công!')
                if (paginationInfo.page > 1 && categories.length === 1) {
                    setPaginationInfo((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                    }))
                } else {
                    dispatch(increment())
                }
            } else {
                toast.error('Không thể xóa phân loại này!')
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
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
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() => handleUpdateCategory(category)}
                    >
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
                    title={`${isAdd ? 'Thêm phân loại' : 'Cập nhật phân loại'}`}
                    open={open}
                    onOk={handleOk}
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
                            {isAdd ? 'Thêm' : 'Cập nhật'}
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
