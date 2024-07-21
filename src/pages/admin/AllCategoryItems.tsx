import React, { useEffect, useState } from 'react'
import { Button, Divider, Modal, Select, Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { categoryApi, categoryItemApi } from '~/apis'
import { Category, CategoryItem, PaginationInfo } from '~/models'
import icons from '~/utils/icons'
import { ConfirmToast, InputCustom } from '~/components'
import { selectAccessToken } from '~/features/UserSlice'
import { toast } from 'react-toastify'

const { HiOutlinePencilSquare, MdDeleteOutline } = icons

const AllCategoryItems = () => {
    const dispatch = useAppDispatch()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
    const [categories, setCategories] = useState<Category[]>([])
    const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([])
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 7,
        totalCount: 0,
        totalPage: 1,
    })
    const [open, setOpen] = useState<boolean>(false)
    const [isAdd, setIsAdd] = useState<boolean>(true)
    const [categoryItemName, setCategoryItemName] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [type, setType] = useState<string | undefined>()
    const [isReset, setIsReset] = useState<boolean>(false)
    const [categoryItemId, setCategoryItemId] = useState<string>('')

    useEffect(() => {
        const fetchCategoryItem = async () => {
            const { page, pageSize } = paginationInfo
            const response = await categoryItemApi.getCategoryItems(
                page,
                pageSize
            )
            const responseCategory = await categoryApi.getCategories(1, 100)
            if (
                response.err === 0 &&
                response.data &&
                responseCategory.err === 0 &&
                responseCategory.data
            ) {
                setCategoryItems(response.data)
                setCategories(responseCategory.data)
                setPaginationInfo({
                    page: response.page ? response.page : 1,
                    pageSize: response.pageSize ? response.pageSize : 8,
                    totalCount: response.totalCount ? response.totalCount : 0,
                    totalPage: response.totalPage ? response.totalPage : 1,
                })
            }
        }
        fetchCategoryItem()
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
            setIsReset(true)
            setCategoryItemName('')
            setSelectedCategory('')
            setOpen(true)
        } else {
            setIsReset(false)
            setOpen(true)
        }
    }

    const handleOk = async () => {
        try {
            const checkExist = categoryItems.some(
                (c) =>
                    c.categoryItemName.toLowerCase() ===
                    categoryItemName.toLowerCase()
            )
            if (isAdd) {
                if (!checkExist) {
                    const responseCreate =
                        await categoryItemApi.createCategoryItem(
                            token,
                            categoryItemName,
                            selectedCategory
                        )
                    if (responseCreate.err === 0) {
                        setOpen(false)
                        setIsAdd(true)
                        setIsReset(false)
                        toast.success(
                            'Phân loại thành phần đã được thêm thành công!'
                        )

                        if (categoryItems.length === paginationInfo.pageSize) {
                            setPaginationInfo((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                            }))
                        } else {
                            dispatch(increment())
                        }
                    } else {
                        toast.error('Không thể thêm phân loại thành phần!')
                    }
                } else {
                    toast.warn('Phân loại thành phần đã tồn tại!')
                }
            } else if (categoryItemId !== '') {
                const responseUpdate = await categoryItemApi.updateCategoryItem(
                    token,
                    categoryItemId,
                    categoryItemName,
                    selectedCategory
                )
                if (responseUpdate.err === 0) {
                    setOpen(false)
                    setIsAdd(true)
                    setIsReset(false)
                    dispatch(increment())
                    toast.success(
                        'Phân loại thành phần đã được cập nhật thành công!'
                    )
                } else {
                    toast.error('Không thể cập nhật phân loại thành phần!')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const handleUpdateCategoryItem = async (categoryItem: CategoryItem) => {
        try {
            setOpen(true)
            setIsAdd(false)
            setCategoryItemName(categoryItem.categoryItemName)
            setCategoryItemId(categoryItem._id)
            setSelectedCategory(
                categoryItem.category ? categoryItem.category._id : ''
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        if (isAdd) {
            setIsReset(true)
            setCategoryItemName('')
            setSelectedCategory('')
            setOpen(false)
            setIsAdd(true)
        } else {
            setOpen(false)
            setIsAdd(true)
            setIsReset(false)
        }
    }

    const handleDeleteCategoryItem = async (categoryItemId: string) => {
        toast(
            <ConfirmToast
                message="Bạn có chắc chắn muốn xóa phân loại thành phần này?"
                onConfirm={() => confirmDeleteCategoryItem(categoryItemId)}
                onCancel={() => console.log('Cancel')}
            />
        )
    }

    const confirmDeleteCategoryItem = async (categoryItemId: string) => {
        try {
            const response = await categoryItemApi.deleteCategoryItem(
                token,
                categoryItemId
            )
            if (response.err === 0) {
                toast.success('Phân loại thành phần đã được xóa thành công!')
                if (paginationInfo.page > 1 && categoryItems.length === 1) {
                    setPaginationInfo((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                    }))
                } else {
                    dispatch(increment())
                }
            } else {
                toast.error('Không thể xóa phân loại thành phần này!')
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const columns: TableColumnsType<CategoryItem> = [
        {
            title: 'Tên phân loại thành phần',
            dataIndex: 'categoryItemName',
            width: '40%',
            align: 'center',
        },
        {
            title: 'Phân loại',
            dataIndex: ['category', 'categoryName'],
            width: '40%',
            align: 'center',
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '20%',
            align: 'center',
            render: (categoryItem: CategoryItem) => (
                <span className="flex items-center justify-center">
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() => handleUpdateCategoryItem(categoryItem)}
                    >
                        <HiOutlinePencilSquare size={20} />
                    </span>
                    <Divider type="vertical" />
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() =>
                            handleDeleteCategoryItem(categoryItem._id)
                        }
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
                <h1 className="text-xl font-bold">
                    DANH SÁCH PHÂN LOẠI THÀNH PHẦN
                </h1>
                <button
                    className="bg-main px-4 py-2 text-white rounded hover:opacity-[0.9]"
                    onClick={showModal}
                >
                    Thêm phân loại thành phần
                </button>

                <Modal
                    title={`${
                        isAdd
                            ? 'Thêm phân loại thành phần'
                            : 'Cập nhật phân loại thành phần'
                    }`}
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
                        setValue={setCategoryItemName}
                        valueData={categoryItemName}
                        valueName="categoryItemName"
                        placeholder="Nhập tên phân loại thành phần"
                        isReset={isReset}
                    />
                    <Select
                        placeholder="-- Chọn phân loại --"
                        onChange={(value) => setSelectedCategory(value)}
                        value={selectedCategory}
                        className="w-full mt-2"
                    >
                        <Select.Option value="">{`-- Chọn phân loại --`}</Select.Option>
                        {categories.map((category) => (
                            <Select.Option
                                value={category._id}
                                key={category._id}
                                c
                            >
                                {category.categoryName}
                            </Select.Option>
                        ))}
                    </Select>
                </Modal>
            </div>
            <Table
                columns={columns}
                dataSource={categoryItems}
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

export default AllCategoryItems
