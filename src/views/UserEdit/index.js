import React from 'react'
import {Form, Button, Input, Radio, message, Row, Col, Card} from 'antd'
import {ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
import {getDatas} from '../../api'

class UserEdit extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props)
        this.state={
            userName:''
        }
    }

    onFinish = async (e) => {
        console.log(e)
        await getDatas('/sysUser/modifyUser', {
            id: this.props.match.params['id'],
            ...e
        })
            .then(res => {
                console.log(res)
                console.log('提交', this.props)
                if (res.code === 0) {
                    this.props.history.push('/insuman/user')
                } else {
                    message.info(res.msg);
                }

            })
            .catch(err => {

            })
    }

    async componentDidMount() {
        console.log('组件加载', this.props)
        console.log('this.formRef', this.formRef)
        await getDatas('/sysUser/getUser', {
            id: this.props.match.params['id']
        })
            .then(res => {
                if (res.code === 0) {
                    this.formRef.current.setFieldsValue({
                        username: res.data.username
                    });
                } else {
                    message.info(res.msg)
                }
            })
    }

    render() {
        return (
            <Row>
                <Col span={8} offset={2}>
                    <Card title="修改信息" style={{marginTop: '50px'}}
                          extra={<Button icon={<ArrowRightOutlined/>} onClick={this.props.history.goBack}/>}>
                        <Form
                            ref={this.formRef}
                            name="add"
                            onFinish={(e) => this.onFinish(e)}
                            labelCol={{span: 6}}>

                            <Form.Item
                                name="username"
                                label="用户名" style={{fontSize:'18px'}}
                                rules={
                                    [
                                        {
                                            message: '用户名不能为空',
                                            required: true
                                        }
                                    ]
                                }>

                                <Input disabled/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="密码"
                                rules={
                                    [
                                        {
                                            message: '密码不能为空',
                                            required: true
                                        }
                                    ]
                                }>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button block style={{margin: '0 auto', display: 'block'}} type="primary"
                                        htmlType="submit">保存</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        )
    }
}

export default UserEdit