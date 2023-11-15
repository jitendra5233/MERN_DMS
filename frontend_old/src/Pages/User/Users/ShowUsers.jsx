import {
  Button,
  Table,
  Modal,
  Typography,
  Row,
  Col,
  Avatar,
  Form,
  Input,
  Select,
  notification,
  Spin,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  LogoutOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { handleLogin } from "../../../Redux/Actions";
import { useDispatch } from "react-redux";

const ShowUsers = () => {
  const [tableData, setTableData] = useState([]);
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
    getRoles();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Profile Picture",
      dataIndex: "img",
      key: "img",
    },
    {
      title: "Emp Code",
      dataIndex: "empcode",
      key: "empcode",
    },
    {
      title: "Job Title",
      dataIndex: "jobtitle",
      key: "jobtitle",
    },
    {
      title: "Assigning Date",
      dataIndex: "assigningdate",
      key: "assigningdate",
    },
    {
      title: "Email",
      dataIndex: "emailid",
      key: "emailid",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      render: (id) => {
        return (
          <div>
            <span style={{ marginRight: "10px", cursor: "pointer" }}>
              <EditOutlined
                style={{ cursor: "pointer" }}
                onClick={() => handleEdit(id)}
              />
            </span>
            <span>
              <DeleteOutlined
                style={{ cursor: "pointer" }}
                onClick={() => handleDelete(id)}
              />
            </span>
          </div>
        );
      },
    },
  ];

  const getRoles = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getJobProfiles")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
  };

  const handleDelete = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/delete_user", { id })
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
      .get(process.env.REACT_APP_API_URL + "/usres")
      .then((result) => {
        let data = result.data;

        let newData = [];

        data.map((x) => {
          // console.log(x);
          newData.push({
            key: x._id,
            name: `${x.f_name} ${x.l_name}`,
            img: "ysdg8e7.jpg",
            empcode: x.emp_code,
            jobtitle: x.job_title,
            assigningdate: new Date(x.createdAt).toLocaleDateString(),
            emailid: x.email,
            password: x.password,
            edit: x._id,
            f_name: x.f_name,
            l_name: x.l_name,
          });
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let { Title } = Typography;

  const handleSubmit = (values) => {
    if (activeId == "") {
      setLoading(true);

      let data = new FormData();
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
          console.log(res.data);
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
      values.id = activeId;
      axios
        .post(process.env.REACT_APP_API_URL + "/update_User", values)
        .then((res) => {
          setLoading(false);
          if (res.data.length === 0) {
            openNotificationWithIcon("error");
          } else {
            openNotificationWithIcon("success");
            dispatch(handleLogin({ name: "harman" }));
            getUsers();
            setIsModalOpen(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
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
          <span className="pageTitle">Manage all accounts here</span>
        </div>
        <div>
          <Button type="primary" onClick={showModal}>
            Employee Account +
          </Button>
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
                        {/* <Avatar
                          size={50}
                          src={<img src="./icon/userImg.png" alt="avatar" />}
                          style={{ marginRight: "  15px" }}
                        />
                        <Button>
                          Upload <UploadOutlined />
                        </Button> */}
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

export default ShowUsers;
