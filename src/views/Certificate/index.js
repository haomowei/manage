import React from 'react'
import moment from 'moment';
import Choice from '../../components/Choice'
import {
    EllipsisOutlined
} from '@ant-design/icons';
import {get} from '../../api/index-网络拦截'
import { Table,Form, Input, Button,Space, Popconfirm, Row, Col, DatePicker, Select} from 'antd';
import '../css/style.less'
import {getDatas} from '../../api'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';//设置中文
import Find from '../../components/Find'


const { Option } = Select;
const formRef = React.createRef();
let dataAll, productList, productList2,newDataList
class Certificate extends React.Component {
    constructor(props) {
        super(props)
        console.log('props', props)
        this.state = {
            tag:false,//表单是否处于加载状态
            classTag:true,//是否显示编辑页面
            choiceTag:true,//是否显示选择用户页
            totalRecord:'',//一共多少条数据
            totalRecord2:'',//一共多少员工
            addEdit:'',//添加编辑状态
            listsData:[],//员工列表
            employeeId:'',//员工id
            current:1,//当前页
            employeeName:'',
            employeeNo:'',
            dataSource:[//表单数据
            ],
            columns:[//表头
                {
                    title: '员工编号',
                    dataIndex: 'employeeNo',
                    key: 'employeeNo',
                    width:100,
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
                    title: '员工状态',
                    dataIndex: 'employeeStatus',
                    key: 'employeeStatus',
                    width:70,
                    fixed:'left',
                    render:(text)=>{
                        if(text == 1){
                            return <span>试用期</span>
                        }else if(text == 2){
                            return <span>在职</span>
                        }else if(text == 3){
                            return <span>离职</span>
                        }
                    }
                },
                {
                    title:'执业证编号',
                    dataIndex:'pracCertNo',
                    key:'pracCertNo',
                    width:100
                },
                {
                    title: '执业证名称',
                    dataIndex: 'pracCertName',
                    key: 'pracCertName',
                    width:100
                },

                {
                    title:'执业区域',
                    dataIndex:'pracCertArea',
                    key:'pracCertArea',
                    width:70
                },
                {
                    title:'签发机构',
                    dataIndex:'issuAgency',
                    key:'issuAgency',
                    width:100
                },
                {
                    title:'发证日期',
                    dataIndex:'issueDate',
                    key:'issueDate',
                    width:100
                },
                {
                    title:'开始日期',
                    dataIndex:'startDate',
                    key:'startDate',
                    width:100
                },
                {
                    title:'截止日期',
                    dataIndex:'endDate',
                    key:'endDate',
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
                    width:200,
                    fixed:'right',
                    render: (_, record) => (
                        <Space size="middle">
                            <a onClick={()=>this.add_edit('edit',record)}>编辑</a>
                            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.id)}>
                                <a>删除</a>
                            </Popconfirm>
                        </Space>
                    )
                }

            ]
        }
    }

    //------------------------------查询-------------------
    onFinish3 = async (value,page)=>{
        this.setState({
            tag:true
        })
        let values = Object.assign(value,{pageNo:page})
        console.log(value)
        await getDatas('/practcert/queryList',values)
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
    //新增/编辑
    add_edit =async(e,value)=>{
        this.setState({
            classTag:false,
            addEdit: e
        })
        if(e == 'add'){
            this.setState({
                employeeName:'',
                employeeNo:''
            })
            formRef.current.setFieldsValue({
                employeeId:'',
                pracCertNo:'',
                pracCertName:'',
                pracCertArea:'',
                issuAgency:'',
                status:'',
                issueDate:'',
                startDate:'',
                endDate:''
            })

        }else{
            console.log(value)
            this.setState({
                id:value.id,
                employeeName:value.employeeName,
                employeeNo:value.employeeNo
            })
            formRef.current.setFieldsValue({
                employeeId:value.employeeId.toString(),
                pracCertNo:value.pracCertNo,
                pracCertName:value.pracCertName,
                pracCertArea:value.pracCertArea,
                issuAgency:value.issuAgency,
                issueDate:value.issueDate ? moment(value.issueDate) : moment('2020-12-12'),
                startDate:value.startDate ? moment(value.startDate) : moment('2020-12-12'),
                endDate:value.endDate ? moment(value.endDate) : moment('2020-12-12')
            })
        }
    }
    //---------------------------获取员工列表------------------
    get = async ()=>{
        await getDatas('/employee/queryList')
            .then(res=>{
                this.setState({
                    listsData:res.data.results,
                    totalRecord2:res.data.totalRecord
                })
            })
    }
    //--------------------删除--------------------------
    handleDelete = async (id) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.id !== id),
        });
        await getDatas('/practcert/delPracticeCert',{id})
            .then(res=>{
                this.onFinish3("",this.state.current)
                console.log('编辑',res)
                this.setState({
                    tag:false
                })
            })
    };
    // ---------------选择员工-------------
    select = (e)=>{
        if(e != 'cancle'){
            formRef.current.setFieldsValue({
                employeeId:e.id ? e.id.toString() : '',
            })
            this.setState({
                current:1,
                employeeName:e.employeeName ? e.employeeName : '',
                employeeNo:e.employeeNo ? e.employeeNo : '',
            })
        }
        this.setState({
            choiceTag:true
        })
    }
    //--------------------------翻页---------------------
    fn =(item)=>{
        this.setState({
            current:item
        })
        this.onFinish3({},item)
    }
    //--------------新增-编辑-----------------------
    onFinish = async (value,type) =>{
        this.setState({
            tag:true
        })
        value.issueDate = value.issueDate.format('YYYY-MM-DD')
        value.startDate = value.startDate.format('YYYY-MM-DD')
        value.endDate = value.endDate.format('YYYY-MM-DD')
        if(type=='add'){
            await getDatas('/practcert/addPracticeCert',value)
                .then(res=>{
                    this.onFinish3("",this.state.current)
                    console.log('新增',res)
                    this.setState({
                        tag:false
                    })
                })
        }else{
            await getDatas('/practcert/modifyPracticeCert',Object.assign(value,{id:this.state.id}))
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
    choice = ()=>{
        this.setState({
            choiceTag: false
        })
    }
    componentDidMount=async()=> {
        this.get()
        this.onFinish3({},1)
    }
    render() {

        return (
            <div className="edit_out">
                <Find Tag = 'true' Found = {(e)=>{this.onFinish3(e,1)}} Adds = {(e) => {this.add_edit(e)}}/>
                {/*-------------------------用户信息展示---------------------------*/}

                <Table scroll={{x: 1500}} dataSource={this.state.dataSource} columns={this.state.columns} loading={this.state.tag} pagination={{pageSize:10,current:this.state.current, defaultCurrent:1 ,total:this.state.totalRecord,onChange:this.fn}}/>

                {/*-----------------------选择用户信息弹框--------------------*/}
                <Choice  choiceTag = {this.state.choiceTag} cancle = {(e)=>this.select(e)}/>

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
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label="员工姓名"
                                        name="employeeId"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入姓名!',
                                            },
                                        ]}
                                    >
                                        <Row style={{color:'rgba(0, 0, 0, 0.25)',border:'1px solid #d9d9d9',padding: '4px 11px',backgroundColor:'#f5f5f5' }}>
                                            <Col span={18}>
                                                {this.state.employeeName}
                                            </Col>
                                            {   this.state.addEdit == 'add' ?
                                                <Col onClick={this.choice}  span={6} style={{color:"#d9d9d9",cursor:'pointer'}}>
                                                    请选择
                                                    <EllipsisOutlined />
                                                </Col> : ''
                                            }

                                        </Row>
                                        {/*<Select  style={{ width: 120 }} onChange={this.employeeId}>*/}
                                            {/*{*/}
                                                {/*this.state.listsData.map((value)=>{*/}
                                                    {/*return <Option value={value.id}>{value.id}&nbsp;&nbsp;&nbsp;{value.employeeName}</Option>*/}
                                                {/*})*/}
                                            {/*}*/}
                                        {/*</Select>*/}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="执业证编号"
                                        name="pracCertNo"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入姓名执业证编号!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="执业证名称"
                                        name="pracCertName"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入执业证名称!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="执业区域"
                                        name="pracCertArea"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入执业区域!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="签发机构"
                                        name="issuAgency"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入签发机构',
                                            },
                                        ]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="发证日期"
                                        name="issueDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入发证日期',
                                            },
                                        ]}
                                    >
                                        <DatePicker showToday />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="开始日期"
                                        name="startDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入开始日期',
                                            },
                                        ]}
                                    >
                                        <DatePicker showToday  />
                                    </Form.Item>
                                </Col>



                                <Col span={24}>
                                    <Form.Item
                                        label="截止日期"
                                        name="endDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入截止日期',
                                            },
                                        ]}
                                    >
                                        <DatePicker showToday />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Row justify="center">
                                        <Col  span={8} offset={3}>
                                            <Form.Item >
                                                <Button  block size="large" type="primary" htmlType="submit">
                                                    确认
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} >
                                            <Form.Item >
                                                <Button block size="large" onClick={()=>this.setState({classTag:true})}  type="primary">
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
export default Certificate