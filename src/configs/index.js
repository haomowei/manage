const isDev = process.env.NODE_ENV === 'development'

// const BASE_URL = isDev ? 'http://testopen.iancar.cn/hrsys' : 'http://open.iancar.cn/hrsys'
const BASE_URL = isDev ? 'http://testopen.iancar.cn/hrsys' : 'http://open.iancar.cn/hrsys'
// const BASE_URL = isDev ? 'http://10.17.1.189:8080/hermessys' : 'http://testopen.iancar.cn/hermessys'
// const BASE_URL = isDev ? 'http://testopen.iancar.cn/hermessys' : 'http://testopen.iancar.cn/hermessys'
// const BASE_URL = isDev ? 'http://10.17.1.189:8080/hrsys' : 'http://10.17.1.189:8080/hrsys'

export {
    BASE_URL
}
