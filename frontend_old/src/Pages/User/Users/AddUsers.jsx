import { useState } from "react";
import {
  Button,
  Select,
  Col,
  Form,
  Input,
  Row,
  Typography,
  DatePicker,
  notification,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../../../Redux/Actions";

const AddUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);

  let { Title } = Typography;
  let { Option } = Select;

  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

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

  const onFinish = (values) => {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_URL + "/create_User", values)
      .then((res) => {
        setLoading(false);
        if (res.data.length === 0) {
          openNotificationWithIcon("error");
        } else {
          openNotificationWithIcon("success");
          dispatch(handleLogin({ name: "harman" }));
          // navigate("/dashboard");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <div className="mainContainer">
        <Row>
          <Col span={24}>
            <div className="mainTitle">
              <Title level={4}>Create New Employee</Title>
            </div>
          </Col>
          <Col span={24}>
            <Form
              name="basic"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Row gutter={24}>
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
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Role!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Role" allowClear>
                      <Option value="hr">HR</Option>
                      <Option value="employee">Empolyee</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Email!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Confirm Password"
                    name="c_password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Confirm Password!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Last Salary"
                    name="last_salary"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Last Salary!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Expected Salary"
                    name="expected_salary"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Expected Salary!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Salary"
                    name="salary"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Salary!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Joining Date"
                    name="join_date"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Joining Date!",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Experience"
                    name="experience"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Experience!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Location!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Job Profile"
                    name="job_profile"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Job Profile!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Job" allowClear>
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
                    label="Department"
                    name="department"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Department!",
                      },
                    ]}
                  >
                    <Select placeholder="Select Department" allowClear>
                      <Option value="1">Engineering</Option>
                      <Option value="2">HR</Option>
                      <Option value="3">SEO</Option>
                      <Option value="4">Social Media</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Employee Type"
                    name="employee_type"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Employee Type!",
                      },
                    ]}
                  >
                    <Select placeholder="Employee Type" allowClear>
                      <Option value="hr">Permanent</Option>
                      <Option value="employee">Intern</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Aadhar Card No"
                    name="aadhar_no"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Aadhar Card No!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Pan Card No"
                    name="pan_no"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Pan Card No!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Title level={4}>Bank Details</Title>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Account No"
                    name="account_no"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Account No!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Re-enter Account No"
                    name="re_account_no"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Account No!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="IFSC code "
                    name="ifsc"
                    rules={[
                      {
                        required: true,
                        message: "Please input your IFSC Code!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Account Holders's Name"
                    name="acc_holder_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Account Holders's Name!",
                      },
                    ]}
                  >
                    <Input />
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
    </div>
  );
};

export default AddUsers;
