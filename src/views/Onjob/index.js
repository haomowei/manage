import React from 'react'
import moment from 'moment';
import {get} from '../../api/index-网络拦截'
import { Table,Form, Input, Button,Space, Popconfirm, Row, Col, DatePicker, Select, Switch } from 'antd';
import '../css/style.less'
import {getDatas} from '../../api'
import 'moment/locale/zh-cn';
import Find from '../../components/Find'
import locale from 'antd/es/date-picker/locale/zh_CN';//设置中文

const { Option } = Select;
const formRef = React.createRef();
let dataAll, productList, productList2,newDataList
class Onjob extends React.Component {
    constructor(props) {
        super(props)
        console.log('props', props)
        this.state = {
            lists:[],//人员列表
            tag:false,//表单是否处于加载状态
            classTag:true,//是否显示编辑页面
            leaveTag:true,//离职办理页面
            addEdit:'',//新增或者编辑信息
            current:1,//当前页
            totalRecord:0,//总共多少条信息
            id:'1',//id	人员id
            dataSource:[//表单数据
                {
                    id: '1',
                    employeeNo:'12535',
                    employeeCertNo:'215252525',
                    employeeName: '老胡',
                    employeeDepartment:'技术部',
                    employeeJob:'职员',
                    employeeSuperior:'老板',
                    employeeMobile:13152525252,
                    employeeEmail:'12121212@qq.com',
                    status:'1'
                }
            ],
            columns:[//表头
                {
                    title: '员工编号',
                    dataIndex: 'employeeNo',
                    key: 'employeeNo',
                    width:80,
                    fixed:'left',
                    editable:true
                },
                {
                    title: '姓名',
                    dataIndex: 'employeeName',
                    key: 'employeeName',
                    width:70,
                    fixed:'left'
                },
                {
                    title: '身份证号',
                    dataIndex: 'employeeCertNo',
                    key: 'employeeCertNo',
                    width:150,
                    fixed:'left',
                    editable:true
                },
                {
                    title: '部门',
                    dataIndex: 'employeeDepartment',
                    key: 'employeeDepartment',
                    width:90
                },
                {
                    title:'岗位',
                    dataIndex:'employeeJob',
                    key:'employeeJob',
                    width:80
                },
                {
                    title:'直接上级',
                    dataIndex:'employeeSuperior',
                    key:'employeeSuperior',
                    width:80
                },
                {
                    title:'移动电话',
                    dataIndex:'employeeMobile',
                    key:'employeeMobile',
                    width:100
                },
                {
                    title:'电子邮箱',
                    dataIndex:'employeeEmail',
                    key:'employeeEmail',
                    width:100
                },
                {
                    title:'员工状态',
                    dataIndex:'status',
                    key:'status',
                    width:80,
                    render:  (text,record) => (
                        // if(text == '1'){
                        //     return <span>试用期</span>
                        // }else if(text =='2'){
                        //     return <span>在职</span>
                        // }
                        <Switch onChange={(e)=>this.checkeChange(record.id,e)} unCheckedChildren="试用期"  checkedChildren="在职"
                                checked={text == 1 ? false : true} />
                    )

                },
                {
                    title:'入职日期',
                    dataIndex:'inductionDate',
                    key:'inductionDate',
                    width:100
                },
                {
                    title:'创建时间',
                    dataIndex:'createtime',
                    key:'createtime',
                    width:100
                },
                {
                    title:'操作',
                    dataIndex:'operating',
                    key:'operating',
                    width:260,
                    fixed:'right',
                    render: (_, record) => (
                        <Space size="middle">
                            <a onClick={()=>this.add_edit('edit',record)}>编辑</a>
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.id)}>
                                <a>删除</a>
                            </Popconfirm>
                            <Popconfirm title="确定办理离职?" onConfirm={() => this.handleLeave(record.id)}>
                                <a>离职办理</a>
                            </Popconfirm>
                            {/*<a onClick={this.leave}>离职办理</a>*/}
                        </Space>
                    )
                }

            ]
        }
    }
    edit=()=>{
        this.setState({
            classTag:false
        })
    }
    // leave = () =>{
    //     this.setState({
    //         leaveTag: false
    //     })
    //
    // }
    //人员状态
    checkeChange = async (value,e)=>{
        let status = e ? 2 : 1
        await getDatas('/employee/regularEmployee',{id:value,status})
            .then(res=>{
                this.onFinish3({})
            })
    }
    //删除人员信息
    handleDelete = async (key) => {
        const dataSource = [...this.state.dataSource];
        console.log(key)
        this.setState({
            dataSource: dataSource.filter((item) => item.id !== key),
        });
        await getDatas('/employee/delEmployee',{id:key})
            .then(res=>{
                console.log(res)
            })
    };
    //离职办理
    handleLeave = async (key)=>{
        const dataSource2 = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource2.filter((item) => item.id !== key),
        });
        await getDatas('/employee/leaveJobEmployee',{id:key,status:3})
            .then(res=>{
                console.log(res)
            })
    }
    // jump=(data)=>{
    //     console.log(data)
    //     this.props.history.push('/insuman/playing/'+data.vedioSeriesNo)
    // }
    onFinish = async (value,type) =>{
        this.setState({
            tag:true
        })
        value.inductionDate = value.inductionDate.format('YYYY-MM-DD')
        if(type=='add'){
            await getDatas('/employee/addEmployee',value)
                .then(res=>{
                    this.onFinish3("",this.state.current)
                    console.log('新增',res)
                    this.setState({
                        tag:false
                    })
                })
        }else{
            await getDatas('/employee/modifyEmployee',Object.assign(value,{id:this.state.id}))
                .then(res=>{
                    this.onFinish3("",this.state.current)
                    console.log('编辑',res)
                    this.setState({
                        tag:false
                    })
                })
        }

        this.setState({
            classTag:true
        })
    }
    //离职办理
    // onFinish2 = (value) =>{
    //     this.setState({
    //         leaveTag:true
    //     })
    // }
    //查询
    onFinish3 = async(value,page) =>{
        this.setState({
            tag:true
        })
        let values = Object.assign(value,{pageNo:page})
        console.log(value)
        await getDatas('/employee/queryList',values)
        .then(res=>{
            console.log('查询',res)
            this.setState({
                dataSource:res.data.results,
                totalRecord:res.data.totalRecord,
                tag:false,
                current:1
            })
        })
    }
    handleChange = (value)=>{
        console.log(value)
    }
    //新增/编辑
    add_edit =async(e,value)=>{
        this.setState({
            classTag:false,
            addEdit: e
        })
        if(e == 'add'){
            formRef.current.setFieldsValue({
                employeeNo:'',
                employeeName:'',
                employeeDepartment:'',
                employeeJob:'',
                employeeSuperior:'',
                employeeMobile:'',
                employeeEmail:'',
                employeeCertNo:'',
                inductionDate:''
            })

        }else{
            this.setState({
                id:value.id
            })
            formRef.current.setFieldsValue({
                employeeNo:value.employeeNo,
                employeeName:value.employeeName,
                employeeDepartment:value.employeeDepartment,
                employeeJob:value.employeeJob,
                employeeSuperior:value.employeeSuperior,
                employeeMobile:value.employeeMobile,
                employeeEmail:value.employeeEmail,
                inductionDate:value.inductionDate ? moment(value.inductionDate) :moment('2020-12-12'),
                employeeCertNo:value.employeeCertNo
            })
        }
    }
    fn =(item)=>{
        this.setState({
            current:item
        })
        this.onFinish3({},item)
    }
    componentDidMount=async()=> {
        this.onFinish3({},1)

    }
    render() {

        return (
            <div className="edit_out">
                <Find Tag = 'true' Found = {(e)=>{this.onFinish3(e,1)}} Adds = {(e) => {this.add_edit(e)}}/>

                <Table scroll={{x: 1500}} dataSource={this.state.dataSource} columns={this.state.columns} loading={this.state.tag} pagination={{pageSize:10,current:this.state.current, defaultCurrent:1 ,total:this.state.totalRecord,onChange:this.fn}}/>
{/*-------------------------------编辑新增-----------------------------*/}
                <div className={"edit_in"+ " " + (this.state.classTag ? "none" : '')}>
                    <div className='edit'>
                        <div className="title-edit">{this.state.addEdit == 'add' ? '新增' : '编辑'}</div>
                        <Form
                            ref={formRef}
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            labelCol={{
                                span:8
                            }}
                            wrapperCol={{
                                span:16
                            }}
                            labelAlign="right"
                            onFinish={(e) => this.onFinish(e,this.state.addEdit)}
                            // onFinishFailed={onFinishFailed}
                        >
                            <Row >
                                <Col span={24} >
                                    <Form.Item
                                        label="员工姓名"
                                        name="employeeName"
                                        rules={[
                                            {
                                                required: true,
                                                rule: /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/,
                                                message: '请输入姓名!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item
                                        label="身份证号"
                                        name="employeeCertNo"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入身份证号!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item
                                        label="部门"
                                        name="employeeDepartment"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入部门!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="岗位"
                                        name="employeeJob"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入部门!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item
                                        label="直接上级"
                                        name="employeeSuperior"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入直属领导!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item
                                        label="移动电话"
                                        name="employeeMobile"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入移动电话!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item
                                        label="电子邮箱"
                                        name="employeeEmail"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入邮箱!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Form.Item
                                        label="入职日期"
                                        name="inductionDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: '入职日期!',
                                            },
                                        ]}
                                    >

                                        <DatePicker showToday />
                                    </Form.Item>
                                </Col>
                                <Col span={24} >
                                    <Row justify="center">
                                        <Col span={8} offset={3}>
                                            <Form.Item >
                                                <Button block size="large"  type="primary" htmlType="submit">
                                                    确认
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} >
                                            <Form.Item >
                                                <Button  size="large" block onClick={()=>this.setState({classTag:true})} type="primary">
                                                    取消
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>

            </div>


        )
    }
}

export default Onjob