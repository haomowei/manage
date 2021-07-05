import React from 'react'
import moment from 'moment';
import {get} from '../../api/index-网络拦截'
import { Table,Form, Input, Button,Space, Popconfirm, Row, Col, Select,DatePicker} from 'antd';
import '../css/style.less'
import {getDatas} from '../../api'
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';//设置中文
const {Option} = Select

const formRef = React.createRef();
const datas = [
    {
        name: '开始时间',
        value:'startDate'
    },
    {
        name: '结束时间',
        value:'endDate'
    }
]
let dataAll, productList, productList2,newDataList
class Train extends React.Component {
    constructor(props) {
        super(props)
        console.log('props', props)
        this.state = {
            tag:false,//表单是否处于加载状态
            classTag:true,//是否显示编辑页面
            totalRecord:1,//数据总共条数
            startDate1:'',//根据时间查询起始时间
            endDate1:'',//根据时间查询结束时间
            current:1,//当前页
            addEdit:'',//编辑添加状态
            dataSource:[//表单数据
            ],
            columns:[//表头
                {
                    title: '培训主题',
                    dataIndex: 'trainTheme',
                    key: 'trainTheme',
                    width:100,
                    fixed:'left',
                    editable:true
                },
                {
                    title: '培训内容',
                    dataIndex: 'trainContent',
                    key: 'trainContent',
                    width:200,
                    fixed:'left'
                },
                {
                    title: '培训地点',
                    dataIndex: 'trainAddr',
                    key: 'trainAddr',
                    width:100
                },
                {
                    title:'讲师姓名',
                    dataIndex:'lecturerName',
                    key:'lecturerName',
                    width:80
                },
                {
                    title:'参加人数',
                    dataIndex:'attendNum',
                    key:'attendNum',
                    width:80
                },
                {
                    title:'开始时间',
                    dataIndex:'startDate',
                    key:'startDate',
                    width:100
                },
                {
                    title:'结束时间',
                    dataIndex:'endDate',
                    key:'endDate',
                    width:100
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
    // ----------------删除-------------------
    handleDelete = async (id) => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter((item) => item.id !== id),
        });
        await getDatas('/train/delTrain',{id})
            .then(res=>{
                this.onFinish3("",this.state.current)
                console.log('删除',res)
                this.setState({
                    tag:false
                })
            })
    };
    //-----------------------新增/编辑---弹框-----------------
    add_edit =async(e,value)=>{
        this.setState({
            classTag:false,
            addEdit: e
        })
        if(e == 'add'){
            formRef.current.setFieldsValue({
                trainTheme:'',
                trainContent:'',
                trainAddr:'',
                lecturerName:'',
                attendNum:'',
                startDate:'',
                endDate:''
            })

        }else{
            this.setState({
                id:value.id
            })
            formRef.current.setFieldsValue({
                trainTheme:value.trainTheme,
                trainContent:value.trainContent,
                trainAddr:value.trainAddr,
                lecturerName:value.lecturerName,
                attendNum:value.attendNum,
                startDate:value.startDate ? moment(value.startDate) : moment('2020-12-12'),
                endDate:value.endDate ? moment(value.endDate) : moment('2020-12-12')
            })
        }
    }
    //--------------新增-编辑-----------------------
    onFinish = async (value,type) =>{
        this.setState({
            tag:true
        })
        console.log(value)
        value.startDate = value.startDate.format('YYYY-MM-DD')
        value.endDate = value.endDate.format('YYYY-MM-DD')
        if(type=='add'){
            await getDatas('/train/addTrain',value)
                .then(res=>{
                    this.onFinish3("",this.state.current)
                    console.log('新增',res)
                    this.setState({
                        tag:false
                    })
                })
        }else{
            await getDatas('/train/modifyTrain',Object.assign(value,{id:this.state.id}))
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
    //-------------查询-----------------------------
    onFinish3 = async (value,page)=>{
        this.setState({
            tag:true
        })
        let values = Object.assign(value,{pageNo:page})
        console.log(value)
        await getDatas('/train/queryList',values)
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
    // //--------------根据时间查询-----------------------
    onFinish4 = async (value)=>{
        console.log(value)
        value.startDate = value.startDate ? value.startDate.format('YYYY-MM-DD') :''
        value.endDate = value.endDate ? value.endDate.format('YYYY-MM-DD') :''
        await getDatas('/train/queryList',value)
            .then(res=>{
                console.log('时间查询',res)
                this.setState({
                    dataSource:res.data.results,
                    totalRecord:res.data.totalRecord,
                    tag:false,
                    current:1
                })
            })
    }
    componentDidMount=async()=> {
        this.onFinish3({},1)

    }
    render() {

        return (
            <div className="edit_out">
                <Form
                    className="a"
                    onFinish={this.onFinish4}
                    labelCol={{span: 8}}>
                    <Row gutter={22} align="bottom">
                        <Col span="10">
                            <Row gutter={22}>
                                {
                                    datas.map(item => {
                                        return (
                                            <Col span={11} key={item.name}>
                                                <Form.Item
                                                    name={item.value}
                                                    label={item.name}
                                                   >
                                                    <DatePicker placeholder={item.name} showToday />
                                                </Form.Item>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Col>
                        <Col span="1.3">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="p_submit">
                                    查询
                                </Button>
                            </Form.Item>
                        </Col>
                        <Col span="1">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    onClick={()=>this.add_edit('add')}
                                    className="p_add">
                                    新增
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table scroll={{x: 1500}} dataSource={this.state.dataSource} columns={this.state.columns} loading={this.state.tag} pagination={{pageSize:10,current:this.state.current, defaultCurrent:1 ,total:this.state.totalRecord,onChange:this.fn}}/>
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
                                        label="培训主题"
                                        name="trainTheme"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入培训主题!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="培训内容"
                                        name="trainContent"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入培训内容!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="培训地点"
                                        name="trainAddr"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入培训地点!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="讲师姓名"
                                        name="lecturerName"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入讲师姓名!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="参加人数"
                                        name="attendNum"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入参加人数!',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="开始时间"
                                        name="startDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入开始时间',
                                            },
                                        ]}
                                    >
                                        <DatePicker showToday  />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        label="截止时间"
                                        name="endDate"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入截止时间',
                                            },
                                        ]}
                                    >
                                        <DatePicker showToday />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Row justify="center">
                                        <Col  span={8} offset={3} >
                                            <Form.Item >
                                                <Button  size="large" block  type="primary" htmlType="submit">
                                                    确认
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8} >
                                            <Form.Item >
                                                <Button  size="large" block  onClick={()=>this.setState({classTag:true})}  type="primary">
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
export default Train