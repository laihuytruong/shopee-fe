import React, { useEffect, useState } from 'react'
import { Button, Divider, Modal, Select, Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import { variationApi, variationOptionApi } from '~/apis'
import { PaginationInfo, Variation, VariationOption } from '~/models'
import icons from '~/utils/icons'
import { ConfirmToast, InputCustom } from '~/components'
import { selectAccessToken } from '~/features/UserSlice'
import { toast } from 'react-toastify'

const { HiOutlinePencilSquare, MdDeleteOutline } = icons

const AllVariationOptions = () => {
    const dispatch = useAppDispatch()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
    const [variation, setVariation] = useState<Variation[]>([])
    const [variationOptions, setVariationOptions] = useState<VariationOption[]>(
        []
    )
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 5,
        totalCount: 0,
        totalPage: 1,
    })
    const [open, setOpen] = useState<boolean>(false)
    const [isAdd, setIsAdd] = useState<boolean>(true)
    const [value, setValue] = useState<string>('')
    const [selectedVariation, setSelectedVariation] = useState<string>('')
    const [type, setType] = useState<string | undefined>()
    const [isReset, setIsReset] = useState<boolean>(false)
    const [variationOptionId, setVariationOptionId] = useState<string>('')

    useEffect(() => {
        const fetchVariationOptions = async () => {
            const { page, pageSize } = paginationInfo
            const response = await variationOptionApi.getVariationOptions(
                token,
                page,
                pageSize
            )
            const responseVariation = await variationApi.getVariations(
                token,
                1,
                100
            )
            if (
                response.err === 0 &&
                response.data &&
                responseVariation.err === 0 &&
                responseVariation.data
            ) {
                setVariationOptions(response.data)
                setVariation(responseVariation.data)
                setPaginationInfo({
                    page: response.page ? response.page : 1,
                    pageSize: response.pageSize ? response.pageSize : 8,
                    totalCount: response.totalCount ? response.totalCount : 0,
                    totalPage: response.totalPage ? response.totalPage : 1,
                })
            }
        }
        fetchVariationOptions()
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
            setValue('')
            setSelectedVariation('')
            setOpen(true)
        } else {
            setIsReset(false)
            setOpen(true)
        }
    }

    const handleOk = async () => {
        try {
            const checkExist = variationOptions.some(
                (v) => v.value.toLowerCase() === value.toLowerCase()
            )
            if (isAdd) {
                if (!checkExist) {
                    const responseCreate =
                        await variationOptionApi.createVariationOption(
                            token,
                            value,
                            selectedVariation
                        )
                    if (responseCreate.err === 0) {
                        setOpen(false)
                        setIsAdd(true)
                        setIsReset(false)
                        toast.success(
                            'Tùy chọn biến thể đã được thêm thành công!'
                        )

                        if (
                            variationOptions.length === paginationInfo.pageSize
                        ) {
                            setPaginationInfo({
                                ...paginationInfo,
                                page: paginationInfo.totalPage + 1,
                            })
                        } else {
                            dispatch(increment())
                        }
                    } else {
                        toast.error('Không thể thêm tùy chọn biến thể!')
                    }
                } else {
                    toast.warn('Tùy chọn biến thể đã tồn tại!')
                }
            } else if (variationOptionId !== '') {
                const responseUpdate =
                    await variationOptionApi.updateVariationOption(
                        token,
                        variationOptionId,
                        value,
                        selectedVariation
                    )
                if (responseUpdate.err === 0) {
                    setOpen(false)
                    setIsAdd(true)
                    setIsReset(false)
                    dispatch(increment())
                    toast.success(
                        'Tùy chọn biến thể đã được cập nhật thành công!'
                    )
                } else {
                    toast.error('Không thể cập nhật tùy chọn biến thể!')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const handleUpdateVariationOption = async (
        variationOption: VariationOption
    ) => {
        try {
            setOpen(true)
            setIsAdd(false)
            setValue(variationOption.value)
            setVariationOptionId(variationOption._id)
            setSelectedVariation(
                variationOption.variationId
                    ? variationOption.variationId._id
                    : ''
            )
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        if (isAdd) {
            setIsReset(true)
            setValue('')
            setSelectedVariation('')
            setOpen(false)
            setIsAdd(true)
        } else {
            setOpen(false)
            setIsAdd(true)
            setIsReset(false)
        }
    }

    const handleDeleteVariationOption = async (variationOptionId: string) => {
        toast(
            <ConfirmToast
                message="Bạn có chắc chắn muốn xóa tùy chọn biến thể này?"
                onConfirm={() =>
                    confirmDeleteVariationOption(variationOptionId)
                }
                onCancel={() => console.log('Cancel')}
            />
        )
    }

    const confirmDeleteVariationOption = async (variationOptionId: string) => {
        try {
            const response = await variationOptionApi.deleteVariationOption(
                token,
                variationOptionId
            )
            if (response.err === 0) {
                toast.success('Tùy chọn biến thể đã được xóa thành công!')
                if (paginationInfo.page > 1 && variationOptions.length === 1) {
                    setPaginationInfo((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                    }))
                } else {
                    dispatch(increment())
                }
            } else {
                toast.error('Không thể xóa tùy chọn biến thể này!')
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const columns: TableColumnsType<VariationOption> = [
        {
            title: 'Tên',
            dataIndex: 'value',
            width: '40%',
            align: 'center',
        },
        {
            title: 'Biến thể',
            dataIndex: ['variationId', 'name'],
            width: '40%',
            align: 'center',
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '20%',
            align: 'center',
            render: (variationOption: VariationOption) => (
                <span className="flex items-center justify-center">
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() =>
                            handleUpdateVariationOption(variationOption)
                        }
                    >
                        <HiOutlinePencilSquare size={20} />
                    </span>
                    <Divider type="vertical" />
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() =>
                            handleDeleteVariationOption(variationOption._id)
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
                    DANH SÁCH TÙY CHỌN BIẾN THỂ
                </h1>
                <button
                    className="bg-main px-4 py-2 text-white rounded hover:opacity-[0.9]"
                    onClick={showModal}
                >
                    Thêm tùy chọn biến thể
                </button>

                <Modal
                    title={`${
                        isAdd
                            ? 'Thêm tùy chọn biến thể'
                            : 'Cập nhật tùy chọn biến thể'
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
                        setValue={setValue}
                        valueData={value}
                        valueName="value"
                        placeholder="Nhập giá trị"
                        isReset={isReset}
                    />
                    <Select
                        placeholder="-- Chọn phân loại --"
                        onChange={(value) => setSelectedVariation(value)}
                        value={selectedVariation}
                        className="w-full mt-2"
                    >
                        <Select.Option value="">{`-- Chọn biến thể --`}</Select.Option>
                        {variation.map((variation) => (
                            <Select.Option
                                value={variation._id}
                                key={variation._id}
                            >
                                {variation.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Modal>
            </div>
            <Table
                columns={columns}
                dataSource={variationOptions}
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

export default AllVariationOptions
