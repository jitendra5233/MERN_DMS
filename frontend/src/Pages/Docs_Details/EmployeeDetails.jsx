import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
  message,
} from "antd";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

const EmployeeDetails = () => {
  const [allDep, setAllDep] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  let { Option } = Select;

  const { TextArea } = Input;

  const [form] = Form.useForm();
  let { Title } = Typography;
  const r_prams = useParams();

  useEffect(() => {
    getDepartments();
    getCandidateData(r_prams.id);
  }, []);

  const getDepartments = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getDepartment")
      .then((res) => {
        setAllDep(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllJobProfiles = (ref_id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getDepartmentPostions", {
        id: ref_id,
      })
      .then((res) => {
        setAllJobs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCandidateData = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getCandidateDataById", { id })
      .then((res) => {
        let data = res.data;
        if (data.length != 0) {
          let formData = data[0];
          formData.date_of_joining = dayjs(formData.date_of_joining);
          formData.emp_dob = dayjs(formData.emp_dob);

          if (formData.job_title == undefined) {
            formData.job_title = formData.designation;
          }
          form.setFieldsValue(formData);
          getAllJobProfiles(formData.department);
          axios
            .post(process.env.REACT_APP_API_URL + "/getCandidateData2ById", {
              id,
            })
            .then((res) => {
              // console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("no");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinish = (values) => {
    values.ref_id = r_prams.id;
    console.log(values);
    axios
      .post(process.env.REACT_APP_API_URL + "/addCandidateDetails", values)
      .then((res) => {
        console.log(res.data);
        message.success("Added");
      })
      .catch((err) => {
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
              <Title level={4}>Employee Detail</Title>
            </div>
          </Col>
          <Col span={24}>
            <Form
              form={form}
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
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter your Last Name"
                      size="small"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Emp Code"
                    name="emp_code"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Emp Code!",
                      },
                    ]}
                  >
                    <Input
                      className="myAntIpt2"
                      placeholder="Employee Code"
                      size="small"
                      disabled
                    />
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
                    <Select
                      placeholder="Select Employee Type"
                      className="myAntIptSelect2"
                      allowClear
                    >
                      <Option value="permanent">Permanent</Option>
                      <Option value="Intern">Intern</Option>
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
                    <Select
                      placeholder="Select Department"
                      className="myAntIptSelect2"
                      allowClear
                      onChange={(value) => {
                        form.resetFields(["designation"]);
                        getAllJobProfiles(value);
                      }}
                    >
                      {allDep.map((x) => (
                        <Option value={x.slug}>{x.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Designation"
                    name="job_title"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Designation!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select designation"
                      className="myAntIptSelect2"
                      allowClear
                    >
                      {allJobs.map((x) => (
                        <Option value={x.slug}>{x.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Date of joining"
                    name="date_of_joining"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Date of joining!",
                      },
                    ]}
                  >
                    {/* <Input
                      className="myAntIpt2"
                      placeholder="Enter your Date"
                      size="small"
                    /> */}
                    <DatePicker
                      className="myAntIpt2"
                      placeholder="Enter your Date"
                      size="small"
                    />
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
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Experience"
                      size="small"
                    />
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
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Salary"
                      size="small"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Office Email"
                    name="office_email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Office Email!",
                      },
                    ]}
                  >
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Office Email"
                      size="small"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Office Email Password"
                    name="office_email_password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Office Email Password!",
                      },
                    ]}
                  >
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Office Email Password"
                      size="small"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Personal Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Email!",
                      },
                    ]}
                  >
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Personal Email"
                      size="small"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Aadhar Card"
                    name="aadhar_no"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Last Salary!",
                      },
                    ]}
                  >
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Last Salary"
                      size="small"
                    />
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
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Pan Card No"
                      size="small"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Bank Name"
                    name="bank_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Bank Name!",
                      },
                    ]}
                  >
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Bank Name"
                      size="small"
                    />
                  </Form.Item>
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
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Account No"
                      size="small"
                    />
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
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Account No"
                      size="small"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Phone Number!",
                      },
                    ]}
                  >
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Phone Number"
                      size="small"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Other Phone Number"
                    name="other_phone"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Other Phone Number!",
                      },
                    ]}
                  >
                    <Input
                      className="myAntIpt2"
                      placeholder="Enter Other Phone Number"
                      size="small"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Date of Birth"
                    name="emp_dob"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Date of Birth!",
                      },
                    ]}
                  >
                    <DatePicker
                      className="myAntIpt2"
                      placeholder="Enter your Date"
                      size="small"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Gender!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select Gender"
                      className="myAntIptSelect2"
                      allowClear
                    >
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <div
                    className="ant-form-item-label"
                    style={{ marginLeft: "12px" }}
                  >
                    <label>Address</label>
                  </div>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Permanent Address"
                    name="p_address"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Permanent Address!",
                      },
                    ]}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Temporary Address"
                    name="t_address"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Permanent Address!",
                      },
                    ]}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item>
                    <Button
                      className="myAntLoginBtn"
                      type="primary"
                      htmlType="submit"
                    >
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

export default EmployeeDetails;
