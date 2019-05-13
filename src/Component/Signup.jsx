import {
    Form,
    Input,
    Select,
    Button,
    Calendar ,
    AutoComplete, DatePicker, TimePicker, message,PageHeader
  } from 'antd';
import React, {Component} from 'react';
import moment from "moment"
import axios from '../config/axiosConfig';
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
const config = {
  rules: [{ type: 'object', required: true, message: 'Please select time!' }],
};


class Signup extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      startDate: new Date(),
      loading:false,
    };
    this.handleSelectCalendar = this.handleSelectCalendar.bind(this);
  }
  
  handleSelectCalendar(date) {
    this.setState({
      startDate: date
    });
  } 

  handleAddUser () {
    this.props.form.validateFieldsAndScroll((err, user ) => {
      if (!err) {
        user.phone = user.prefix + user.phone
        user.date_exp = user.date_exp.valueOf()

        this.setState({loading:true})
        console.log(user);
        
        axios.post("/user/register", user).then( res => { 
            
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

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

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

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <div className = "container" style = {{marginLeft:"250px"}}>     
         <PageHeader onBack={() => this.props.history.replace("/")} title="Đăng ký"/>,  
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
              <Form.Item
              label="Họ và tên">
              {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Tên Khách hàng', whitespace: true }],
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
                  })(<Input />)}
              </Form.Item>
              
              <Form.Item label="Chứng minh nhân dân:" >
                  {getFieldDecorator('cmnd', {
                  rules: [{ required: true, message: 'Vui lòng nhập CMND' }],
                  })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
              

              <Form.Item label="Phone Number">
                  {getFieldDecorator('phone', {
                  rules: [{ required: true, message: 'Vui lòng nhập số điện thoại' }],
                  })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
              </Form.Item>
              
              <Form.Item label="Ngày hết hạn">
                {getFieldDecorator('date_exp', config)(
                  <DatePicker showTime format="DD-MM-YYYY HH:mm" />,
                )}
              </Form.Item>
              
              <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" onClick = {this.handleAddUser.bind(this)}>
                  Register
                  </Button>
              </Form.Item>
          </Form>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(Signup);

export default WrappedRegistrationForm;