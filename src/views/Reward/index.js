import React from 'react'
import moment from 'moment';
import {get} from '../../api/index-网络拦截'
import Choice from '../../components/Choice'
import {
    EllipsisOutlined
} from '@ant-design/icons';
import { Table,Form, Input, Button,Space, Popconfirm, Row, Col, DatePicker, Select} from 'antd';
import '../css/style.less'
import {getDatas} from '../../api'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';//设置中文
import Find from '../../components/Find'

const { Option } = Select;
const { TextArea } = Input;
const formRef = React.createRef();

class Reward extends React.Component {
    constructor(props) {
        super(props)
        console.log('props', props)
        this.state = {
            tag:false,//表单是否处于加载状态
            classTag:true,//是否显示编辑页面
            totalRecord:1,//数据总共条数
            choiceTag:true,//是否显示选择用户页
            current:1,//当前页
            employeeName:'',
            addEdit:'',
            listsData:[],//员工列表
            dataSource:[//表单数据
            ],
            columns:[//表头
                {
                    title: '员工编号',
                    dataIndex: 'employeeNo',
                    key: 'employeeNo' ,
                    width:100,
                    editable:true
                },
                {
                    title: '姓名',
                    dataIndex: 'employeeName',
                    key: 'employeeName',
                    width:100,
                },
                {
                    title: '员工状态',
                    dataIndex: 'employeeStatus',
                    key: 'employeeStatus',
                    width:100,
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
                    title:'奖励方式',
                    dataIndex:'rewardType',
                    key:'rewardType',
                    width:100,
                    render:(text)=>{
                        if(text == 1){
                            return <span>现金</span>
                        }else if(text == 2){
                            return <span>证书</span>
                        }else if(text == 3){
                            return <span>福利卡</span>
                        }else{
                            return <span>期权</span>
                        }
                    }
                },
                {
                    title:'奖励额度',
                    dataIndex:'rewardAmount',
                    key:'rewardAmount',
                    width:100
                },
                {
                    title:'奖励事由',
                    dataIndex:'rewardReason',
                    key:'rewardReason',
                    width:100
                },
                {
                    title:'奖励日期',
                    dataIndex:'rewardDate',
                    key:'rewardDate',
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
    handleDelete = async (id) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.id !== id),
        });
        await getDatas('/reward/delReward',{id})
            .then(res=>{
                this.onFinish3("",this.state.current)
                console.log('编辑',res)
                this.setState({
                    tag:false
                })
            })
    };
    //--------------新增-编辑-----------------------
    onFinish = async (value,type) =>{
        this.setState({
            tag:true
        })
        value.rewardDate = value.rewardDate.format('YYYY-MM-DD')
        console.log(value)
        if(type=='add'){
            await getDatas('/reward/addReward',value)
                .then(res=>{
                    this.onFinish3("",this.state.current)
                    console.log('新增',res)
                    this.setState({
                        tag:false
                    })
                })
        }else{
            await getDatas('/reward/modifyReward',Object.assign(value,{id:this.state.id}))
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
    //--------------------------翻页---------------------
    fn =(item)=>{
        this.setState({
            current:item
        })
        this.onFinish3({},item)
    }
    choice = ()=>{
        this.setState({
            choiceTag: false
        })
    }
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
    //-------------查询-----------------------------
    onFinish3 = async (value,page)=>{
        this.setState({
            tag:true
        })
        let values = Object.assign(value,{pageNo:page})
        console.log(value)
        await getDatas('/reward/queryList',values)
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
    //-----------------------新增/编辑--弹框--------------------
    add_edit =async(e,value)=>{
        this.setState({
            classTag:false,
            addEdit: e,
            employeeName:'',
        })
        if(e == 'add'){
            formRef.current.setFieldsValue({
                rewardType:'',
                rewardDate:'',
                rewardAmount:'',
                rewardReason:'',
            })

        }else{
            this.setState({
                id:value.id,
                employeeName:value.employeeName,
            })
            formRef.current.setFieldsValue({
                rewardType:value.rewardType.toString(),
                rewardDate:value.rewardDate ? moment(value.rewardDate) : moment('2020-12-12'),
                employeeId:value.employeeId.toString(),
                rewardAmount:value.rewardAmount,
                rewardReason:value.rewardReason,
            })
        }
    }
    //----------------获取员工列表------------------------
    get = async ()=>{
        await getDatas('/employee/queryList')
            .then(res=>{
                this.setState({
                    listsData:res.data.results
                })
            })
    }
    handleChange=(value)=>{
        console.log(value)
    }
    componentDidMount=async()=> {
        this.onFinish3({},1)
        this.get()
    }
    render() {

        return (
            <div className="edit_out">
                <Find Tag = 'true' Found = {(e)=>{this.onFinish3(e,1)}} Adds = {(e) => {this.add_edit(e)}}/>
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
                            <Row >
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
                                        label="奖励方式"
                                        name="rewardType"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入奖励方式!',
                                            },
                                        ]}
                                    >
                                        <Select  onChange={this.handleChange}>
                                            <Option value="1">现金</Option>
                                            <Option value="2">证书</Option>
                                            <Option value="3">福利卡</Option>
                                            <Option value="4">股权</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="奖励额度"
                                        name="rewardAmount"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入奖励额度!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="奖励时间"
                                        name="rewardDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入奖励时间!',
                                            },
                                        ]}
                                    >
                                        <DatePicker showToday />

                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="奖励事由"
                                        name="rewardReason"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入奖励事由',
                                            },
                                        ]}
                                    >
                                        <TextArea allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Row justify="center">
                                        <Col span={8} offset={3}>
                                            <Form.Item >
                                                <Button  block size="large" type="primary" htmlType="submit">
                                                    确认
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} >
                                            <Form.Item >
                                                <Button  block size="large" onClick={()=>this.setState({classTag:true})}  type="primary">
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
export default Reward