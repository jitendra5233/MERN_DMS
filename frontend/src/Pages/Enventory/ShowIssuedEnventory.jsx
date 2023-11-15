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
  Space,
  DatePicker,
  AutoComplete,
  Select,
} from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;
const ShowIssuedEnventory = () => {
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);

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
    getInventory();
  }, []);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const getInventory = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/issued")
      .then((result) => {
        let data = result.data;
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
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [updatedItemName, setUpdatedItemName] = useState([]);
  const [updatedTotaltem, setUpdatedTotaltem] = useState([]);
  const [updateItemId, setUpdateItemId] = useState([]);
  const [availableItem, setAvailableItem] = useState([]);
  const [AvailableItemId, setAvailableItemId] = useState([]);
  const [oldasigneddate, setoldasigneddate] = useState([]);
  const [empId, setEmpId] = useState([]);
  console.log(empId);
  const handleEdit = (id) => {
    showModal();
    setUpdateItemId(id);
    axios
      .get(`${process.env.REACT_APP_API_URL}/available-items/${id}`)
      .then((response) => {
        const availableItem = response.data.availableItem;
        setAvailableItem(availableItem.availableItem);
        setAvailableItemId(availableItem._id);
      })
      .catch((error) => {
        console.error(error);
      });

    tableData.map((x) => {
      if (x.key == id) {
        setUpdatedItemName(x.item_name);
        setUpdatedTotaltem(x.quantity);
        setoldasigneddate(x.assignment_date);
        setEmpId(x.emp_id);
        form1.setFieldsValue({
          key: x._id,
          item_name: x.item_name,
          serial_number: x.serial_number,
          quantity: x.quantity,
          emp_name: x.emp_name,
          emp_code: x.emp_code,
          job_title: x.job_title,
        });
      }
    });
  };

  const [damageItemId, setdamageItemId] = useState([]);
  const [issueItemId, setissueItemId] = useState([]);
  const handleDamage = (id) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getissuedata/${id}`)
      .then((response) => {
        let data = response.data;
        setdamageItemId(data.item_id);
      })
      .catch((error) => {
        console.error(error);
      });
    showModal1();
    setissueItemId(id);
    tableData.map((x) => {
      if (x.key == id) {
        form.setFieldsValue({
          key: x._id,
          item_name: x.item_name,
          serial_number: x.serial_number,
          assignment_date: new Date(x.assignment_date).toLocaleDateString(),
          quantity: x.quantity,
          emp_name: x.emp_name,
          emp_code: x.emp_code,
          job_title: x.job_title,
        });
      }
    });
  };
  const [empName, setEmpName] = useState([]);
  const handleChange = (value, option) => {
    let userId = option.key;
    axios
      .post(process.env.REACT_APP_API_URL + "/getUserData", { userId })
      .then((res) => {
        if (res.data !== "") {
          let data = res.data;
          var emp_name = data.f_name + " " + data.l_name;
          setEmpId(data._id);
          setEmpName(emp_name);
          form1.setFieldsValue({
            emp_code: data.emp_code,
            job_title: data.job_title,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (values) => {
    values.id = updateItemId;
    if (values.assignment_date == undefined) {
      values.assignment_date = oldasigneddate;
    }
    let getavailableitem = values.quantity - updatedTotaltem;
    values.finalavailableItem = getavailableitem;
    values.item_id = AvailableItemId;
    values.emp_id = empId;
    axios
      .post(process.env.REACT_APP_API_URL + "/update-issueitem", values)
      .then((res) => {
        if (res != "") {
          getInventory();
          setIsModalOpen(false);
          handleCancel();
          form1.resetFields();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLossDamage = (values) => {
    values.id = issueItemId;
    values.damageItemId = damageItemId;
    values.repair_status = "No";
    axios
      .post(process.env.REACT_APP_API_URL + "/addToDamage", values)
      .then((res) => {
        if (res != "") {
          getInventory();
          setIsModalOpen1(false);
          handleCancel1();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleDelete = (itemId, quantity, itemname) => {
    confirm({
      title: "Delete the Issued Item",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Issue Item?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItem(itemId, quantity, itemname);
      },
    });
  };

  const deleteItem = (itemId, quantity, itemname) => {
    axios
      .delete(process.env.REACT_APP_API_URL + "/deleteissue_item", {
        data: { itemId, quantity, itemname },
      })
      .then((response) => {
        console.log(response.data);
        setTableData((prevData) =>
          prevData.filter((item) => item.key !== itemId)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleKeyUp = (event) => {
    console.log(event.target.value);
    if (event.target.value > availableItem) {
      form.setFieldsValue({
        quantity: updatedTotaltem,
      });
      alert("Available Item Only" + " " + +availableItem + "");
    }
  };

  const handlenameSearch = (value) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/items/searchName?query=${value}`)
      .then((response) => {
        const items = response.data;
        setUserSuggestions(items);
      })
      .catch((error) => {
        console.error(error);
      });
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
      title: "Employee Name",
      dataIndex: "emp_name",
      key: "emp_name",
    },

    {
      title: "Employee Code",
      dataIndex: "emp_code",
      key: "emp_code",
    },

    {
      title: "Job Title",
      dataIndex: "job_title",
      key: "job_title",
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
          <a onClick={() => handleEdit(record.key)}>
            {" "}
            <span>
              <EditOutlined style={{ cursor: "pointer" }} />
            </span>
          </a>
        </div>
      ),
    },

    {
      title: "Loss/Damage",
      key: "action",
      render: (_, record) => (
        <div>
          <Space wrap>
            <Button
              type="primary"
              block
              onClick={() => handleDamage(record.key)}
            >
              Loss/Damage
            </Button>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="m12r">
        <Title level={3} className="Expensecolor">
          Items assigned to employee
        </Title>
        <Link to={`/add-issued`}>
          <button className="Expensecolorbtn">Assign Item +</button>
        </Link>

        <Link to={`/inventory-item`}>
          <button className="filtercolorbtn">
            Total items <i class="fa fa-eye" aria-hidden="true"></i>
          </button>
        </Link>

        <Link to={`/show_itemrecord`}>
          <button className="filtercolorbtn">
            Show Record <i class="fa fa-eye" aria-hidden="true"></i>
          </button>
        </Link>
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
              <span className="popupTitle">Add Item Loss/Damage</span>
            </Col>

            <Col span={24}>
              <Form
                form={form}
                name="basic"
                layout="vertical"
                initialValues={{
                  remember: true,
                }}
                onFinish={handleLossDamage}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item
                      label="Name of item"
                      name="item_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input Your Name Of item",
                        },
                      ]}
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter your Name Of item"
                        size="small"
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Serial Number"
                      name="serial_number"
                      rules={[
                        {
                          required: true,
                          message: "Please input serial number",
                        },
                      ]}
                    >
                      <Input
                        disabled
                        className="myAntIpt2"
                        placeholder="Enter Item serial number"
                        size="small"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Employee Name"
                      name="emp_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input Employee Name",
                        },
                      ]}
                    >
                      <AutoComplete
                        placeholder="Select Item"
                        onSearch={handlenameSearch}
                        onChange={handleChange}
                        disabled
                      >
                        {userSuggestions.map((option) => (
                          <Option
                            key={option._id}
                            value={`${option.emp_code} - ${option.f_name} ${option.l_name}`}
                          >
                            {`${option.emp_code} - ${option.f_name} ${option.l_name}`}
                          </Option>
                        ))}
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Employee Code"
                      name="emp_code"
                      rules={[
                        {
                          required: true,
                          message: "Please input Employee Code",
                        },
                      ]}
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter Employee Code"
                        disabled
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
                          message: "Please input Job Title",
                        },
                      ]}
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter Job Title"
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Quantity"
                      name="quantity"
                      rules={[
                        {
                          required: true,
                          message: "Please input Quantity!",
                        },
                      ]}
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter your Quantity"
                        disabled
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Assigned Date"
                      name="assignment_date"
                      rules={[
                        {
                          required: true,
                          message: "Please input Assigned Date!",
                        },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="comment"
                      label="Comment"
                      rules={[
                        { required: true, message: "Please input Intro" },
                      ]}
                      hasFeedback
                    >
                      <Input.TextArea showCount maxLength={100} />
                    </Form.Item>
                  </Col>
                </Row>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
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
              <span className="popupTitle">Update Issued Item</span>
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
                      label="Name of item"
                      name="item_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input Your Name Of item",
                        },
                      ]}
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter  your Name Of item"
                        size="small"
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Serial Number"
                      name="serial_number"
                      rules={[
                        {
                          required: true,
                          message: "Please input serial number",
                        },
                      ]}
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter Item serial number"
                        size="small"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Employee Name"
                      name="emp_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input Employee Name",
                        },
                      ]}
                      hasFeedback
                    >
                      <AutoComplete
                        placeholder="Select Item"
                        onSearch={handlenameSearch}
                        onChange={handleChange}
                      >
                        {userSuggestions.map((option) => (
                          <Option
                            key={option._id}
                            value={`${option.f_name} ${option.l_name}`}
                          >
                            {`${option.emp_code} - ${option.f_name} ${option.l_name}`}
                          </Option>
                        ))}
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Employee Code"
                      name="emp_code"
                      rules={[
                        {
                          required: true,
                          message: "Please input Employee Code",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter Employee Code"
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
                          message: "Please input Job Title",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter Job Title"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Quantity"
                      name="quantity"
                      onKeyUp={handleKeyUp}
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
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Old Assigned Date">
                      <Input
                        value={oldasigneddate}
                        disabled
                        className="sameinput"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Assigned Date (Optional)"
                      name="assignment_date"
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
                    <Button type="primary" htmlType="submit">
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

export default ShowIssuedEnventory;
