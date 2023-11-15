import { useState, useEffect } from "react";
import {
  Button,
  Select,
  Col,
  Form,
  Input,
  Row,
  Typography,
  DatePicker,
  notification,
  AutoComplete,
} from "antd";
import axios from "axios";
import ShowIssuedEnventory from "./ShowIssuedEnventory";
import moment from "moment";
const { Title } = Typography;
const { Option } = Select;

const AddIssuedEnventory = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [ShowIssuedEnventoryKey, setShowIssuedEnventoryKey] = useState(
    Date.now()
  );
  useEffect(() => {
    getUsers();
    getInventory();
  }, []);

  const [itemData, setItemData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState([]);

  const getInventory = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getItem")
      .then((result) => {
        let data = result.data;
        let newData = [];
        newData = data;
        setItemData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [empName, setEmpName] = useState([]);
  const [empId, setEmpId] = useState([]);
  console.log(empId);
  const handleChange = (value, option) => {
    let userId = option.key;
    axios
      .post(process.env.REACT_APP_API_URL + "/getUserData", { userId })
      .then((res) => {
        if (res.data !== "") {
          let data = res.data;
          var emp_Id = data._id;
          var emp_name = data.f_name + " " + data.l_name;
          form.setFieldsValue({
            emp_code: data.emp_code,
            job_title: data.job_title,
          });
          setEmpId(emp_Id);
          setEmpName(emp_name);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [updatedItemName, setUpdatedItemName] = useState([]);
  const [updateAvailableItem, setUpdatedAvailableItem] = useState([]);
  const [updatedItemId, setUpdatedItemId] = useState([]);

  const handleUpdateItem = (value, option) => {
    let item_id = option.key;
    axios
      .post(process.env.REACT_APP_API_URL + "/getItemData", { item_id })
      .then((res) => {
        if (res.data !== "") {
          let data = res.data;
          setUpdatedItemName(data.item_name);
          setUpdatedAvailableItem(data.availableItem);
          setUpdatedItemId(item_id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [userData, setUserData] = useState([]);

  const getUsers = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/usres")
      .then((result) => {
        let data = result.data;
        let newData = [];
        newData = data;
        setUserData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinish = (values) => {
    values.emp_name = empName;
    values.itemId = updatedItemId;
    values.item_name = updatedItemName;
    values.item_id = updatedItemId;
    values.emp_id = empId;
    setLoading(true);
    if (values.quantity <= updateAvailableItem) {
      axios
        .post(process.env.REACT_APP_API_URL + "/issued_enventory", values)
        .then((res) => {
          setLoading(false);
          form.resetFields();
          setShowIssuedEnventoryKey(Date.now());
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  const handleKeyUp = (event) => {
    if (event.target.value > updateAvailableItem) {
      form.setFieldsValue({
        quantity: "",
      });
      alert("Available Item Only" + " " + +updateAvailableItem + "");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSearch = (value) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/items/search?query=${value}`)
      .then((response) => {
        const items = response.data;
        setSuggestions(items);
      })
      .catch((error) => {
        console.error(error);
      });
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

  return (
    <div>
      <div className="mainContainer">
        <Row>
          <Col span={24}>
            <div className="mainTitle">
              <Title level={5} className="Expensecolor">
                Issue New Item
              </Title>
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
                      placeholder="Select Item"
                      onChange={handleUpdateItem}
                      onSearch={handleSearch}
                    >
                      {suggestions.map((option) => (
                        <Option key={option._id} value={option.item_name}>
                          {option.item_name}
                        </Option>
                      ))}
                    </AutoComplete>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Serial Number"
                    name="serial_number"
                    rules={[
                      {
                        required: true,
                        message: "Please input  Serial number!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
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
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Job Title"
                    name="job_title"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Job Title!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
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
                    <DatePicker
                      style={{ width: "100%" }}
                      disabledDate={(current) =>
                        current && current < moment().startOf("day")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Quantity"
                    name="quantity"
                    initialValue={1}
                    onKeyUp={handleKeyUp}
                    rules={[
                      {
                        required: true,
                        message: "Please input Quantity!",
                      },
                    ]}
                  >
                    <Input className="quantity" value={1} disabled />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
      <ShowIssuedEnventory key={ShowIssuedEnventoryKey} />
    </div>
  );
};

export default AddIssuedEnventory;
