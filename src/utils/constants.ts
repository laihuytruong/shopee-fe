interface CodeDisCount {
    id: number
    image: string
    text: string
}

export const sliderImages: string[] = [
    'https://cf.shopee.vn/file/vn-50009109-b08cc77646ca8f40632f86fde2463563_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-731fb362e9862a0f7d79cf6f5be87315_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-0ee91cfefc74595983c4245ba6ff2e26_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-efc26245a65170d0458debdf6c153066_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-3b0e955bcfa5e473e92beae7e28dd822_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-7b1e743357260c4bae9d317f55a14dcb_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-b7edaa4f3ec87ab7237b84c9ce947bbe_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-825128cfa117dcd668feee5abbdbfc33_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-9c1fedced9402b9f86b8122b80b00970_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-6c72ecbbdd224b9bc4fc22722b634d3a_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-47c4a2a24eb156d62405acc126cc02e4_xxhdpi',
    'https://cf.shopee.vn/file/vn-50009109-d2ecda5c4ec037497f9c3ea9ca4c9195_xxhdpi',
]

export const listCodeDiscount: CodeDisCount[] = [
    {
        id: 1,
        image: 'https://cf.shopee.vn/file/vn-50009109-f6c34d719c3e4d33857371458e7a7059_xhdpi',
        text: 'Voucher Giảm Đến 1 Triệu',
    },
    {
        id: 2,
        image: '	https://cf.shopee.vn/file/vn-50009109-c7a2e1ae720f9704f92f72c9ef1a494a_xhdpi',
        text: 'Miễn Phí Ship - Có Shopee',
    },
    {
        id: 3,
        image: 'https://cf.shopee.vn/file/e4a404283b3824c211c1549aedd28d5f_xhdpi',
        text: 'Khung Giờ Săn Sale',
    },
    {
        id: 4,
        image: 'https://cf.shopee.vn/file/vn-50009109-8a387d78a7ad954ec489d3ef9abd60b4_xhdpi',
        text: 'Mã Giảm Giá',
    },
    {
        id: 5,
        image: 'https://cf.shopee.vn/file/vn-50009109-91399a1d3ed283d272b069fac5ca989c_xhdpi',
        text: 'Shopee Siêu Rẻ',
    },
    {
        id: 6,
        image: 'https://cf.shopee.vn/file/vn-50009109-852300c407c5e79bf5dc1854aa0cfeef_xhdpi',
        text: 'Hàng Hiệu Outlet Giảm 50%',
    },
    {
        id: 7,
        image: 'https://cf.shopee.vn/file/a08ab28962514a626195ef0415411585_xhdpi',
        text: 'Hàng Quốc Tế',
    },
    {
        id: 8,
        image: 'https://cf.shopee.vn/file/9df57ba80ca225e67c08a8a0d8cc7b85_xhdpi',
        text: 'Nạp Thẻ, Dịch Vụ & Học Phí',
    },
]

export const updateURLParams = (
    search: string,
    key: string,
    value: string | number | string[] | boolean
): string => {
    const params = new URLSearchParams(search)

    if (Array.isArray(value)) {
        params.set(key, value.join(','))
    } else if (value) {
        params.set(key, `${value}`)
    } else {
        params.delete(key)
    }

    return params.toString()
}

export const maskEmail = (email: string) => {
    const [name, domain] = email.split('@')
    const maskedName = name.slice(0, 2) + '*'.repeat(name.length - 2)
    return `${maskedName}@${domain}`
}

export const maskPhoneNumber = (phoneNumber: string) => {
    const maskedNumber =
        '*'.repeat(phoneNumber.length - 2) + phoneNumber.slice(-2)
    return maskedNumber
}
