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
class Contract extends React.Component {
    constructor(props) {
        super(props)
        console.log('props', props)
        this.state = {
            tag:false,//表单是否处于加载状态
            classTag:true,//是否显示编辑页面
            totalRecord:1,//数据总共条数
            current:1,//当前页
            listsData:[],//员工列表
            addEdit:'',//编辑添加状态
            employeeName:'',
            employeeNo:'',
            endTag:true,//是否显示截止日期
            choiceTag:true,//是否显示选择用户页
            dataSource:[//表单数据

            ],
            columns:[//表头
                {
                    title: '员工编号',
                    dataIndex: 'employeeNo',
                    key: 'employeeNo',
                    width:100
                },
                {
                    title: '姓名',
                    dataIndex: 'employeeName',
                    key: 'employeeName',
                    width:100
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
                    title: '合同编号',
                    dataIndex: 'contractNo',
                    key: 'contractNo',
                    width:150,
                    fixed:'left',
                    editable:true
                },
                {
                    title:'合同类型',
                    dataIndex:'contractType',
                    key:'contractType',
                    width:150,
                    render:(text)=>{
                        if(text ==1 ){
                            return <span>有固定的期限</span>
                        }else if(text == 2){
                            return <span>无固定期限</span>
                        }
                    }
                },
                {
                    title:'起始日期',
                    dataIndex:'startDate',
                    key:'startDate',
                    width:150
                },
                {
                    title:'终止日期',
                    dataIndex:'endDate',
                    key:'endDate',
                    width:150
                },
                {
                    title:'合同状态',
                    dataIndex:'status',
                    key:'status',
                    width:100,
                    render:(text)=>{
                        if(text == 1){
                            return <span>存续期</span>
                        }else if (text == 2){
                            return <span>已过期</span>
                        }else if(text == 3){
                           return <span>已终止</span>
                        }
                    }
                },
                {
                    title:'创建时间',
                    dataIndex:'createtime',
                    key:'createtime',
                    width:150
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
    //--------------------------翻页---------------------
    fn =(item)=>{
        this.setState({
            current:item
        })
        this.onFinish3({},item)
    }
    // ----------------删除-------------------
    handleDelete = async (id) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.id !== id),
        });
        await getDatas('/contract/delContract',{id})
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
        console.log(value)
        if(value.startDate){
            value.startDate = value.startDate.format('YYYY-MM-DD')
        }
        if(value.endDate){
            value.endDate = value.endDate.format('YYYY-MM-DD')
        }

        if(type=='add'){
            await getDatas('/contract/addContract',value)
                .then(res=>{
                    this.onFinish3("",this.state.current)
                    console.log('新增',res)
                    this.setState({
                        tag:false
                    })
                })
        }else{
            await getDatas('/contract/modifyContract',Object.assign(value,{id:this.state.id}))
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
    //--------------------------选择人员-----------------------------------
    contractTypeChange = (e)=>{
        if(e == 2 ) {
            this.setState({
                endTag:false
            })
            formRef.current.setFieldsValue({
                endDate:'',
            })
        }else{
            this.setState({
                endTag:true
            })
            formRef.current.setFieldsValue({
                endDate:'',
            })
        }
    }
    employeeId = (e)=>{

    }
    handleChange = (value)=>{
        console.log(value)
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
        await getDatas('/contract/queryList',values)
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
            employeeNo:''
        })
        if(e == 'add'){
            formRef.current.setFieldsValue({
                employeeId:'',
                contractNo:'',
                contractType:'',
                startDate:'',
                endDate:'',
                status:'',
                endTag:true
            })

        }else{
            this.setState({
                id:value.id,
                employeeName:value.employeeName,
                employeeNo:value.employeeNo,
                endTag: value.contractType == 1 ? true : false
            })
            formRef.current.setFieldsValue({
                employeeId:value.employeeId.toString(),
                contractNo:value.contractNo,
                contractType:value.contractType.toString(),
                status:value.status.toString(),
                startDate:value.startDate ? moment(value.startDate) : moment('2020-12-12'),
                endDate:value.endDate ? moment(value.endDate) : moment('2020-12-12')
            })
        }
    }
    //获取员工列表
    get = async ()=>{
        await getDatas('/employee/queryList')
            .then(res=>{
                this.setState({
                    listsData:res.data.results
                })
            })
    }
    choice = ()=>{
        this.setState({
            choiceTag: false
        })
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
                        >
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        label="员工姓名"
                                        name="employeeId"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入员工编号!',
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
                                                    {/*return <Option value={value.id}>{value.employeeNo}&nbsp;&nbsp;&nbsp;{value.employeeName}</Option>*/}
                                                {/*})*/}
                                            {/*}*/}
                                        {/*</Select>*/}
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="合同编号"
                                        name="contractNo"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入合同编号!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="合同类型"
                                        name="contractType"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入合同类型!',
                                            },
                                        ]}
                                    >
                                        <Select  style={{ width: 120 }} onChange={this.contractTypeChange}>
                                            <Option value="1">有固定期限</Option>
                                            <Option value="2">无固定期限</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="起始日期"
                                        name="startDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: '起始日期',
                                            },
                                        ]}
                                    >
                                        <DatePicker showToday  />
                                    </Form.Item>
                                </Col>
                                {
                                    this.state.endTag ? <Col span={24}>
                                        <Form.Item
                                            label="终止日期"
                                            name="endDate"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '终止日期',
                                                },
                                            ]}
                                        >
                                            <DatePicker showToday />
                                        </Form.Item>
                                    </Col> : ''
                                }

                                <Col span={24}>
                                    <Form.Item
                                        label="合同状态"
                                        name="status"
                                        rules={[
                                            {
                                                required: true,
                                                message: '合同状态',
                                            },
                                        ]}
                                    >
                                        <Select  style={{ width: 120 }} onChange={this.statusChange}>
                                            <Option value="1">存续期</Option>
                                            <Option value="2">已过期</Option>
                                            <Option value="3">已终止</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span="24">
                                    <Row justify="center">
                                        <Col  span={8} offset={3}>
                                            <Form.Item >
                                                <Button size="large" block  type="primary" htmlType="submit">
                                                    确认
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} >
                                            <Form.Item >
                                                <Button size="large" block  onClick={()=>this.setState({classTag:true})}  type="primary">
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
export default Contract