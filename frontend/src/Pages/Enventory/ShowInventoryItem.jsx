import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
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
const ShowIssuedEnventory = () => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [getCategory, setCategory] = useState([]);
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
    getInventory();
    getItemCategory();
  }, []);

  const getInventory = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getItem")
      .then((result) => {
        let data = result.data;
        let newData = [];
        data.map((x) => {
          const createdAt = new Date(x.createdAt);
          const updatedAt = new Date(x.updatedAt);
          const formattedCreatedAt = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
          const formattedUpdatedAt = `${updatedAt.toLocaleDateString()} ${updatedAt.toLocaleTimeString()}`;
          if (x.category_name != "Category Deleted") {
            newData.push({
              key: x.key,
              item_name: x.item_name,
              quantity: x.quantity,
              lossDamageItem: x.lossDamageItem,
              availableItem: x.availableItem,
              createdAt: formattedCreatedAt,
              updatedAt: formattedUpdatedAt,
              category_id: x.category_id,
              category_name: x.category_name,
            });
          } else {
            newData.push({
              key: x.key,
              item_name: x.item_name,
              quantity: x.quantity,
              lossDamageItem: x.lossDamageItem,
              availableItem: x.availableItem,
              createdAt: formattedCreatedAt,
              updatedAt: formattedUpdatedAt,
              category_name: x.category_name,
            });
          }
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getItemCategory = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getItemCategory")
      .then((result) => {
        let data = result.data;
        let newData = [];
        data.map((x) => {
          newData.push({
            id: x._id,
            category_name: x.category_name,
          });
        });

        setCategory(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [updateItemId, setUpdateItemId] = useState([]);
  const [updateAvailableItem, setUpdateAvailableItem] = useState([]);
  const [getOldTotalItem, setOldTotalItem] = useState([]);
  const [getsuggestedId, setSuggestedId] = useState([]);
  const [categoryId, setcategoryId] = useState([]);

  // const [OldQuantity, setOldQuantity] = useState([]);

  const handleEdit = (id) => {
    showModal1();
    setUpdateItemId(id);
    tableData.map((x) => {
      if (x.key === id) {
        // setOldQuantity(x.quantity);
        form1.setFieldsValue({
          key: x._id,
          item_name: x.item_name,
          quantity: x.quantity,
          availableItem: x.availableItem,
          category_name: x.category_id,
        });
        setcategoryId(x.category_id);
        setUpdateAvailableItem(x.availableItem);
        setOldTotalItem(x.quantity);
      }
    });
  };

  const handleUpdate = (values) => {
    values.category_id = values.category_name;
    values.id = updateItemId;
    let AvailableItem = values.quantity - getOldTotalItem;
    let FinalAvailableItem = values.availableItem + AvailableItem;
    values.availableItem = FinalAvailableItem;
    if (values.quantity > getOldTotalItem) {
      values.newPurchase = AvailableItem;
    } else {
      values.newPurchase = 0;
    }
    axios
      .post(process.env.REACT_APP_API_URL + "/update-item", values)
      .then((res) => {
        if (res !== "") {
          getInventory();
          setIsModalOpen1(false);
          handleCancel1();
          form1.resetFields();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      .delete(`${process.env.REACT_APP_API_URL}/delete_item/${itemId}`)
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
    values.category_id = values.category_name;
    values.availableItem = values.quantity;
    values.lossDamageItem = 0;
    if (getsuggestedId != undefined) {
      values.setSuggestedId = getsuggestedId;
    }
    if (getsuggestedId == undefined) {
      values.setSuggestedId = 0;
    }
    axios
      .post(process.env.REACT_APP_API_URL + "/add-item", values)
      .then((res) => {
        if (res != "") {
          getInventory();
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

  const handleSearch = (value) => {
    // Fetch item suggestions based on the user's input
    axios
      .get(`${process.env.REACT_APP_API_URL}/items/searchItem?query=${value}`)
      .then((response) => {
        const items = response.data;
        console.log(items);
        setSuggestions(items);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSaveId = (value, option) => {
    if (option.key != "undefined") {
      setSuggestedId(option.key);
    } else {
      setSuggestedId(0);
    }
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Item Category",
      dataIndex: "category_name",
      key: "category_name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Available Item",
      dataIndex: "availableItem",
      key: "availableItem",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Total Item",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Loss/Damage",
      dataIndex: "lossDamageItem",
      key: "lossDamageItem",
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
  ];

  return (
    <div>
      <div className="m12r">
        <Title level={3} className="Expensecolor">
          Total Items
        </Title>
        <button className="Expensecolorbtn" onClick={showModal}>
          Add New Items +
        </button>
        <Link to={`/add-issued`}>
          <button className="filtercolorbtn">Assign Item +</button>
        </Link>
        <Link to={`/show_itemrecord`}>
          <button className="filtercolorbtn">
            Show Record <i class="fa fa-eye" aria-hidden="true"></i>
          </button>
        </Link>
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
              <span className="popupTitle">Add New Items</span>
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
                      label="Name of Item"
                      name="item_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input a valid item name!",
                        },
                      ]}
                    >
                      <AutoComplete
                        placeholder="Input Item"
                        onSearch={handleSearch}
                        onChange={handleSaveId}
                      >
                        {suggestions.map((option) => (
                          <Option key={option._id} value={option.item_name}>
                            {option.item_name}
                          </Option>
                        ))}
                      </AutoComplete>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      label="Name of Category"
                      name="category_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input a valid Category name!",
                          trigger: "change",
                        },
                      ]}
                    >
                      <Select placeholder="Input Category">
                        {getCategory.map((option) => (
                          <Option value={option.id}>
                            {option.category_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      label="Total Item"
                      name="quantity"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Total Item Quantity",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter your Total Item Quantity"
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

      <Modal
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
                form={form1}
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
                  <Col span={24}>
                    <Form.Item
                      label="Name of Category"
                      name="category_name"
                      rules={[
                        {
                          required: true,
                          message: "Please input a valid Category name!",
                          trigger: "change",
                        },
                      ]}
                    >
                      <Select placeholder="Input Category">
                        {getCategory.map((option) => (
                          <Option
                            value={option.id}
                            selected={option.id === categoryId}
                          >
                            {option.category_name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Total Item"
                      name="quantity"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Total Item Quantity",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter your Total Item Quantity"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Available Item"
                      name="availableItem"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Available Item Quantity",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        className="myAntIpt2"
                        placeholder="Enter your Available Item Quantity"
                        disabled
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
