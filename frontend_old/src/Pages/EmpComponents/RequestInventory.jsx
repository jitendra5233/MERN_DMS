import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Table,
  Modal,
  Typography,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Spin,
  notification,
} from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useSelector } from "react-redux";
const { Title } = Typography;
const { confirm } = Modal;

const ShowIssuedEnventory = () => {
  const [tableData, setTableData] = useState([]);
  let selector = useSelector((state) => state.persistedReducer.user);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // const [EmpId, setEmpId] = useState();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  useEffect(() => {
    getEmpInventory(selector.employee_id);
  }, []);

  const openNotificationWithIcon = (type) => {
    if (type === "error") {
      api[type]({
        message: "Something Went's Wrong",
        description: "",
      });
    } else {
      api[type]({
        message: "Mail send successfully",
        description: "",
      });
    }
  };
  const [EmpName, setEmpName] = useState();
  const [EmpCode, setEmpCode] = useState();
  const [EmpJobTitle, setEmpJobTitle] = useState();

  const getEmpInventory = (EmpId) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/issuedEmpItem/${EmpId}`)
      .then((result) => {
        let data = result.data;
        console.log(data);
        let newData = [];
        data.map((x) => {
          newData.push({
            key: x._id,
            item_name: x.item_name,
            serial_number: x.serial_number,
            assignment_date: new Date(x.assignment_date).toLocaleDateString(),
            quantity: x.quantity,
            emp_name: x.emp_name,
            emp_code: x.emp_code,
            job_title: x.job_title,
            emp_id: x.emp_id,
          });
          setEmpName(x.emp_name);
          setEmpCode(x.emp_code);
          setEmpJobTitle(x.job_title);
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAdd = (values) => {
    setLoading(true);
    axios
      .get(process.env.REACT_APP_API_URL + "/getwebsetting")
      .then((result) => {
        if (result.length != 0) {
          let final_result = result.data[0];
          let obj_data = {
            smtpHost: final_result.smtp_host,
            smtpPort: final_result.smtp_port,
            smtpUsername: final_result.smtp_username,
            smtpPassword: final_result.smtp_password,
            emp_name: values.emp_name,
            emp_code: values.emp_code,
            job_title: values.job_title,
            item_name: values.item_name,
            quantity: values.quantity,
            request_date: new Date(values.request_date).toLocaleDateString(),
          };
          axios
            .post(
              process.env.REACT_APP_API_URL + "/sendMailForRequestInventory",
              obj_data
            )
            .then((res) => {
              setLoading(false);
              if (res.data === true) {
                getEmpInventory(selector.employee_id);
                form.resetFields();
                setIsModalOpen(false);
                openNotificationWithIcon("success");
              } else {
                openNotificationWithIcon("error");
              }
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Serial Number",
      dataIndex: "serial_number",
      key: "serial_number",
    },

    {
      title: "Assigned Date",
      dataIndex: "assignment_date",
      key: "assignment_date",
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <div>
      <div className="m12r">
        <Title level={3} className="Expensecolor">
          Items assigned to employee
        </Title>
        <button className="Expensecolorbtn" onClick={showModal}>
          Request inventory
        </button>
      </div>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Request Inventory Via Mail</span>
              </Col>

              <Col span={24}>
                <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={handleAdd}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        label="Employee Name"
                        name="emp_name"
                        initialValue={EmpName}
                      >
                        <Input className="myAntIpt2" size="small" readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Employee Code"
                        name="emp_code"
                        initialValue={EmpCode}
                      >
                        <Input className="myAntIpt2" size="small" readOnly />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Job Title"
                        name="job_title"
                        initialValue={EmpJobTitle}
                      >
                        <Input className="myAntIpt2" size="small" readOnly />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Item Name"
                        name="item_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input your item name",
                          },
                        ]}
                      >
                        <Input className="myAntIpt2" size="small" />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Quantity"
                        name="quantity"
                        initialValue={1}
                        rules={[
                          {
                            required: true,
                            message: "Please input your Quantity",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Quantity"
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Date of Request"
                        name="request_date"
                        rules={[
                          {
                            required: true,
                            message: "Please input your request Date",
                          },
                        ]}
                        hasFeedback
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          disabledDate={(current) =>
                            current && current < moment().startOf("day")
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
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
                </Form>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>

      <div>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default ShowIssuedEnventory;
