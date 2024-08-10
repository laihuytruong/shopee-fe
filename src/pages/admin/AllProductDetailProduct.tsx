import React, { useEffect, useState } from 'react'
import { Button, Divider, Modal, Select, Table } from 'antd'
import type { TableColumnsType, UploadFile } from 'antd'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { increment, selectCount } from '~/features/CounterSlice'
import {
    configurationApi,
    productDetailApi,
    variationApi,
    variationOptionApi,
} from '~/apis'
import {
    Configuration,
    PaginationInfo,
    ProductDetailData,
    Variation,
    VariationOption,
} from '~/models'
import icons from '~/utils/icons'
import { ConfirmToast, InputCustom, UploadImages } from '~/components'
import { selectAccessToken } from '~/features/UserSlice'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import admin_routes from '~/config/admin_routes'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

const { HiOutlinePencilSquare, MdDeleteOutline, IoReturnUpBack } = icons

interface MultipleVariationOption {
    [key: string]: VariationOption[]
}

const AllProductDetailProduct = () => {
    const dispatch = useAppDispatch()
    const nav = useNavigate()
    const count = useAppSelector(selectCount)
    const token = useAppSelector(selectAccessToken)
    const [productDetails, setProductDetails] = useState<Configuration[]>([])
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
        page: 1,
        pageSize: 5,
        totalCount: 0,
        totalPage: 1,
    })
    const [open, setOpen] = useState<boolean>(false)
    const [isAdd, setIsAdd] = useState<boolean>(true)
    const [isReset, setIsReset] = useState<boolean>(false)
    const [type, setType] = useState<string | undefined>()

    const [price, setPrice] = useState<string>('0')
    const [inventory, setInventory] = useState<string>('0')
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [variation, setVariation] = useState<Variation[]>([])
    const [variationOption, setVariationOption] =
        useState<MultipleVariationOption>({} as MultipleVariationOption)
    const [selectVariationOption, setSelectVariationOption] = useState<{
        [key: string]: string
    }>({})
    const [productDetailId, setProductDetailId] = useState<string>('')
    const [configurationId, setConfigurationId] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [productDetailData, setProductDetailData] = useState<
        ProductDetailData[]
    >([])

    const { slug } = useParams()

    useEffect(() => {
        const fetchDetails = async () => {
            if (slug !== undefined) {
                const responseConfigurations =
                    await configurationApi.getConfigurationByDetail({
                        slug,
                        page: paginationInfo.page,
                        pageSize: paginationInfo.pageSize,
                        token,
                    })
                console.log('responseConfigurations: ', responseConfigurations)
                const getProductDetail =
                    await productDetailApi.getProductDetail(
                        slug ? slug : '',
                        1,
                        100
                    )
                if (
                    responseConfigurations.err === 0 &&
                    responseConfigurations.data
                ) {
                    const responseVariations =
                        await variationApi.getVariationsByCategory(
                            token,
                            responseConfigurations.data.configurations[0]
                                .productDetailId.product.categoryItem.category
                                ?._id
                        )
                    if (
                        responseVariations.err === 0 &&
                        responseVariations.data
                    ) {
                        setProductDetails(
                            responseConfigurations.data.configurations
                        )
                        setPaginationInfo({
                            page: responseConfigurations.page
                                ? responseConfigurations.page
                                : 1,
                            pageSize: responseConfigurations.pageSize
                                ? responseConfigurations.pageSize
                                : 5,
                            totalCount: responseConfigurations.totalCount
                                ? responseConfigurations.totalCount
                                : 0,
                            totalPage: responseConfigurations.totalPage
                                ? responseConfigurations.totalPage
                                : 1,
                        })
                        setVariation(responseVariations.data)
                    }
                } else if (
                    getProductDetail.err === 0 &&
                    getProductDetail.data
                ) {
                    setProductDetails([])
                    setProductDetailData(getProductDetail.data)
                    const responseVariations =
                        await variationApi.getVariationsByCategory(
                            token,
                            getProductDetail.data[0].product.categoryItem
                                .category?._id
                        )
                    if (
                        responseVariations.err === 0 &&
                        responseVariations.data
                    ) {
                        setVariation(responseVariations.data)
                    }
                }
            }
        }
        fetchDetails()
    }, [slug, count, paginationInfo.page])

    useEffect(() => {
        const fetchVariationOption = async () => {
            variation.map(async (item) => {
                if (item._id in variationOption) {
                    return
                } else {
                    const response =
                        await variationOptionApi.getVariationOptionsByVariation(
                            token,
                            item._id
                        )

                    if (response.err === 0) {
                        setVariationOption((prev) => ({
                            ...prev,
                            [item.name]: response.data ? response.data : [],
                        }))
                    }
                }
            })
        }
        fetchVariationOption()
    }, [variation])

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
            setPrice('0')
            setInventory('0')
            setFileList([])
            setSelectVariationOption({})
            setIsReset(true)
            setOpen(true)
        } else {
            setIsReset(false)
            setOpen(true)
        }
    }

    const handleOk = async () => {
        try {
            if (fileList.length === 0) {
                toast.error('Vui lòng chọn hình ảnh thumbnail!')
                return
            }
            const thumbnail = fileList[0]?.originFileObj
                ? (fileList[0]?.originFileObj as File)
                : await fetch(fileList[0]?.url ?? '')
                      .then((res) => res.blob())
                      .then(
                          (blob) =>
                              new File([blob], fileList[0].name, {
                                  type: blob.type,
                              })
                      )

            const variationOptionId = Object.values(selectVariationOption).join(
                ', '
            )

            const formData = new FormData()
            formData.append('price', price.toString())
            formData.append('inventory', inventory.toString())
            formData.append('product', productDetailData[0].product._id)
            formData.append('image', thumbnail)
            setIsLoading(true)
            if (isAdd) {
                const responseCreate = await productDetailApi.create(
                    token,
                    formData
                )
                if (
                    responseCreate.err === 0 &&
                    responseCreate.data &&
                    responseCreate.data._id
                ) {
                    setOpen(false)
                    setIsAdd(true)
                    setIsReset(false)

                    const data = {
                        token,
                        productDetailId: responseCreate.data?._id,
                        variationOptionId,
                    }
                    const responseCreateConfiguration =
                        await configurationApi.createConfiguration(data)
                    if (responseCreateConfiguration.err === 0) {
                        setIsLoading(false)
                        toast.success(
                            'Sản phẩm chi tiết đã được thêm thành công!'
                        )
                        if (productDetails.length === paginationInfo.pageSize) {
                            setPaginationInfo((prev) => ({
                                ...prev,
                                page: prev.page + 1,
                            }))
                        } else {
                            dispatch(increment())
                        }
                    }
                } else {
                    toast.error('Không thể thêm sản phẩm chi tiết!')
                }
            } else if (configurationId !== '') {
                const responseUpdate = await productDetailApi.update(
                    token,
                    productDetailId,
                    formData
                )
                if (responseUpdate.err === 0) {
                    const data = {
                        token,
                        configurationId,
                        productDetailId,
                        variationOptionId,
                    }
                    const responseUpdateConfiguration =
                        await configurationApi.updateConfiguration(data)
                    if (responseUpdateConfiguration.err === 0) {
                        setIsLoading(false)
                        setOpen(false)
                        setIsAdd(true)
                        setIsReset(false)
                        dispatch(increment())
                        toast.success('Sản phẩm đã được cập nhật thành công!')
                    }
                } else {
                    toast.error('Không thể cập nhật sản phẩm chi tiết!')
                }
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const handleUpdatePD = (configuration: Configuration) => {
        try {
            setIsAdd(false)
            setOpen(true)
            setConfigurationId(configuration._id)
            setProductDetailId(configuration.productDetailId._id)
            setPrice(configuration.productDetailId.price.toString())
            setInventory(configuration.productDetailId.inventory.toString())
            setFileList(
                configuration.productDetailId.image
                    ? [
                          {
                              uid: '-1',
                              name: 'thumbnail.png',
                              status: 'done',
                              url: configuration.productDetailId.image,
                          },
                      ]
                    : []
            )

            const selectedOptions: { [key: string]: string } = {}

            configuration.variationOptionId.forEach((item) => {
                selectedOptions[item.variationId.name] = item._id
            })

            setSelectVariationOption(selectedOptions)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        if (isAdd) {
            setIsReset(true)
            setPrice('0')
            setInventory('0')
            setFileList([])
            setSelectVariationOption({})
            setOpen(false)
            setIsAdd(true)
        } else {
            setOpen(false)
            setIsAdd(true)
            setIsReset(false)
        }
    }

    const handleDeletePD = async (
        productDetailId: string,
        configurationId: string
    ) => {
        toast(
            <ConfirmToast
                message="Bạn có chắc chắn muốn xóa sản phẩm chi tiết này?"
                onConfirm={() =>
                    confirmDeletePD(productDetailId, configurationId)
                }
                onCancel={() => console.log('Cancel')}
            />
        )
    }

    const confirmDeletePD = async (
        productDetailId: string,
        configurationId: string
    ) => {
        try {
            const response = await productDetailApi.delete(
                token,
                productDetailId
            )
            const data = { token, configurationId }
            const responseDeleteConfiguration =
                await configurationApi.deleteConfiguration(data)
            if (response.err === 0 && responseDeleteConfiguration.err === 0) {
                toast.success('Sản phẩm chi tiết đã được xóa thành công!')
                if (paginationInfo.page > 1 && productDetails.length === 1) {
                    setPaginationInfo((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                    }))
                } else {
                    dispatch(increment())
                }
            } else {
                toast.error('Không thể xóa sản phẩm chi tiết này!')
            }
        } catch (error) {
            console.log(error)
            toast.error('Có lỗi xảy ra!')
        }
    }

    const columns: TableColumnsType<Configuration> = [
        {
            title: 'Giá',
            dataIndex: 'productDetailId',
            width: '17.5%',
            align: 'center',
            render: (productDetailId: Configuration['productDetailId']) => (
                <div>{productDetailId.price}</div>
            ),
        },
        {
            title: 'Số lượng tồn kho',
            dataIndex: 'productDetailId',
            width: '17.5%',
            align: 'center',
            render: (productDetailId: Configuration['productDetailId']) => (
                <div>{productDetailId.inventory}</div>
            ),
        },
        {
            title: 'Tùy chọn',
            dataIndex: 'variationOptionId',
            width: '17.5%',
            align: 'center',
            render: (variationOptionId: Configuration['variationOptionId']) => (
                <div>
                    {variationOptionId.map((option, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '4px 8px',
                                margin: '4px 0',
                                borderRadius: '4px',
                                backgroundColor: '#f0f0f0',
                            }}
                        >
                            {option.variationId.name}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Tùy chọn biến thể',
            dataIndex: 'variationOptionId',
            width: '17.5%',
            align: 'center',
            render: (
                variationOptionIds: Configuration['variationOptionId']
            ) => (
                <div>
                    {variationOptionIds.map((option, index) => {
                        return (
                            <div
                                key={index}
                                style={{
                                    padding: '4px 8px',
                                    margin: '4px 0',
                                    borderRadius: '4px',
                                    backgroundColor: '#f0f0f0',
                                }}
                            >
                                {option.value}
                            </div>
                        )
                    })}
                </div>
            ),
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'productDetailId',
            width: '20%',
            align: 'center',
            render: (productDetailId: Configuration['productDetailId']) => (
                <div className="flex items-center justify-center">
                    <img
                        src={productDetailId.image}
                        alt="image"
                        className="w-[56px] h-w-[56px]"
                    />
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '10%',
            align: 'center',
            render: (productDetail: Configuration) => (
                <span className="flex items-center justify-center">
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() => handleUpdatePD(productDetail)}
                    >
                        <HiOutlinePencilSquare size={20} />
                    </span>
                    <Divider type="vertical" />
                    <span
                        className="hover:text-main hover:cursor-pointer"
                        onClick={() =>
                            handleDeletePD(
                                productDetail.productDetailId._id,
                                productDetail._id
                            )
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
                <div className="flex items-center gap-2">
                    <span
                        className="hover:cursor-pointer"
                        onClick={() => nav(admin_routes.ALL_PRODUCTS)}
                    >
                        <IoReturnUpBack size={24} />
                    </span>
                    <h1 className="text-xl font-bold">
                        DANH SÁCH SẢN PHẨM CHI TIẾT
                    </h1>
                </div>
                <button
                    className="bg-main px-4 py-2 text-white rounded hover:opacity-[0.9]"
                    onClick={showModal}
                >
                    Thêm sản phẩm chi tiết
                </button>

                <Modal
                    title={`${
                        isAdd
                            ? 'Thêm sản phẩm chi tiết'
                            : 'Cập nhật sản phẩm chi tiết'
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
                            {isLoading ? (
                                <Spin
                                    indicator={
                                        <LoadingOutlined
                                            style={{ fontSize: 24 }}
                                            spin
                                        />
                                    }
                                />
                            ) : isAdd ? (
                                'Thêm'
                            ) : (
                                'Cập nhật'
                            )}
                        </Button>,
                    ]}
                >
                    <InputCustom
                        setType={setType}
                        setValue={setPrice}
                        valueData={price}
                        valueName="price"
                        placeholder="Nhập giá"
                        isReset={isReset}
                    />
                    <InputCustom
                        setType={setType}
                        setValue={setInventory}
                        valueData={inventory}
                        valueName="inventory"
                        placeholder="Nhập số lượng"
                        isReset={isReset}
                    />
                    {Object.keys(variationOption).map((key) => (
                        <Select
                            key={key}
                            placeholder={`Vui lòng chọn ${key.toLowerCase()}`}
                            className="w-full mb-2"
                            value={selectVariationOption[key]}
                            onChange={(value) => {
                                console.log(`Selected ${value} for ${key}`)
                                setSelectVariationOption((prev) => ({
                                    ...prev,
                                    [key]: value,
                                }))
                            }}
                        >
                            {variationOption[key].map((option) => (
                                <Select.Option
                                    key={option._id}
                                    value={option._id}
                                >
                                    {option.value}
                                </Select.Option>
                            ))}
                        </Select>
                    ))}
                    <UploadImages
                        fileList={fileList}
                        setFileList={setFileList}
                        limitImage={1}
                    />
                </Modal>
            </div>
            <Table
                columns={columns}
                dataSource={productDetails}
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

export default AllProductDetailProduct
