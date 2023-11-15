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
  DatePicker,
} from "antd";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
dayjs.extend(customParseFormat);
const { Title } = Typography;
const { confirm } = Modal;

const ShowExpense = () => {
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    getExpense();
  }, []);

  const getExpense = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/expense")
      .then((result) => {
        let data = result.data;
        let newData = [];
        data.map((x) => {
          newData.push({
            key: x._id,
            item_name: x.item_name,
            buying_date: new Date(x.buying_date).toLocaleDateString(),
            quantity: x.quantity,
            paid_amount: x.paid_amount,
            r_paidamt: x.r_paidamt,
            r_getamt: x.r_getamt,
          });
        });
        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [updateItemId, srtUpdateIyemId] = useState([]);
  const [updateDate, setUpdateDate] = useState([]);
  const [OldQuantity, setOldQuantity] = useState([]);

  const handleEdit = (id) => {
    showModal();
    srtUpdateIyemId(id);
    tableData.map((x) => {
      if (x.key == id) {
        setUpdateDate(new Date(x.buying_date).toLocaleDateString());
        form.setFieldsValue({
          item_name: x.item_name,
          quantity: x.quantity,
          paid_amount: x.paid_amount,
          r_paidamt: x.r_paidamt,
          r_getamt: x.r_getamt,
        });
        setOldQuantity(x.quantity);
      }
    });
  };

  const handleUpdate = (values) => {
    values.id = updateItemId;
    if (values.buying_date == undefined) {
      values.buying_date = updateDate;
    }
    if (values.quantity > OldQuantity) {
      values.newPurchase = values.quantity - OldQuantity;
    } else {
      values.newPurchase = 0;
    }
    axios
      .post(process.env.REACT_APP_API_URL + "/update-expense", values)
      .then((res) => {
        if (res != "") {
          getExpense();
          setIsModalOpen(false);
          handleCancel();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleDelete = (itemId) => {
    confirm({
      title: "Delete the Expense",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Expense?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteItem(itemId);
      },
    });
  };

  const deleteItem = (itemId) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/delete/${itemId}`)
      .then((response) => {
        console.log(response.data);
        // Update tableData after deletion
        setTableData((prevData) =>
          prevData.filter((item) => item.key !== itemId)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    {
      title: "Name of item",
      dataIndex: "item_name",
      key: "item_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Buying Date",
      dataIndex: "buying_date",
      key: "buying_date",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount Paid",
      dataIndex: "paid_amount",
      key: "paid_amount",
    },

    {
      title: "Remaining amount to pay",
      dataIndex: "r_paidamt",
      key: "r_paidamt",
    },
    {
      title: "Remaining amount to get",
      dataIndex: "r_getamt",
      key: "r_getamt",
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

          <a onClick={() => handleDelete(record.key)}>
            {" "}
            <span>
              <DeleteOutlined style={{ cursor: "pointer" }} />
            </span>
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="m12r">
        <Title level={3} className="Expensecolor">
          All Expenses
        </Title>
        <Link to={`/add-expense`}>
          <button className="Expensecolorbtn">Add Expense +</button>
        </Link>
        <Link to={`/show-expenserecord`}>
          <button className="filtercolorbtn">
            Show Expense Record <i class="fa fa-eye" aria-hidden="true"></i>
          </button>
        </Link>
        {/* <button className="filtercolorbtn">
          Filter <i class="fa fa-filter" aria-hidden="true"></i>
        </button> */}
      </div>

      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <div style={{ padding: "30px" }}>
          <Row>
            <Col span={24} style={{ marginBottom: "30px" }}>
              <span className="popupTitle">Update Expense </span>
            </Col>

            <Col span={24}>
              <Form
                form={form}
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
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter  your Name Of item"
                        size="small"
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
                          message: "Please input your Quantity",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter your Quantity"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Amount Paid"
                      name="paid_amount"
                      rules={[
                        {
                          required: true,
                          message: "Please input paid amount",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter paid amount"
                        size="small"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Remaining Paid Amount"
                      name="r_paidamt"
                      rules={[
                        {
                          required: true,
                          message: "Please input Remaining Paid Amount",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter Remaining Paid Amount"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Remaining Get Amount"
                      name="r_getamt"
                      rules={[
                        {
                          required: true,
                          message: "Please input Remaining Get Amount",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter Remaining Get Amount"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Old Buying Date">
                      <Input
                        value={updateDate}
                        disabled
                        className="sameinput"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Buying Date"
                      name="buying_date"
                      hasFeedback
                    >
                      <DatePicker style={{ width: "100%" }} />
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

export default ShowExpense;
