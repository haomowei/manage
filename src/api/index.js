import {axiosAll} from '../utils/http'
import {withRouter} from 'react-router-dom'
import {BASE_URL} from '../configs'

function getDatas(url, data) {
    return new Promise((resolve, reject) => {
        axiosAll({
            url,
            method: 'post',
            data,
            success(res) {
                // useHistory()
                resolve(res)
                window.localStorage.setItem('isLogin',true)
            },
            error(err) {
                console.log('err',err)
                // alert(err.response.status)
                if (err.response&&err.response.status == '401') {
                    window.localStorage.setItem('isLogin',false)
                    window.localStorage.removeItem('userName')
                    window.localStorage.removeItem('userId')
                    console.log("location",window.location)
                    // window.location.href = BASE_URL+'/insuman/index.js.html'
                    window.location.href = BASE_URL+'/insuman/index.js.html#/login'
                    // window.location.href = '#/login'
                    // window.location.href = window.location.origin+'/insuman/productconfiguration'
                }
                // console.log(err.response.status)
                reject(err)

            }
        })
    })
}
export{
    getDatas
}


