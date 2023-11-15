import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
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
  AutoComplete,
  Select,
} from "antd";
const { Option } = Select;
const { Title } = Typography;
const { confirm } = Modal;
const ShowEnventoryCategory = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
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

  const [isModalOpen1, setIsModalOpen1] = useState(false);

  const showModal1 = () => {
    setIsModalOpen1(true);
  };
  const handleOk1 = () => {
    setIsModalOpen1(false);
  };
  const handleCancel1 = () => {
    form.resetFields();
    setIsModalOpen1(false);
  };

  useEffect(() => {
    getItemCategory();
  }, []);

  const getItemCategory = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getItemCategory")
      .then((result) => {
        let data = result.data;
        let newData = [];
        data.map((x) => {
          const createdAt = new Date(x.createdAt);
          const updatedAt = new Date(x.updatedAt);
          const formattedCreatedAt = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
          const formattedUpdatedAt = `${updatedAt.toLocaleDateString()} ${updatedAt.toLocaleTimeString()}`;
          newData.push({
            key: x._id,
            category_name: x.category_name,
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
          });
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   const [updateItemId, setUpdateItemId] = useState([]);

  //   const handleEdit = (id) => {
  //     showModal1();
  //     setUpdateItemId(id);
  //     tableData.map((x) => {
  //       if (x.key === id) {
  //         form.setFieldsValue({
  //           key: x._id,
  //           category_name: x.category_name,
  //         });
  //       }
  //     });
  //   };

  //   const handleUpdate = (values) => {
  //     values.id = updateItemId;
  //     axios
  //       .post(process.env.REACT_APP_API_URL + "/update-item", values)
  //       .then((res) => {
  //         if (res !== "") {
  //           getItemCategory();
  //           setIsModalOpen1(false);
  //           handleCancel1();
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };

  const onFinishFailed1 = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleDelete = (itemId) => {
    confirm({
      title: "Delete the Issued Item",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Issue Item?",
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
      .delete(`${process.env.REACT_APP_API_URL}/delete_category/${itemId}`)
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

  const handleSubmit = (values) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/add-category", values)
      .then((res) => {
        if (res != "") {
          getItemCategory();
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

  const columns = [
    {
      title: "Category Name",
      dataIndex: "category_name",
      key: "category_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Creation date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
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
          Total Category
        </Title>
        <button className="Expensecolorbtn" onClick={showModal}>
          Add New Category +
        </button>
      </div>

      <Modal
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <div style={{ padding: "30px" }}>
          <Row>
            <Col span={24} style={{ marginBottom: "30px" }}>
              <span className="popupTitle">Add New Category</span>
            </Col>

            <Col span={24}>
              <Form
                form={form}
                name="basic"
                layout="vertical"
                initialValues={{
                  remember: true,
                }}
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      label="Category Name"
                      name="category_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Category",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter your Category"
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

      {/* <Modal
        visible={isModalOpen1}
        onOk={handleOk1}
        onCancel={handleCancel1}
        footer={[]}
      >
        <div style={{ padding: "30px" }}>
          <Row>
            <Col span={24} style={{ marginBottom: "30px" }}>
              <span className="popupTitle">Update Item</span>
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
                onFinishFailed={onFinishFailed1}
                autoComplete="off"
              >
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      label="Category Name"
                      name="category_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Category",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter your Category"
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
      </Modal> */}
      <div>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default ShowEnventoryCategory;
