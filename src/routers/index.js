// 公共路由与私有路由
import { Login, Onjob, Resign, Certificate, Contract,  User, UserAdd, UserEdit, Train,Salary,Reward,Punishment,NotFound} from '../views'

import Heade from '../components/heade'
const commentRouters = [
    {
        pathname:'/login',
        pathname2:'/login',
        component:Login,
        title:'登录页面'
    },
    {
        pathname:'/404',
        pathname2:'/404',
        component:NotFound,
        title:'404'
    },
    {
        pathname:'/header',
        pathname2:'/header',
        component:Heade
    }
]
// 私有路由
const privateRouters = [
    {
        pathname:'/insuman/onjob',
        pathname2:'/insuman/onjob',
        component:Onjob,
        title:'在职人员管理'
    },
    {
        pathname:'/insuman/resign',
        pathname2:'/insuman/resign',
        component:Resign,
        title:'离职人员管理'
    },
    {
        pathname:'/insuman/certificate',
        pathname2:'/insuman/certificate',
        component:Certificate,
        title:'执业登记管理'
    },
    {
        pathname:'/insuman/salary',
        pathname2:'/insuman/salary',
        component:Salary,
        title:'薪资管理'
    },
    {
        pathname:'/insuman/reward',
        pathname2:'/insuman/reward',
        component:Reward,
        title:'奖励管理'
    },
    {
        pathname:'/insuman/punishment',
        pathname2:'/insuman/punishment',
        component:Punishment,
        title:'处罚管理'
    },
    {
        pathname:'/insuman/contract',
        pathname2:'/insuman/contract',
        component:Contract,
        title:'合同管理'
    },
    {
        pathname:'/insuman/train',
        pathname2:'/insuman/train',
        component:Train,
        title:'培训管理'
    },
    {
        pathname:'/insuman/user',
        pathname2:'/insuman/user',
        component:User,
        title:'用户管理'
    },
    {
        pathname:'/insuman/useradd',
        pathname2:'/insuman/useradd',
        component:UserAdd,
        title:'增加用户'
    },
    {
        pathname:'/insuman/useredit/:id',
        pathname2:'/insuman/useredit',
        component:UserEdit,
        title:'修改用户'
    }
]

export {
    commentRouters,
    privateRouters
}