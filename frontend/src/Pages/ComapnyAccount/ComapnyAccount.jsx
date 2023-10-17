import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Table,
  Modal,
  Typography,
  Row,
  Col,
  notification,
  Form,
  Input,
  Space,
  DatePicker,
  AutoComplete,
  Select,
} from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;
const moment = require("moment");

const CompantAccount = () => {
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  console.log(tableData);
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

  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const handleOk1 = () => {
    setIsModalOpen(false);
  };
  const handleCancel1 = () => {
    form.resetFields();
    setIsModalOpen1(false);
  };

  useEffect(() => {
    getWebsetting();
    getCompanyAccount();
  }, []);

  const getWebsetting = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getwebsetting")
      .then((result) => {
        const data = result.data;
        if (data && data.length > 0) {
          setSmtpHost(data[0].smtp_host);
          setSmtpPort(data[0].smtp_port);
          setSmtpUsername(data[0].smtp_username);
          setSmtpPassword(data[0].smtp_password);
        } else {
          console.error("Invalid response from API. SMTP settings not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching SMTP settings:", err);
      });
  };

  const getCompanyAccount = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getCompanyAccount_details")
      .then((result) => {
        let data = result.data;
        let newData = [];
        data.map((x) => {
          newData.push({
            key: x._id,
            hosting_name: x.hosting_name,
            hosting_url: x.hosting_url,
            renewal_date: new Date(x.renewal_date).toLocaleDateString(),
            notification_date: new Date(
              x.notification_date
            ).toLocaleDateString(),
            services: x.services,
            client_name: x.client_name,
            username: x.username,
            password: x.password,
          });
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [updatecompanyaccountId, setUpdatecompanyaccountId] = useState([]);
  const [oldrenewaldate, setoldasigneddate] = useState([]);
  const [oldnotificationdate, setoldnotificationdate] = useState([]);

  const handleEdit = (id) => {
    showModal();
    setUpdatecompanyaccountId(id);
    tableData.map((x) => {
      if (x.key == id) {
        setoldasigneddate(x.renewal_date);
        setoldnotificationdate(x.notification_date);
        form1.setFieldsValue({
          key: x._id,
          hosting_name: x.hosting_name,
          hosting_url: x.hosting_url,
          services: x.services,
          client_name: x.client_name,
          username: x.username,
          password: x.password,
        });
      }
    });
  };

  const [getclient_id, setClientId] = useState("");
  console.log(getclient_id);
  const handleChange = (value, option) => {
    let client_id = option.key;
    setClientId(client_id);
  };

  const handleAdd = (values) => {
    values.client_id = getclient_id;
    const renewalDate = new Date(values.renewal_date.$d);
    const formattedValues = {
      ...values,
      notification_date: moment(renewalDate)
        .subtract(10, "days")
        .format("YYYY-MM-DD"),
      renewal_date: moment(renewalDate).format("YYYY-MM-DD"),
    };
    axios
      .post(
        process.env.REACT_APP_API_URL + "/add_companyaccount",
        formattedValues
      )
      .then((res) => {
        setLoading(false);
        form2.resetFields();
        handleCancel1(true);
        getCompanyAccount();
        notification.success({
          message: "Company Account Added",
          description: "Company Account has been Added successfully.",
          placement: "topRight",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (values) => {
    values.id = updatecompanyaccountId;
    if (values.renewal_date === undefined) {
      values.renewal_date = oldrenewaldate;
    }
    if (values.notification_date !== undefined && values.renewal_date) {
      values.notification_date = moment(values.renewal_date)
        .subtract(10, "days")
        .format("YYYY-MM-DD");
    }
    axios
      .post(process.env.REACT_APP_API_URL + "/update-companyaccount", values)
      .then((res) => {
        if (res != "") {
          getCompanyAccount();
          setIsModalOpen(false);
          handleCancel(true);
          form1.resetFields();
          notification.success({
            message: "Company Account Updated",
            description: "Company Account has been updated successfully.",
            placement: "topRight",
            icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
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

  const handleDelete = (id) => {
    confirm({
      title: "Delete the Issued Item",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Issue Item?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItem(id);
      },
    });
  };

  const deleteItem = (id) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/delete_companyaccount", {
        data: { id }, // Pass the data as an object
      })
      .then((response) => {
        console.log(response.data);
        setTableData((prevData) => prevData.filter((item) => item.key !== id));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSearch = (value) => {
    // Fetch item suggestions based on the user's input
    axios
      .get(`${process.env.REACT_APP_API_URL}/client/search?query=${value}`)
      .then((response) => {
        const client = response.data;
        setSuggestions(client);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkNotificationDate = () => {
    const currentDate = new Date();
    tableData.forEach((record) => {
      const notificationDate = new Date(record.notification_date + " 10:00:00");
      if (currentDate >= notificationDate && !record.emailSent) {
        handleSendMail(
          record.hosting_name,
          record.hosting_url,
          record.renewal_date,
          record.client_name,
          smtpHost,
          smtpPort,
          smtpUsername,
          smtpPassword
        );
        getWebsetting();
        // Mark the email as sent to prevent multiple emails on the same date
        record.emailSent = true;
      }
    });
  };

  useEffect(() => {
    // Run the checkNotificationDate function every minute
    const intervalId = setInterval(checkNotificationDate, 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [tableData]);
  const handleSendMail = (
    hosting_name,
    hosting_url,
    renewal_date,
    client_name,
    smtpHost,
    smtpPort,
    smtpUsername,
    smtpPassword
  ) => {
    const data = {
      hosting_name: hosting_name,
      hosting_url: hosting_url,
      renewal_date: renewal_date,
      client_name: client_name,
      smtpHost: smtpHost,
      smtpPort: smtpPort,
      smtpUsername: smtpUsername,
      smtpPassword: smtpPassword,
    };

    // Make a POST request to the server to send the email
    axios
      .post(process.env.REACT_APP_API_URL + "/mail", data)
      .then((res) => {
        console.log(res.data); // Assuming the response contains the data you want to display
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const columns = [
    {
      title: "Hosting Name",
      dataIndex: "hosting_name",
      key: "hosting_name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Hosting Url",
      dataIndex: "hosting_url",
      key: "hosting_url",
    },
    {
      title: "Services",
      dataIndex: "services",
      key: "services",
    },

    {
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
    },

    {
      title: "UserName",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Renewal Date",
      dataIndex: "renewal_date",
      key: "renewal_date",
    },
    {
      title: "Notification Date",
      dataIndex: "notification_date",
      key: "notification_date",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <a onClick={() => handleEdit(record.key)}>
            <span>
              <EditOutlined style={{ cursor: "pointer" }} />
            </span>
          </a>
          <a onClick={() => handleDelete(record.key)}>
            <span>
              <DeleteOutlined style={{ cursor: "pointer" }} />
            </span>
          </a>
        </div>
      ),
    },
    // {
    //   title: "Send Mail",
    //   key: "action",
    //   render: (_, record) => (
    //     <div>
    //       <Space wrap>
    //         <Button
    //           type="primary"
    //           block
    //           onClick={() =>
    //             handleSendMail(
    //               record.hosting_name,
    //               record.hosting_url,
    //               record.renewal_date,
    //               record.client_name,
    //               record.smtpPort,
    //               record.smtpHort,
    //               record.smtpUsername,
    //               record.smtpPassword
    //             )
    //           }
    //         >
    //           Send Mail
    //         </Button>
    //       </Space>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div>
      <div className="m12r">
        <Title level={3} className="Expensecolor">
          Comapny Accounts
        </Title>
        <button className="Expensecolorbtn" onClick={showModal1}>
          Add Account +
        </button>
        {/* <button className="filtercolorbtn">
          Filter <i className="fa fa-filter" aria-hidden="true"></i>
        </button> */}
      </div>

      <Modal
        open={isModalOpen1}
        onOk={handleOk1}
        onCancel={handleCancel1}
        footer={[]}
      >
        <div style={{ padding: "30px" }}>
          <Row>
            <Col span={24} style={{ marginBottom: "30px" }}>
              <span className="popupTitle">Add Company Account</span>
            </Col>

            <Col span={24}>
              <Form
                form={form2}
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
                      label="Name of Hosting"
                      name="hosting_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input hosting name",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter hosting name"
                        size="small"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Hosting URL"
                      name="hosting_url"
                      rules={[
                        {
                          required: true,
                          message: "Please input hosting url",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter hosting url"
                        size="small"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Services"
                      name="services"
                      rules={[
                        {
                          required: true,
                          message: "Please input hosting services",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter hosting services"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Client Name"
                      name="client_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input a valid item name!",
                        },
                      ]}
                    >
                      <AutoComplete
                        className="myAntIpt2"
                        placeholder="Select Item"
                        onSearch={handleSearch}
                        onChange={handleChange}
                      >
                        {suggestions.map((option) => (
                          <Option key={option._id} value={option.client_name}>
                            {option.item_name}
                          </Option>
                        ))}
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input username",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter username"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input hosting password",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter hosting password"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Renewal Date"
                      name="renewal_date"
                      rules={[
                        {
                          required: true,
                          message: "Please input Renewal Date",
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
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Form>
            </Col>
          </Row>
        </div>
      </Modal>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <div style={{ padding: "30px" }}>
          <Row>
            <Col span={24} style={{ marginBottom: "30px" }}>
              <span className="popupTitle">Update Company Account</span>
            </Col>
            <Col span={24}>
              <Form
                form={form1}
                name="basic"
                layout="vertical"
                initialValues={{
                  remember: true,
                }}
                onFinish={handleUpdate}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label="Name of Hosting"
                      name="hosting_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input hosting name",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter hosting name"
                        size="small"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Hosting URL"
                      name="hosting_url"
                      rules={[
                        {
                          required: true,
                          message: "Please input hosting url",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter hosting url"
                        size="small"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Services"
                      name="services"
                      rules={[
                        {
                          required: true,
                          message: "Please input hosting services",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter hosting services"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Client Name"
                      name="client_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input a valid item name!",
                        },
                      ]}
                    >
                      <AutoComplete
                        placeholder="Select Item"
                        className="myAntIpt2"
                        onSearch={handleSearch}
                      >
                        {suggestions.map((option) => (
                          <Option key={option._id} value={option.client_name}>
                            {option.item_name}
                          </Option>
                        ))}
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Please input username",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter username"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input hosting password",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter hosting password"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Old Renewal Date">
                      <Input
                        value={oldrenewaldate}
                        disabled
                        className="sameinput"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Old Notification Date">
                      <Input
                        value={oldnotificationdate}
                        disabled
                        className="sameinput"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Renewal Date"
                      name="renewal_date"
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
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Form>
            </Col>
          </Row>
        </div>
      </Modal>
      <div>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default CompantAccount;
