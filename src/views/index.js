// 把views中所有页面导出
import Loadable from 'react-loadable';
import Loading from '../components/loading';

// import Article from './Article'
// import Dashboard from './Dashboard'
// import Login from './Login'
// import NotFound from './NotFound'
// import Setting from './Setting'
// import Play from './Play'
// import Resign from './Resign'
// import Certificate from './Certificate'


//实现路由的懒加载
const Login = Loadable({
    loader: () => import('./Login'),
    loading: Loading,
});
const NotFound = Loadable({
    loader: () => import('./NotFound'),
    loading: Loading,
});
const Onjob = Loadable({
    loader: () => import('./Onjob'),
    loading: Loading,
});
const Resign = Loadable({
    loader: () => import('./Resign'),
    loading: Loading,
});
const Certificate = Loadable({
    loader: () => import('./Certificate'),
    loading: Loading,
});
const Contract = Loadable({
    loader:()=> import('./Contract'),
    loading:Loading
})
const User = Loadable({
    loader:()=> import('./User'),
    loading:Loading
})
const UserAdd = Loadable({
    loader:()=> import('./UserAdd'),
    loading:Loading
})
const UserEdit = Loadable({
    loader:()=> import('./UserEdit'),
    loading:Loading
})
const Train = Loadable({
    loader:()=> import('./Train'),
    loading:Loading
})
const Salary = Loadable({
    loader:()=> import('./Salary'),
    loading:Loading
})
const Reward = Loadable({
    loader:()=> import('./Reward'),
    loading:Loading
})
const Punishment = Loadable({
    loader:()=> import('./Punishment'),
    loading:Loading
})

export {
    Login,
    NotFound,
    Onjob,
    Resign,
    Certificate,
    Contract,
    User,
    UserAdd,
    UserEdit,
    Train,
    Salary,
    Reward,
    Punishment
}