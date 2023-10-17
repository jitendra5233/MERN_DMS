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
  Space,
  Select,
} from "antd";
const { TextArea } = Input;
const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const ShowLossDamage = () => {
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
    getInventory();
  }, []);

  const getInventory = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/GetDamageItem")
      .then((result) => {
        let data = result.data;
        let newData = [];
        console.log(data);
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
            repair_status: x.repair_status,
            comment: x.comment,
          });
        });
        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [damageItemId, setdamageItemId] = useState([]);
  const handleDamage = (id) => {
    showModal();
    setdamageItemId(id);
    tableData.map((x) => {
      if (x.key == id) {
        console.log(x);
        form.setFieldsValue({
          key: x._id,
          item_name: x.item_name,
          serial_number: x.serial_number,
          assignment_date: new Date(x.assignment_date).toLocaleDateString(),
          quantity: x.quantity,
          emp_name: x.emp_name,
          emp_code: x.emp_code,
          job_title: x.job_title,
          repair_status: x.repair_status,
          comment: x.comment,
        });
      }
    });
  };

  const handleRepaire = (values) => {
    values.repair_count = 0;
    axios
      .post(process.env.REACT_APP_API_URL + "/addTorepair", values)
      .then((res) => {
        form.resetFields();
        setIsModalOpen(false);
        getInventory();
        // setLoading(false);
      })
      .catch((err) => {
        // setLoading(false);
        console.log(err);
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
      title: "Repair Status",
      dataIndex: "repair_status",
      key: "repair_status",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          {record.repair_status !== "completely_demage" && (
            <Space wrap>
              <Button
                type="primary"
                block
                onClick={() => handleDamage(record.key)}
              >
                Repaire
              </Button>
            </Space>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="m12r">
        <Title level={3} className="Expensecolor">
          Items Not Found
        </Title>
        <button className="filtercolorbtn">Filter</button>
      </div>
      <div>
        <Table columns={columns} dataSource={tableData} />
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
              <span className="popupTitle">Add to Repaire</span>
            </Col>

            <Col span={24}>
              <Form
                form={form}
                name="basic"
                layout="vertical"
                onFinish={handleRepaire}
                initialValues={{
                  remember: true,
                }}
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
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter Employee Name"
                        disabled
                      />
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
                          message: "Please input your Quantity",
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
                  <Col span={12}>
                    <Form.Item
                      label="Repair Status"
                      name="repair_status"
                      rules={[
                        {
                          required: true,
                          message: "Please select Repair status!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select Repair status"
                        allowClear
                        // className="myAntIptSelect2"
                      >
                        <Option value="Under Process">Under Process</Option>
                        <Option value="Hold">Hold</Option>
                        <Option value="completely_demage">
                          Completely Damage
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="comment"
                      label="Comment"
                      rules={[
                        { required: true, message: "Please input Comment's" },
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
    </div>
  );
};

export default ShowLossDamage;
