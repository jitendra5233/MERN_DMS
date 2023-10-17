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

import { handleLogin } from "../../Redux/Actions";
import { useDispatch } from "react-redux";

const ManageAccount = () => {
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const [emp, setEmp] = useState([]);
  const [dummyState, setDummyState] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [activeId, setActiveId] = useState("");

  const openNotificationWithIcon = (type) => {
    if (type === "error") {
      api[type]({
        message: "Server Error",
        description: "",
      });
    } else {
      api[type]({
        message: "Successful",
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
    getEmployee();
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
      render: (img) => {
        return (
          <div style={{ textAlign: "center" }}>
            <img
              src={img}
              style={{ height: "35px", width: "35px", borderRadius: "100%" }}
            />
          </div>
        );
      },
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

  const getEmployee = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getAllEmployee")
      .then((res) => {
        setEmp(res.data);
        getUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = (id) => {
    setActiveId(id);
    tableData.map((x) => {
      if (x.key == id) {
        console.log(x);
        form.setFieldsValue({
          employee_id: x.employee_id,
          employee_type: x.employee_type,
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
        getEmployee();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUsers = (p_data = []) => {
    axios
      .get(process.env.REACT_APP_API_URL + "/usres")
      .then((result) => {
        let data = result.data;

        let newData = [];

        p_data.map((x) => {
          data.map((y) => {
            if (x._id == y.employee_id) {
              y.f_name = x.f_name;
              y.l_name = x.l_name;
              y.emp_code = x.emp_code;
              y.jobtitle = x.designation;
              newData.push({
                employee_id: y.employee_id,
                employee_type: y.employee_type,
                key: y._id,
                name: `${y.f_name} ${y.l_name}`,
                img: x.photo == undefined ? "./user1.png" : x.photo,
                empcode: y.emp_code,
                jobtitle: y.jobtitle,
                assigningdate: new Date(y.createdAt).toLocaleDateString(),
                emailid: y.email,
                password: y.password,
                edit: y._id,
                f_name: y.f_name,
                l_name: y.l_name,
              });
            }
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
      axios
        .post(process.env.REACT_APP_API_URL + "/create_User", values)
        .then((res) => {
          console.log(res.data);
          setLoading(false);
          if (res.data.length === 0) {
            openNotificationWithIcon("error");
          } else {
            openNotificationWithIcon("success");
            getEmployee();
            setIsModalOpen(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
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
            getEmployee();
            setIsModalOpen(false);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
    //   if (activeId == "") {
    //     setLoading(true);
    //     let data = new FormData();
    //     data.append("email", values.email);
    //     data.append("emp_code", values.emp_code);
    //     data.append("f_name", values.f_name);
    //     data.append("l_name", values.l_name);
    //     data.append("image", "image");
    //     data.append("job_title", values.job_title);
    //     data.append("password", values.password);
    //     axios
    //       .post(process.env.REACT_APP_API_URL + "/create_User", values)
    //       .then((res) => {
    //         console.log(res.data);
    //         // setLoading(false);
    //         // if (res.data.length === 0) {
    //         //   openNotificationWithIcon("error");
    //         // } else {
    //         //   openNotificationWithIcon("success");
    //         //   dispatch(handleLogin({ name: "harman" }));
    //         //   getUsers();
    //         //   form.resetFields();
    //         //   setIsModalOpen(false);
    //         // }
    //       })
    //       .catch((err) => {
    //         setLoading(false);
    //         console.log(err);
    //       });
    //   } else {
    //     console.log(values);
    //     values.id = activeId;
    //     axios
    //       .post(process.env.REACT_APP_API_URL + "/update_User", values)
    //       .then((res) => {
    //         setLoading(false);
    //         if (res.data.length === 0) {
    //           openNotificationWithIcon("error");
    //         } else {
    //           openNotificationWithIcon("success");
    //           dispatch(handleLogin({ name: "harman" }));
    //           getUsers();
    //           setIsModalOpen(false);
    //         }
    //       })
    //       .catch((err) => {
    //         setLoading(false);
    //         console.log(err);
    //       });
    //   }
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
                      <Col span={12}>
                        <Form.Item
                          label="Employee"
                          name="employee_id"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Employee!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Employee"
                            allowClear
                            className="myAntIptSelect2"
                          >
                            {emp.map((x, i) => {
                              return (
                                <Option key={i} value={x._id}>
                                  {x.f_name} {x.l_name}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Role"
                          name="employee_type"
                          rules={[
                            {
                              required: true,
                              message: "Please input your Employee Role!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Employee Role"
                            allowClear
                            className="myAntIptSelect2"
                          >
                            <Option value="hr">HR</Option>
                            <Option value="emp">Employee</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Login Email"
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

export default ManageAccount;
