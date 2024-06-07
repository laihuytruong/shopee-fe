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
    FORGOT_PASSWORD: '/password/forgot',
}

export default routes
