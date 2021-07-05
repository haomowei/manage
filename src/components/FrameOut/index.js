// 布局 公共页面部分
import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import {Link, useHistory} from 'react-router-dom'
import { UserOutlined, LaptopOutlined, NotificationOutlined, FileOutlined } from '@ant-design/icons';
import Heade from '../heade'
import {withRouter} from 'react-router-dom'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
//定义目录与Menu组件展开状态
const contrast = [
    {
        path: ['onjob'],
        sub: ['sub1-1','sub1-1-1']
    },
    {
        path: ['resign'],
        sub: ['sub1-1','sub1-1-2']
    },
    {
        path:['certificate'],
         sub:['sub1-2','sub1-2-1']
    },
    {
        path:['contract'],
         sub:['sub1-2','sub1-2-2']
    },
    {
        path:['train'],
        sub:['sub1-3','sub1-3-1']
    },
    {
        path:['salary'],
        sub:['sub1-4','sub1-4-1']
    },
    {
        path:['reward'],
        sub:['sub1-4','sub1-4-2']
    },
    {
        path:['punishment'],
        sub:['sub1-4','sub1-4-3']
    },
    {
        path:['user','useradd','useredit'],
        sub:['sub1-5','sub1-5-1']
    }
]
class FrameOut extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            openKeys: ['sub1-1'],
            selectedKeys:['sub1-1-1'],
            isLogin : window.localStorage.getItem('isLogin'),
            data:1,
        };
    }

    rootSubmenuKeys = ['sub1-1', 'sub1-2','sub1-3','sub1-4','sub1-5'];
    updateSub=()=>{
        console.log('window.location',window.location)
        //history 的情况下
        // if(window.location.pathname.split('/')[2]){
        //     const path = window.location.pathname.split('/')[3]
        //     const contrast2=  contrast.filter(item=>{
        //         console.log(item.path.indexOf(path));
        //         return item.path.indexOf(path) !=-1
        //     })
        //     console.log('contrast2',contrast2)
        //     if(contrast2.length!=0){
        //         this.setState({
        //             openKeys : [contrast2[0].sub[0]],
        //             selectedKeys: [contrast2[0].sub[1]]
        //         })
        //     }
        //
        // }
    //    hash的情况下
        if(window.location.hash.split('/')[3]){
            const path = window.location.hash.split('/')[3]
            const contrast2=  contrast.filter(item=>{
                console.log(item.path.indexOf(path));
                return item.path.indexOf(path) !=-1
            })
            console.log('contrast2',contrast2)
            this.setState({
                openKeys : [contrast2[0].sub[0]],
                selectedKeys: [contrast2[0].sub[1]]
            })
        }
    }
    componentDidMount(){
        // const history = useHistory()
        console.log(window.location.pathname)
        if(!window.localStorage.getItem('isLogin')){
            this.props.history.push('/login')
        }
        this.updateSub()
    }
    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };
    fn=({item, key, keyPath, domEvent})=> {
        console.log('item',item)
        console.log('key',key)
        console.log('keyPath',keyPath)
        console.log('devEvwnt',domEvent)
        this.updateSub()
    }
    Management( {key, domEvent}){
        console.log(key)
    }
    updateParent=(e)=>{
        console.log('父传子信息',e)
        this.props.appUpdate(e)
        this.setState(
            {
                data:e
            }
        )
    }
    render() {
        return (
            <Layout style={{minHeight:'100%'}}>
                <Heade isLogin= {this.state.isLogin} update={(data)=>this.updateParent(data)}/>
                <Layout >
                    <Sider breakpoint="lg"
                           width={260} className="site-layout-background">
                        <Menu
                            mode="inline"
                            openKeys={this.state.openKeys}
                            defaultSelectedKeys={['sub1-1-1']}
                            onOpenChange={this.onOpenChange}
                            selectedKeys={this.state.selectedKeys}
                            defaultOpenKeys={['sub1-1']}
                            style={{ height: '100%', borderRight: 0 ,    borderRight: '1px solid #f0f0f0'}}
                            onClick={this.fn}>
                                <SubMenu key="sub1-1" icon={<FileOutlined />} title="员工信息管理">
                                    <Menu.Item key="sub1-1-1" icon={<FileOutlined />}>
                                        <Link to="/insuman/onjob">在职员工管理</Link>
                                    </Menu.Item>
                                    <Menu.Item key="sub1-1-2"  icon={<FileOutlined />}>
                                        <Link to="/insuman/resign">离职员工管理</Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub1-2" icon={<FileOutlined />} title="员工资料">
                                    <Menu.Item key="sub1-2-1" icon={<FileOutlined/>} >
                                        <Link to="/insuman/certificate">执业登记管理</Link>
                                    </Menu.Item>
                                    <Menu.Item key="sub1-2-2"  icon={<FileOutlined/>}>
                                        <Link to="/insuman/contract">合同管理</Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub1-3" icon={<FileOutlined />} title="员工培训管理">
                                    <Menu.Item key="sub1-3-1"  icon={<FileOutlined/>}>
                                        <Link to="/insuman/train">培训管理</Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub1-4" icon={<FileOutlined />} title="员工薪酬管理">
                                    <Menu.Item key="sub1-4-1"  icon={<FileOutlined/>}>
                                        <Link to="/insuman/salary">薪资管理</Link>
                                    </Menu.Item>
                                    <Menu.Item key="sub1-4-2"  icon={<FileOutlined/>}>
                                        <Link to="/insuman/reward">奖励管理</Link>
                                    </Menu.Item>
                                    <Menu.Item key="sub1-4-3"  icon={<FileOutlined/>}>
                                        <Link to="/insuman/punishment">处罚管理</Link>
                                    </Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub1-5" icon={<FileOutlined />} title="系统管理">
                                    <Menu.Item key="sub1-5-1" icon={<FileOutlined/>} >
                                        <Link to="/insuman/user">用户管理</Link>
                                    </Menu.Item>
                                </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 20px 20px' ,background:'#EFF1F5'}}>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin:'20px 0 0',
                                minHeight: 280,
                                background:'white'
                            }}
                        >
                            {this.props.children}
                            {console.log(this.props)}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default withRouter(FrameOut)