const routes = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: '/login',
    REGISTER: '/register',
    REGISTER_FINAL: '/register/:step',
    DAILY_DISCOVER: 'daily_discover',
    PRODUCT_CATEGORY: 'category/:slugCategory',
    PRODUCT_DETAIL: 'product-detail/:slugProduct',
    SEARCH: 'search',
    RESET_PASSWORD: '/reset-password',
    FORGOT_PASSWORD: '/forgot-password',
    ME: '/user',
    MY_ACCOUNT: '/user/account/profile',
    CHANGE_PASSWORD: '/user/account/change-password',
    ORDER: '/user/purchase',
    CART: '/cart',
    PAYMENT: '/payment',
    PAYMENT_ANNOUNCE: '/payment/:type_payment',
}

export default routes
