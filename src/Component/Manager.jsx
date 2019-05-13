import React, {Component} from 'react';
import { Table, Button,message, Icon, Divider, Modal, Input } from 'antd';
import firebase from "../config/firebaseConfig"
import axios from "../config/axiosConfig"
import Highlighter from 'react-highlight-words';
import moment from 'moment'

const userFirestore = firebase.firestore().collection("user")


class Manager extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      selectedUsers: [], // Check here to configure the default column
      loading: false,
      data:[],
      viewUser:null,
      visible: false,
      searchText: '',
    };
    this.handleCancel = this.handleCancel.bind(this)
    this.handleAddUser = this.handleAddUser.bind(this)
    this.fetchDataFromFirestore = this.fetchDataFromFirestore.bind(this)
    this.handleOnclickViewUser = this.handleOnclickViewUser.bind(this)
    this.handleGetQrCodeFromServer = this.handleGetQrCodeFromServer.bind(this)
  }

  
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => { this.searchInput = node; }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  })
  
  componentDidMount() { 
    this.fetchDataFromFirestore()
  }


  fetchDataFromFirestore() { 
    this.setState({loading:true})
    userFirestore.get().then(snap => { 
      var temp  = []
      snap.forEach(doc => {
        temp.push(doc.data())
      })
      this.setState({data:temp})
      
    })
    .catch( err => { 
      message.error(err.toString(),1.5)
    })
    .finally(( ) =>{ 
      this.setState({loading:false})
    })
  }


  handleRefresh = () => {
    this.fetchDataFromFirestore()
  }

  handleAddUser() { 
    this.props.history.replace("/signup")
  }

  handleOnclickViewUser (user) { 
    this.setState({
        visible: true,
        viewUser: user,
    });
    this.handleGetQrCodeFromServer(user)
  }

  handleDeleteSelectedUsers() {
    var {selectedUsers} = this.state
    console.log(selectedUsers);
    axios.post("/user/delete", selectedUsers)
    .then( () => { 
      message.success("Đã xóa!",1.5)
      this.setState({selectedUsers:[]})
    })
    .catch(err => { 
      message.error(err.toString(),1.5)
    })
    .finally(() => { 
      this.fetchDataFromFirestore()
      
    })
  }

  handleGetQrCodeFromServer(user) { 
    axios.post('/qrcode/generator',user,{ responseType: 'arraybuffer' })
    .then(res => {
      const base64 = btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      this.setState({ source: "data:;base64," + base64 });
    });
  }

  handleEditUser(user) { 
    this.props.history.replace("/edit/" + user.cmnd)
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

    
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }

  onSelectChange = (selectedRowKeys, selectedUsers) => {
    this.setState({ selectedUsers });
  }

  render() {
    const { loading, selectedUsers,data,viewUser } = this.state;
    const rowSelection = {
      selectedUsers,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedUsers.length > 0;

    
    const columns = [
      {
      title: 'Tên',
      dataIndex: 'name',
      sorter: (a, b) => a.name > b.name,
      sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'Chứng minh nhân dân',
        dataIndex: 'cmnd',
        ...this.getColumnSearchProps('cmnd'),
      },
      {
      title: 'Ngày hết hạn',
      dataIndex: 'date_exp',
      render: date_exp => moment(parseInt(date_exp)).format("DD/MM/YYYY HH:MM"),
      },
      {
      title: 'Address',
      dataIndex: 'address',
      },
      {
        title: '',
        key: 'action',
        render: (text, user) => (
            <div>
            <span onClick = {() => this.handleEditUser(user)}>
              <Icon type="edit" theme="twoTone"  style={{ fontSize: '20px' }} />
          </span>
            </div>

        ),
    }, 
    ];

    return (
      <div className = "container" style = {{margin:"auto", alignItems:"center"}}>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={this.handleRefresh}
            loading={loading}
          >
            Refresh
          </Button> 
          <Divider type = "vertical"/>
         
         <Button
            onClick = {this.handleAddUser}>
            <Icon type="user-add" />
         </Button>

         <Divider type = "vertical"/>
         
         <Button
            type = "danger"
            onClick = {this.handleDeleteSelectedUsers.bind(this)}>
            <Icon type="delete" theme="filled" />
         </Button>

        </div>
        <Table  rowKey={record => record.cmnd} rowSelection={rowSelection} columns={columns} dataSource={data} loading = {loading}
                onRow={(record, rowIndex) => {
                  return {
                    onDoubleClick: (event) => {
                          this.handleOnclickViewUser(record)
                    },        // click row
                    onMouseEnter: (event) => {},   // mouse enter row
                  }}
                  }/>

        { viewUser?<Modal
                    width = "90%"
                    title={viewUser.name + " - " + viewUser.cmnd}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button type = "danger" key="back" onClick={() => this.handleCancel()}>Close</Button>,
                    ]}>
                        <center><img src = {this.state.source} alt = "qr-code"/></center>
                </Modal> :null}
      </div>
    );
  }
}

export default Manager;
