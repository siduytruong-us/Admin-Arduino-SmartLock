import {
    Form,
    Input,
    Select,
    Button,
    DatePicker, message,PageHeader, Divider
  } from 'antd';
import React, {Component} from 'react';
import firebase from "../config/firebaseConfig"
import axios from '../config/axiosConfig';
import moment from 'moment'
const userFirestore = firebase.firestore().collection("user")
const { Option } = Select;
const config = {
 
};


class Signup extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      user:{
        name:"null",
        phone:"null",
        cmnd:"null",
        date_exp: moment(new Date()),
        phone:"null",
      },
      loading:false,
    };
    this.fetchUserFromApi = this.fetchUserFromApi.bind(this)
  }

  componentWillMount() { 
    this.fetchUserFromApi()
  }

  fetchUserFromApi() { 
    var {cmnd} = this.props.match.params
    if ( cmnd !== "blank"){
      userFirestore.doc(cmnd.toString()).get()
      .then( doc => {
          const user = doc.data()
          console.log(user);
          user.phone = user.phone.substr(3, user.phone.length);
          this.setState({user,})
          
      })
      .catch( err => { 
        if ( err.response) {
          err = err.response.data
          message.error(err.message.toString(),  1.5)
        }
        return message.error(err.toString(),1.5)
      })
    }
    else 
      message.error("Param không hợp lệ!")
  }
  


  handleEditUser () {
    this.props.form.validateFieldsAndScroll((err, user ) => {
      if (!err) {
        var {cmnd} = this.props.match.params

        user.phone = user.prefix + user.phone
        user.date_exp = user.date_exp.valueOf()
        user.cmnd = cmnd
        this.setState({loading:true})
        console.log(user);
        axios.post("/user/register", user).then( res => { 
            console.log(res.data.data);
            message.success("Cập nhật thành công!",1.5)
        })
        .catch(err => { 
          console.log(err);
        })
        .finally( () => { 
          this.setState({loading:false})
        })
      }
      else 
        message("Xảy ra lỗi không xác định",1.5)
    });
  };

  handleSendMail() {
    this.props.form.validateFieldsAndScroll((err, user ) => {
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {loading} = this.state.user

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+84',
    })(
      <Select style={{ width: 70 }}>
        <Option value="+84">+84</Option>
      </Select>,
    );

    return (
      <div className = "container" style = {{marginLeft:"250px"}}>     
         <PageHeader onBack={() => this.props.history.replace("/")} title="Chỉnh sửa thông tin"/>,  
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item
              label="Họ và tên">
              {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Tên Khách hàng', whitespace: true }],
              initialValue: this.state.user.name
              })(<Input />)}
              </Form.Item>
          
              <Form.Item label="E-mail">
                  {getFieldDecorator('email', {
                  rules: [
                      {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                      },
                      {
                      required: true,
                      message: 'Please input your E-mail!',
                      },
                      
                  ],
                  initialValue: this.state.user.email,
                  })(<Input />)}
              </Form.Item>
              
              <Form.Item label="Chứng minh nhân dân:">
                  <b>{this.state.user.cmnd}</b>
              </Form.Item>
              

              <Form.Item label="Phone Number">
                  {getFieldDecorator('phone', {
                  rules: [{ required: true, message: 'Vui lòng nhập số điện thoại' }],
                  initialValue: this.state.user.phone,
                  })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
              </Form.Item>
              
              <Form.Item label="Ngày hết hạn">
                {getFieldDecorator('date_exp', {
                  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
                  initialValue: moment(this.state.user.date_exp)
                  })(
                <DatePicker showTime  format = {"DD-MM-YYYY HH:mm"}/>,
                )}
              </Form.Item>
              
              <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" loading = {loading} onClick = {this.handleEditUser.bind(this)}>
                    Edit
                  </Button>
                  
                  <Divider type = "vertical"/>

                  <Button onClick = {this.handleSendMail.bind(this)}>
                    Send mail
                  </Button>
              </Form.Item>
              
          </Form>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(Signup);

export default WrappedRegistrationForm;