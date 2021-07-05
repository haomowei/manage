import React from 'react'
import moment from 'moment';
import {
    EllipsisOutlined
} from '@ant-design/icons';
import {get} from '../../api/index-网络拦截'
import { Table,Form, Input, Button,Space, Popconfirm, Row, Col, Select, DatePicker } from 'antd';
import '../css/style.less'
import {getDatas} from '../../api'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';//设置中文
import Find from '../../components/Find'

let dataAll, productList, productList2,newDataList
const { TextArea } = Input;
const { Option } = Select;
const formRef = React.createRef();
class Resign extends React.Component {
    constructor(props) {
        super(props)
        console.log('props', props)
        this.state = {
            tag:false,//表单是否处于加载状态
            leaveTag:true,//是否显示编辑页面
            totalRecord:0,//总共多少条信息
            leaveReason:0,//离职原因
            id:'',//主键id
            employeeId:'',//人员Id
            current:1,//当前页
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
                    width:100,
                    fixed:'left'
                },
                {
                    title: '离职原因',
                    dataIndex: 'leaveReason',
                    key: 'leaveReason',
                    width:100,
                    render:(text)=>{
                        if(text == 1){
                            return <span>合同到期</span>
                        }else if(text == 2){
                            return <span>主动申请</span>
                        }else if(text == 3){
                            return <span>辞退</span>
                        }
                    }
                },
                {
                    title:'主要交接人',
                    dataIndex:'handoverPerson',
                    key:'handoverPerson',
                    width:100
                },
                {
                    title:'交接物品',
                    dataIndex:'handoverItems',
                    key:'handoverItems',
                    width:100
                },
                {
                    title:'离职日期',
                    dataIndex:'leaveDate',
                    key:'leaveDate',
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
                            <a onClick={()=>this.edit(record)}>编辑</a>
                        </Space>
                    )
                }
            ]
        }
    }
    edit=(value)=>{
        this.setState({
            leaveTag:false,
            id:value.id,
            employeeName:value.employeeName
        })
        formRef.current.setFieldsValue({
            employeeId:value.employeeId.toString(),
            leaveReason:value.leaveReason ? value.leaveReason.toString() : '',
            handoverPerson:value.handoverPerson,
            handoverItems:value.handoverItems,
            leaveDate:value.leaveDate ? moment(value.leaveDate) : ''

        })
    }
    onFinish=async (value)=>{
        this.setState({
            tag:true
        })
        // value.leaveDate = moment(value.leaveDate.toDate()).format('YYYY-MM-DD')
        value.leaveDate = value.leaveDate.format('YYYY-MM-DD')
        await getDatas('/employee/modifyLeaveEmployee',Object.assign(value,{id:this.state.id,employeeId:this.state.employeeId}))
            .then(res=>{
                console.log(value)
                this.setState({
                    tag:false,
                    leaveTag:true
                })
                this.get({},this.state.current)
            })
    }
    //获取离职人员信息
    get= async (value,page)=>{
        this.setState({
            tag:true
        })
        let values = Object.assign(value,{pageNo:page})
        await getDatas('/employee/queryLeaveEmployeeList',values)
            .then(res=>{
                console.log('查询离职人员信息',res)
                this.setState({
                    dataSource:res.data.results,
                    totalRecord:res.data.totalRecord,
                    tag:false,
                    current:1
                })
            })
    }
    fn =(item)=>{
        this.setState({
            current:item
        })
        this.get({},item)
    }
    componentDidMount=async()=> {
        this.get({},1)
        // await getDatas('/record/queryAllByPros',this.state.parameters)
        //     .then(res=>{
        //         dataAll = res.data
        //     })
    }
    render() {

        return (
            <div className="edit_out">
                <Find Tag = 'false' Found = {(e)=>{this.get(e,1)}} Adds = {(e) => {this.add_edit(e)}}/>
                <Table scroll={{x: 1500}} dataSource={this.state.dataSource} columns={this.state.columns} loading={this.state.tag} pagination={{pageSize:10,current:this.state.current, defaultCurrent:1 ,total:this.state.totalRecord,onChange:this.fn}}/>
                <div className={"leave"+ " " + (this.state.leaveTag ? "none" : '')}>
                    <div className='edit'>
                        {/*<div className="title-edit">离职办理</div>*/}
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
                            onFinish={this.onFinish}
                        >
                        <Row>
                            <Col span={24}>
                                <Form.Item
                                    label="员工姓名"
                                    name="employeeId"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择员工!',
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
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="离职原因"
                                    name="leaveReason"
                                    rules={[
                                        {
                                            required: true,
                                            message: '离职原因',
                                        },
                                    ]}
                                >
                                    <Select style={{ width: 120 }} onChange={this.handleChange}>
                                        <Option value="1">合同到期</Option>
                                        <Option value="2">主动申请</Option>
                                        <Option value="3">辞退</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="离职日期"
                                    name="leaveDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: '离职日期',
                                        },
                                    ]}
                                >
                                    <DatePicker showToday  />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="主要交接人"
                                    name="handoverPerson"
                                    rules={[
                                        {
                                            required: true,
                                            message: '主要交接人!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="交接物品"
                                    name="handoverItems"
                                    rules={[
                                        {
                                            required: true,
                                            message: '交接物品!',
                                        },
                                    ]}
                                >
                                    <TextArea allowClear/>
                                </Form.Item>
                            </Col>
                            <Col span="24">
                                <Row justify="center">
                                    <Col span={8} offset={3}>
                                        <Form.Item >
                                            <Button size="large" block type="primary" htmlType="submit">
                                                确认
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} >
                                        <Form.Item >
                                            <Button size="large" block onClick={()=>this.setState({leaveTag:true})} type="primary">
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

export default Resign