import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Col,
  Form,
  Input,
  Row,
  Typography,
  notification,
  message,
  Modal,
  Table,
  Space,
} from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DownloadOutlined } from "@ant-design/icons";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Dragger from "antd/es/upload/Dragger";

import { InboxOutlined } from "@ant-design/icons";
import { List } from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const EditEmployeeExit = () => {
  const [form] = Form.useForm();
  useEffect(() => {
    getEmployeeExit();
    getExitEmployeeDocs();
    getEmployeeAssignedItem();
  }, []);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [accountData, setAccountData] = useState([]);
  const [ItemData, setItemData] = useState([]);
  const [empId, setEmpId] = useState([]);
  const openNotificationWithIcon = (type, message) => {
    if (type === "error") {
      api[type]({
        message: "Server Error",
        description: "",
      });
    } else {
      api[type]({
        message,
        description: "",
      });
    }
  };

  const getEmployeeExit = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/GetEmployeeExit")
      .then((result) => {
        let data = result.data;
        let newData = [];
        data.map((x) => {
          if (x._id == id) {
            getEmployeeAssignedItem(x.emp_id);
            setEmpId(x.emp_id);
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

  const getEmployeeAssignedItem = (emp_id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getexitemployeeAssignedItem", {
        emp_id,
      })
      .then((result) => {
        const data = result.data;
        let newData = [];
        data.map((x) => {
          newData.push({
            key: x.item_id,
            item_name: x.item_name,
            serial_number: x.serial_number,
            assignment_date: x.assignment_date,
            quantity: x.quantity,
          });
        });

        setItemData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteDoc = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteemployeeexitDocs", { id })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const props1 = {
    name: "file",
    multiple: true,
    action: process.env.REACT_APP_API_URL + "/update_employeeexitdocs",
    data: { name: "employee_docs", ref_id: id },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "removed") {
        deleteDoc(info.file.uid);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        getEmployeeExit();
        getExitEmployeeDocs();
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

  const handleUpdateEmployeeExit = async (values) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("id", id);
      data.append("fnf_status", values.fnf_status);
      if (values.images && values.images.length > 0) {
        for (let index = 0; index < values.images.length; index++) {
          const file = values.images[index].originFileObj;
          data.append(`employee_docs[${index}]`, file);
        }
      }
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/update_employeeexit",
        data
      );
      console.log(response.data);
      form.resetFields();
      setLoading(false);
      getEmployeeExit();
      openNotificationWithIcon("success", "Account Updated Successfully");
    } catch (error) {
      setLoading(false);
      console.error(error);
      openNotificationWithIcon("error", "Failed to update employee exit");
    }
  };
  const handleDeleteIcon = (id) => {
    confirm({
      title: "Delete the Social Icon",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Social Icon?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteSocialIcon(id);
      },
    });
  };

  const deleteSocialIcon = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/delete_exitemployeedocs/${id}`)
      .then((response) => {
        console.log(response.data);
        getEmployeeExit();
        getExitEmployeeDocs();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleReturn = (itemid, quantity) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/return_assigneditem", {
        itemid,
        quantity,
      })
      .then((res) => {
        setLoading(false);
        form.resetFields();
        getEmployeeExit();
        getExitEmployeeDocs();
        getEmployeeAssignedItem();
        openNotificationWithIcon(
          "success",
          "Assigned Item Return  Successfully"
        );
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        openNotificationWithIcon("error", "Failed to Assigned Item Return");
      });
  };
  // const handleChange = (values) => {};
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

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Space wrap>
            <Button
              type="primary"
              block
              onClick={() => handleReturn(record.key, record.quantity)}
            >
              Return Items
            </Button>
          </Space>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="mainContainer">
        <Row>
          <Col span={24}>
            <div className="mainTitle">
              <Title level={5} className="Expensecolor">
                Update Employee Exit
              </Title>
              <Link to={`/employee_exit`}>
                <button className="filtercolorbtn">
                  Show Employee Exit
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </button>
              </Link>
            </div>
          </Col>
          {contextHolder}
          <Col span={24}>
            <Form
              form={form}
              name="basic"
              layout="vertical"
              onFinish={handleUpdateEmployeeExit}
              autoComplete="off"
            >
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
                  >
                    <Select
                      placeholder="Select FNF status"
                      allowClear
                      className="myAntIptSelect2"
                    >
                      <Option value="Under Process">Under Process</Option>
                      <Option value="Hold">Hold</Option>
                      <Option value="Confirm">Confirm</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <div className="m12r">
                    <Title level={3} className="Expensecolor">
                      Assigned Inventories
                    </Title>
                  </div>
                  <div>
                    <Table columns={columns} dataSource={ItemData} />
                  </div>
                </Col>

                <Col span={24}>
                  <Form.Item label="Upload Docs" name="employee_docs">
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
                  <List
                    bordered
                    dataSource={accountData}
                    renderItem={(accountData) => (
                      <List.Item className="list-style">
                        {accountData.name}
                        <i
                          class="fa fa-trash"
                          id="deleteicon"
                          aria-hidden="true"
                          onClick={() => handleDeleteIcon(accountData.key)}
                        ></i>
                        <a
                          href={accountData.url}
                          className="colorname"
                          target="_blank"
                        >
                          <DownloadOutlined style={{ fontSize: "15px" }} />
                        </a>
                      </List.Item>
                    )}
                  />
                </Col>

                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Update
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

export default EditEmployeeExit;
