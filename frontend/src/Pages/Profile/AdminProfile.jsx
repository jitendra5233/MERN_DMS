import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Modal,
  Typography,
  Row,
  Col,
  Form,
  Input,
  Select,
  message,
  notification,
  Spin,
} from "antd";
import { useParams } from "react-router-dom";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
const { Title } = Typography;
const { confirm } = Modal;
let { Option } = Select;
const AdminProfile = () => {
  let selector = useSelector((state) => state.persistedReducer.user);
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobTitle, setjobTitle] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [department, setDepartment] = useState([]);
  const [empId, setEmpId] = useState([]);
  const openNotificationWithIcon = (type, message) => {
    if (type === "error") {
      notification.error({
        message: "Server error!",
        description: "",
      });
    } else if (type === "warning") {
      notification.warning({
        message,
        description: "",
      });
    } else {
      notification[type]({
        message,
        description: "",
      });
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setEmpId(selector.employee_id);
    getUsers(selector.employee_id);
  }, []);
  const { id } = useParams();
  const getUsers = (empId) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/usresdata", { empId })
      .then((result) => {
        let x = result.data;
        setjobTitle(x.job_title);
        setDepartment(x.department);
        form.setFieldsValue({
          key: x._id,
          emp_code: x.emp_code,
          job_title: x.designation,
          f_name: x.f_name,
          l_name: x.l_name,
          department: x.department,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const props1 = {
    name: "file",
    multiple: true,
    action: process.env.REACT_APP_API_URL + "/update_adminprofilepic",
    data: { id: empId },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "removed") {
      }
      if (status === "done") {
        getUsers();
        message.success(`${info.file.name} file uploaded successfully.`);
        form.resetFields();
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    defaultFileList: [],
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      let data = new FormData();
      data.append("id", empId);
      data.append("l_name", values.l_name);
      data.append("f_name", values.f_name);
      data.append("job_title", values.job_title);
      data.append("emp_code", values.emp_code);
      data.append("department", values.department);
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/update_profile",
        data
      );
      setLoading(false);
      form.resetFields();
      getUsers(selector.employee_id);
      notification.success({
        message: "Profile Updated",
        description: "Profile has been updated successfully.",
        placement: "topRight",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
      openNotificationWithIcon("error", "Failed to update account");
    }
  };
  const handlePasswordUpdate = async (values) => {
    values.id = id;
    if (values.new_password !== values.confirm_password) {
      openNotificationWithIcon(
        "warning",
        "Confirm Password and New Password must be the same!"
      );
      form1.resetFields();
    } else {
      setLoading(true);
      try {
        const { id, old_password, new_password } = values;
        const response = await axios.post(
          process.env.REACT_APP_API_URL + "/update_password",
          {
            id,
            oldpassword: old_password,
            newpassword: new_password,
          }
        );
        if (response.data.message == "Password updated successfully") {
          form1.resetFields();
          setLoading(false);
          handleCancel(true);
          getUsers();
          openNotificationWithIcon("success", response.data.message);
        }
        if (response.data.message == "Old Password does Not Matched!") {
          setLoading(false);
          getUsers();
          openNotificationWithIcon("warning", response.data.message);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        openNotificationWithIcon("error", "Failed to update Password");
      }
    }
  };
  return (
    <div>
      <div className="mainContainer">
        <Row>
          <Col span={24}>
            <div className="mainTitle">
              <Title level={3} className="Expensecolor">
                Profile
              </Title>
              <button className="filtercolorbtn" onClick={showModal}>
                Update Password
              </button>
            </div>
          </Col>

          {selector.role != "admin" && (
            <Col span={24}>
              <Form
                form={form}
                name="basic"
                onFinish={handleUpdate}
                layout="vertical"
                autoComplete="off"
              >
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="Profile Photo" name="loginimg">
                      <Dragger {...props1}>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Drag and Drop Files here
                        </p>
                      </Dragger>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="First Name"
                      name="f_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your First Name!",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      label="Last Name"
                      name="l_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Last Name!",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Department"
                      name="department"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Department!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Department"
                        allowClear
                        value={department}
                      >
                        <Option value="1">Engineering</Option>
                        <Option value="2">HR</Option>
                        <Option value="3">SEO</Option>
                        <Option value="4">Social Media</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Job Profile"
                      name="job_title"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Job Profile!",
                        },
                      ]}
                      hasFeedback
                    >
                      <Select
                        placeholder="Select Job"
                        allowClear
                        value={jobTitle}
                      >
                        <Option value="1">Software Enginner</Option>
                        <Option value="2">Software Developer</Option>
                        <Option value="3">QA Engineer</Option>
                        <Option value="4">Frontend Developer</Option>
                        <Option value="5">Backend Developer</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
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

                  <Col span={24}>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Submit
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          )}
        </Row>
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Update Password</span>
              </Col>
              <Col span={24}>
                <Form
                  form={form1}
                  name="basic"
                  layout="vertical"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={handlePasswordUpdate}
                  autoComplete="off"
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        label="Old Password"
                        name="old_password"
                        rules={[
                          {
                            required: true,
                            message: "Please input old password",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter new password"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="New Password"
                        name="new_password"
                        rules={[
                          {
                            required: true,
                            message: "Please input New password",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter New password"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Confirm Password"
                        name="confirm_password"
                        rules={[
                          {
                            required: true,
                            message: "Please input confirm password",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter confirm password"
                          size="small"
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
  );
};

export default AdminProfile;
