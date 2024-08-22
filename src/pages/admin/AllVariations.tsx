import React, { useEffect, useState } from 'react'
import { Button, Divider, Modal, Select, Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { brandApi, categoryApi, variationApi } from '~/apis'
import { Category, PaginationInfo, Variation } from '~/models'
import icons from '~/utils/icons'
import { ConfirmToast, InputCustom } from '~/components'
import { selectAccessToken } from '~/features/UserSlice'
import { toast } from 'react-toastify'

const { HiOutlinePencilSquare, MdDeleteOutline } = icons

const AllVariations = () => {
    const dispatch = useAppDispatch()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
    const [categories, setCategories] = useState<Category[]>([])
    const [variations, setVariations] = useState<Variation[]>([])
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 8,
        totalCount: 0,
        totalPage: 1,
    })
    const [open, setOpen] = useState<boolean>(false)
    const [isAdd, setIsAdd] = useState<boolean>(true)
    const [name, setName] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [type, setType] = useState<string | undefined>()
    const [isReset, setIsReset] = useState<boolean>(false)
    const [variationId, setVariationId] = useState<string>('')

    useEffect(() => {
        const fetchVariations = async () => {
            const { page, pageSize } = paginationInfo
            const response = await variationApi.getVariations(
                token,
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
                setVariations(response.data)
                setCategories(responseCategory.data)
                setPaginationInfo({
                    page: response.page ? response.page : 1,
                    pageSize: response.pageSize ? response.pageSize : 8,
                    totalCount: response.totalCount ? response.totalCount : 0,
                    totalPage: response.totalPage ? response.totalPage : 1,
                })
            }
        }
        fetchVariations()
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
            setName('')
            setSelectedCategory('')
            setOpen(true)
        } else {
            setIsReset(false)
            setOpen(true)
        }
    }

    const handleOk = async () => {
        try {
            const checkExist = variations.some(
                (v) =>
                    v.name.toLowerCase() === name.toLowerCase() &&
                    v.categoryId._id === selectedCategory
            )
            if (isAdd) {
                if (!checkExist) {
                    const responseCreate = await variationApi.createVariation(
                        token,
                        name,
                        selectedCategory
                    )
                    if (responseCreate.err === 0) {
                        setOpen(false)
                        setIsAdd(true)
                        setIsReset(false)
                        toast.success('Biến thể đã được thêm thành công!')

                        if (variations.length === paginationInfo.pageSize) {
                            setPaginationInfo({
                                ...paginationInfo,
                                page: paginationInfo.totalPage + 1,
                            })
                        } else {
                            dispatch(increment())
                        }
                    } else {
                        toast.error('Không thể thêm biến thể!')
                    }
                } else {
                    toast.warn('Biến thể đã tồn tại!')
                }
            } else if (variationId !== '') {
                const responseUpdate = await variationApi.updateVariation(
                    token,
                    variationId,
                    name,
                    selectedCategory
                )
                if (responseUpdate.err === 0) {
                    setOpen(false)
                    setIsAdd(true)
                    setIsReset(false)
                    dispatch(increment())
                    toast.success('Biến thể đã được cập nhật thành công!')
                } else {
                    toast.error('Không thể cập nhật biến thể!')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const handleUpdateVariation = async (variation: Variation) => {
        try {
            setOpen(true)
            setIsAdd(false)
            setName(variation.name)
            setVariationId(variation._id)
            setSelectedCategory(
                variation.categoryId ? variation.categoryId._id : ''
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        if (isAdd) {
            setIsReset(true)
            setName('')
            setSelectedCategory('')
            setOpen(false)
            setIsAdd(true)
        } else {
            setOpen(false)
            setIsAdd(true)
            setIsReset(false)
        }
    }

    const handleDeleteVariation = async (variationId: string) => {
        toast(
            <ConfirmToast
                message="Bạn có chắc chắn muốn xóa biến thể này?"
                onConfirm={() => confirmDeleteVariation(variationId)}
                onCancel={() => console.log('Cancel')}
            />
        )
    }

    const confirmDeleteVariation = async (variationId: string) => {
        try {
            const response = await variationApi.deleteVariation(
                token,
                variationId
            )
            if (response.err === 0) {
                toast.success('Biến thể đã được xóa thành công!')
                if (paginationInfo.page > 1 && variations.length === 1) {
                    setPaginationInfo((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                    }))
                } else {
                    dispatch(increment())
                }
            } else {
                toast.error('Không thể xóa biến thể này!')
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const columns: TableColumnsType<Variation> = [
        {
            title: 'Tên',
            dataIndex: 'name',
            width: '40%',
            align: 'center',
        },
        {
            title: 'Phân loại',
            dataIndex: ['categoryId', 'categoryName'],
            width: '40%',
            align: 'center',
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '20%',
            align: 'center',
            render: (variation: Variation) => (
                <span className="flex items-center justify-center">
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() => handleUpdateVariation(variation)}
                    >
                        <HiOutlinePencilSquare size={20} />
                    </span>
                    <Divider type="vertical" />
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() => handleDeleteVariation(variation._id)}
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
                <h1 className="text-xl font-bold">DANH SÁCH BIẾN THỂ</h1>
                <button
                    className="bg-main px-4 py-2 text-white rounded hover:opacity-[0.9]"
                    onClick={showModal}
                >
                    Thêm biến thể
                </button>

                <Modal
                    title={`${isAdd ? 'Thêm biến thể' : 'Cập nhật biến thể'}`}
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
                        setValue={setName}
                        valueData={name}
                        valueName="name"
                        placeholder="Nhập tên biến thể"
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
                dataSource={variations}
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

export default AllVariations
