import { useEffect, useState } from "react";
import { Col, Form, Input, Row, Typography } from "antd";
import axios from "axios";
import { DownloadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { List } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;

const ShowEmployeeExit = () => {
  const [form] = Form.useForm();
  useEffect(() => {
    getEmployeeExit();
    getExitEmployeeDocs();
  }, []);
  const { id } = useParams();
  const [accountData, setAccountData] = useState([]);
  const getExitEmployeeDocs = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getexitemployeedocs", { id })
      .then((result) => {
        const data = result.data;

        let newData = [];
        data.map((x, i) => {
          newData.push({
            key: x._id,
            url: x.url,
            name: `Employee Document ${i + 1}`,
          });
        });

        setAccountData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getEmployeeExit = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/GetEmployeeExit")
      .then((result) => {
        let data = result.data;
        console.log(data);
        let newData = [];
        data.map((x) => {
          if (x._id == id) {
            form.setFieldsValue({
              key: x._id,
              emp_name: x.emp_name,
              emp_code: x.emp_code,
              renewal_date: new Date(x.joining_date).toLocaleDateString(),
              resign_date: new Date(x.resign_date).toLocaleDateString(),
              leaveing_date: new Date(x.leaveing_date).toLocaleDateString(),
              joining_date: new Date(x.joining_date).toLocaleDateString(),
              designation: x.designation,
              experience: x.experience,
              salary: x.salary,
              personal_email: x.personal_email,
              office_email: x.office_email,
              department: x.department,
              fnf_status: x.fnf_status,
              password: x.password,
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <div className="mainContainer">
        <Row>
          <Col span={24}>
            <div className="mainTitle">
              <Title level={5} className="Expensecolor">
                Employee Exit Details
              </Title>
              <Link to={`/employee_exit`}>
                <button className="filtercolorbtn">
                  Show Employee Exit
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </button>
              </Link>
            </div>
          </Col>
          <Col span={24}>
            <Form form={form} name="basic" layout="vertical" autoComplete="off">
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    label="Employee Name"
                    name="emp_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input employee name!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Employee Code"
                    name="emp_code"
                    rules={[
                      {
                        required: true,
                        message: "Please input code of Employee!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Employee code.." disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Job Title"
                    name="designation"
                    rules={[
                      {
                        required: true,
                        message: "Please input employee Job Title!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Job title..." disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Date Of Joining"
                    name="joining_date"
                    hasFeedback
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Experience"
                    name="experience"
                    rules={[
                      {
                        required: true,
                        message: "Please input employee experience!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Employee experience..." disabled />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Salary"
                    name="salary"
                    rules={[
                      {
                        required: true,
                        message: "Please input employee salary!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Employee salary..." disabled />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Personal Email"
                    name="personal_email"
                    rules={[
                      {
                        required: true,
                        message: "Please input Personal Email!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Personal Email..." disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Official Email"
                    name="office_email"
                    rules={[
                      {
                        required: true,
                        message: "Please input Official Email!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Official Email..." disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Official Email Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input Official Email password!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Official Email password..." disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Leaving Date"
                    name="leaveing_date"
                    hasFeedback
                  >
                    <Input
                      placeholder="Leaving Date"
                      disabled
                      className="sameinput"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Date of Resignation"
                    name="resign_date"
                    hasFeedback
                  >
                    <Input
                      placeholder="Date of Resignation"
                      disabled
                      className="sameinput"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Department"
                    name="department"
                    rules={[
                      {
                        required: true,
                        message: "Please input employee department!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Employee department..." disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="FNF"
                    name="fnf_status"
                    rules={[
                      {
                        required: true,
                        message: "Please select FNF status!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <List
                    bordered
                    dataSource={accountData}
                    renderItem={(accountData) => (
                      <List.Item className="list-style">
                        {accountData.name}
                        <a
                          href={accountData.url}
                          className="colorname"
                          target="_blank"
                          id="deleteicon"
                        >
                          <DownloadOutlined style={{ fontSize: "15px" }} />
                        </a>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ShowEmployeeExit;
