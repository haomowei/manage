import React from 'react'
import {Table, Button, Space, Form, Col, Row, Input} from 'antd'
import {getDatas} from '../../api'
const datas = [
    {
        name: '编号',
        message: '员工编号输入不正确',
        value:'employeeNo'
    },
    {
        name: '姓名',
        rule: /^((?![\u3000-\u303F])[\u2E80-\uFE4F]|\·)*(?![\u3000-\u303F])[\u2E80-\uFE4F](\·)*$/,
        message: '姓名输入不正确',
        value:'employeeName'
    }
]
class Choice extends React.Component{
    constructor(props){
        super(props)
        this.state={
            listsData:'',
            current:1,
            totalRecord:'',
            // 用户信息
            columns : [
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
                    title: '部门',
                    dataIndex: 'employeeDepartment',
                    key: 'employeeDepartment',
                    width:100
                },
                {
                    title:'操作',
                    dataIndex:'operating',
                    key:'operating',
                    width:100,
                    fixed:'right',
                    render: (_, record) => (
                        <Space size="middle">
                            <a onClick={(e)=>this.select2(e,record)}>选择</a>
                        </Space>
                    )
                }
            ]
        }

    }
    get = async (value,page)=>{
        let values = Object.assign(value,{pageNo:page})
        console.log(value)
        await getDatas('/employee/queryList',values)
            .then(res=>{
                console.log('查询',res)
                this.setState({
                    listsData:res.data.results,
                    totalRecord:res.data.totalRecord
                })
            })
    }
    componentDidMount=async()=> {
        this.get({},1)
    }
    select2 = (value,tag)=>{
        this.props.cancle(tag)
    }
    fn = (item)=>{
        this.setState({
            current:item
        })
        this.get({},item)
    }

    render() {
        return(
            <div className={"choice" + " " +(this.props.choiceTag ? "none" : 'table-transform')}>
                <div className="c-table">
                    <div style={{fontSize:'20px',colo:'#333',padding:'10px'}}></div>
                    <Form
                        className="a"
                        onFinish={(e)=>this.get(e,1)}
                        labelCol={{span: 18}}>
                        <Row >
                            <Col span="24">
                                <Row >
                                    {
                                        datas.map(item => {
                                            return (
                                                <Col span={12} key={item.name}>
                                                    <Form.Item
                                                        name={item.value}
                                                        label={item.name}
                                                        rules={
                                                            [
                                                                {
                                                                    pattern: item.rule,
                                                                    message: item.message
                                                                }
                                                            ]
                                                        }>
                                                        <Input placeholder={item.name}/>
                                                    </Form.Item>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            </Col>
                        </Row>
                        <Row justify="end">
                            <Col span="8">
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="p_submit"
                                        style={{width:'100%'}}>
                                        查询
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Table size="large"  className='table' dataSource={this.state.listsData} columns={this.state.columns} pagination={{pageSize:10,current:this.state.current, defaultCurrent:1 ,total:this.state.totalRecord,onChange:this.fn}}></Table>
                    <div style={{textAlign:'center'}}>
                        <Button style={{width:'80%',marginTop:'30px'}}  size="large" type="primary" onClick={(e)=>this.select2(e,'cancle')}>
                            取消
                        </Button>
                    </div>

                </div>


            </div>
        )
    }
}
export default Choice