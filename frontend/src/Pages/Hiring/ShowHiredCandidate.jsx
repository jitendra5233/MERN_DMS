import {
  Button,
  Table,
  Modal,
  Typography,
  Row,
  Col,
  Avatar,
  Space,
  Form,
  Input,
  Select,
  notification,
  Spin,
  Upload,
  Dropdown,
  message,
} from "antd";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  SearchOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  LogoutOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { handleLogin } from "../../Redux/Actions";
import { useDispatch } from "react-redux";

const ShowHiredCandidate = () => {
  const [tableData, setTableData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [totalNoOfEmp, setTotalNoOfEmp] = useState();
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [activeId, setActiveId] = useState("");

  const openNotificationWithIcon = (type) => {
    if (type === "error") {
      api[type]({
        message: "Invalid Email or Password",
        description: "",
      });
    } else {
      api[type]({
        message: "Login Successful",
        description: "",
      });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setActiveId("");
  };

  useEffect(() => {
    getUsers();
    getTotalNoOfEmp();
    // getRoles();
  }, []);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };


  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const items = [
    {
      key: "1",
      label: <Link onClick={() => SaveAsEmployee()}>Save as Employee</Link>,
    },
    {
      key: "2",
      label: <Link to={"/candidate-details/" + activeId}>Update Details</Link>,
    },
    {
      key: "3",
      label: (
        <Link onClick={() => handleDelete()} style={{ color: "red" }}>
          Delete
        </Link>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps('name'),
    },
    {
      title: "Email",
      dataIndex: "emailid",
      key: "emailid",
      ...getColumnSearchProps('emailid'),
    },
    {
      title: "Last Salary",
      dataIndex: "last_salary",
      key: "last_salary",
      ...getColumnSearchProps('last_salary'),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      ...getColumnSearchProps('experience'),
    },
    {
      title: "Expected Salary",
      dataIndex: "expected_salary",
      key: "expected_salary",
      ...getColumnSearchProps('expected_salary'),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ...getColumnSearchProps('location'),
    },
    {
      title: "CV",
      dataIndex: "cv",
      key: "cv",
      render: ({ name, link }) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <FileTextOutlined /> {name}'s cv
            </div>
            <div>
              <a href={link} target="_blank">
                <DownloadOutlined style={{ fontSize: "15px" }} />
              </a>
            </div>
          </div>
        );
      },
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      render: (id) => {
        return (
          <div style={{ cursor: "pointer", textAlign: "center" }}>
            <Dropdown
              menu={{ items }}
              placement="bottomLeft"
              arrow
              trigger={["click"]}
              onClick={() => setActiveId(id)}
            >
              <EllipsisOutlined style={{ fontSize: "18px" }} />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const handleEdit = (id) => {
    setActiveId(id);
    tableData.map((x) => {
      if (x.key == id) {
        form.setFieldsValue({
          f_name: x.f_name,
          l_name: x.l_name,
          emp_code: x.empcode,
          title: x.jobtitle,
          email: x.emailid,
          password: x.password,
          c_password: x.password,
        });
      }
    });
    showModal();
    // console.log(tableData);
  };

  const getTotalNoOfEmp = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getTotalNumberOfEmp")
      .then((res) => {
        let data = res.data + 1;
        setTotalNoOfEmp(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const SaveAsEmployee = () => {
    employees.map((x) => {
      if (x._id == activeId) {
        let dataObj = {
          ref_id: activeId,
          f_name: x.f_name,
          l_name: x.l_name,
          department: x.ref_id,
          designation: x.profile_id,
          emp_code: totalNoOfEmp,
          old_emp: false,
        };

        axios
          .post(process.env.REACT_APP_API_URL + "/addNewEmployee", dataObj)
          .then((res) => {
            message.success("Saved");
            getTotalNoOfEmp();
          })
          .catch((err) => {
            setLoading(false);
            message.error(err.response.data.message);
            console.log(err.response.data.message);
          });
      }
    });
  };

  const handleDelete = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/delete_candidate", {
        id: activeId,
      })
      .then((result) => {
        let data = result.data;

        console.log(data);
        getUsers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUsers = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getHiredCandidate")
      .then((result) => {
        let data = result.data;
        setEmployees(data);

        let newData = [];

        data.map((x) => {
          newData.push({
            key: x._id,
            name: `${x.f_name} ${x.l_name}`,
            emailid: x.email,
            last_salary: x.l_salary,
            experience: x.experience,
            expected_salary: x.expected_salary,
            location: x.candidate_location,
            cv: { name: x.f_name, link: x.cv },
            edit: x._id,
            f_name: x.f_name,
            l_name: x.l_name,
          });
        });

        setTableData(newData);
        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let { Title } = Typography;

  const handleSubmit = (values) => {
    // console.log(values);
    /*----- */
    if (activeId == "") {
      setLoading(true);

     let data = new FormData();
    console.log(data,'datadaaaaaa')
      data.append("email", values.email);
      data.append("emp_code", values.emp_code);
      data.append("f_name", values.f_name);
      data.append("l_name", values.l_name);
      data.append("image", "image");
      data.append("job_title", values.job_title);
      data.append("password", values.password);

      axios
        .post(process.env.REACT_APP_API_URL + "/create_User", values)
        .then((res) => {
          console.log(res.data,"create user respobse");
          // setLoading(false);
          // if (res.data.length === 0) {
          //   openNotificationWithIcon("error");
          // } else {
          //   openNotificationWithIcon("success");
          //   dispatch(handleLogin({ name: "harman" }));
          //   getUsers();
          //   form.resetFields();
          //   setIsModalOpen(false);
          // }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      console.log(values);
      // values.id = activeId;
      // axios
      //   .post(process.env.REACT_APP_API_URL + "/update_User", values)
      //   .then((res) => {
      // console.log(res, "update result");
      //     setLoading(false);
      //     if (res.data.length === 0) {
      //       openNotificationWithIcon("error");
      //     } else {
      //       openNotificationWithIcon("success");
      //       dispatch(handleLogin({ name: "harman" }));
      //       getUsers();
      //       setIsModalOpen(false);
      //     }
      //   })
      //   .catch((err) => {
      //     setLoading(false);
      //     console.log(err);
      //   });
    }

    /*----- */
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  let { Option } = Select;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span className="pageTitle">New Hired Candidates</span>
        </div>
        <div>
          {/* <Button type="primary" onClick={showModal}>
            Add Hired Candidate +
          </Button> */}
        </div>

        <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
          <Spin spinning={loading}>
            {contextHolder}
            <div style={{ padding: "30px" }}>
              <Row>
                <Col span={24} style={{ marginBottom: "30px" }}>
                  <span className="popupTitle">Employee Account</span>
                </Col>
                <Col span={24}>
                  <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={handleSubmit}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Row gutter={24}>
                      <Col span={24} style={{ marginBottom: "20px" }}>
                        <Form.Item
                          label="Upload"
                          valuePropName="fileList"
                          getValueFromEvent={normFile}
                          name="image"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Department Image",
                            },
                          ]}
                        >
                          <Upload listType="picture-card" maxCount={1}>
                            <div>
                              <PlusOutlined />
                              <div
                                style={{
                                  marginTop: 8,
                                }}
                              >
                                Upload
                              </div>
                            </div>
                          </Upload>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="First name"
                          name="f_name"
                          rules={[
                            {
                              required: true,
                              message: "Please input your First Name",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            className="myAntIpt2"
                            placeholder="Enter your First Name"
                            size="small"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Last Name"
                          name="l_name"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Last Name",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            className="myAntIpt2"
                            placeholder="Enter your Last Name"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Employee code"
                          name="emp_code"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Employee code",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            className="myAntIpt2"
                            placeholder="Enter your Employee code"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Job Title"
                          name="job_title"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Title!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Job"
                            allowClear
                            className="myAntIptSelect2"
                          >
                            <Option value="1">Software Enginner</Option>
                            <Option value="2">Software Developer</Option>
                            <Option value="3">QA Engineer</Option>
                            <Option value="4">Frontend Developer</Option>
                            <Option value="5">Backend Developer</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Email ID"
                          name="email"
                          rules={[
                            {
                              type: "email",
                              message: "The input is not valid E-mail!",
                            },
                            {
                              required: true,
                              message: "Please input your E-mail!",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            className="myAntIpt2"
                            placeholder="Enter your Title"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Create Password"
                          name="password"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Create Password",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input.Password
                            className="myAntIpt2"
                            placeholder="Enter your Create Password"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Confirm password"
                          name="c_password"
                          dependencies={["password"]}
                          hasFeedback
                          rules={[
                            {
                              required: true,
                              message: "Please confirm your password!",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error("Password do not match!")
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password
                            className="myAntIpt2"
                            placeholder="Enter your Confirm password"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </div>
          </Spin>
        </Modal>
      </div>

      <div style={{ marginTop: "25px" }}>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default ShowHiredCandidate;
