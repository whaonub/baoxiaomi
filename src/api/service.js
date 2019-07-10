/*跨域地址*/
const dev = process.env.dev
const plan = process.env.plan
const test = process.env.test
const productList = process.env.productList
const authService = process.env.authService

export default {
    /**更新token */
    refreshToken: {
        url: authService + '/app/refresh',
        method: 'post'
    }
};
