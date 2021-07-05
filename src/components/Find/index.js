import React from 'react'
import {Table, Button, Space, Form, Col, Row, Input} from 'antd'
import {getDatas} from '../../api'
const datas = [
    {
        name: '员工编号',
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
class Find extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    //查询
    onFinish = (e)=>{
        this.props.Found(e)
    }
    //新增
    add_edit = (e)=>{
        this.props.Adds(e)
    }
    render() {
        return(
            <Form
                className="a"
                onFinish={(e)=>this.onFinish(e,1)}
                labelCol={{span: 8}}>
                <Row gutter={22} align="bottom">
                    <Col span="10">
                        <Row >
                            {
                                datas.map(item => {
                                    return (
                                        <Col span={11} key={item.name}>
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
                    {
                        this.props.Tag == 'true' ?( <Col span="1">
                            <Form.Item>
                                <Button
                                    type="primary"
                                    onClick={()=>this.add_edit('add')}
                                    className="p_add">
                                    新增
                                </Button>
                            </Form.Item>
                        </Col> ): ''
                    }

                </Row>
            </Form>
        )
    }
}
export default Find