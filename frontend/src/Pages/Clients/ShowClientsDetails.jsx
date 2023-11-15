import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {faFacebookF } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Upload,
  Spin,
  Space,
  Dropdown,
  Menu,
  Select,
} from "antd";
// import { library, dom } from '@fortawesome/fontawesome-svg-core'
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS#


const { confirm } = Modal;
let { Option } = Select;

const ShowClientsDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    getAccountDetails();
    getSocialAccountDetails();
  }, []);

  const [getAcountdata, setAcountdata] = useState([]);
  const [getSocialAcountdata, setSocialAcountdata] = useState([]);
  const [getocialClientId, setSocialClientId] = useState([]);

  const getAccountDetails = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getAccountDetails")
      .then((result) => {
        let data = result.data;
        setAcountdata(data);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const getSocialAccountDetails = async () => {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_URL + "/getsocialAccountDeatils"
      );
      const data = result.data;
      setSocialAcountdata(data);
      const newData = data
        .filter((x) => x.client_id === getocialClientId)
        .map((x) => ({
          key: x._id,
          icon_name: x.icon_name,
          social_url: x.social_url,
        }));
      setTableData(newData);
      return newData; // Return the updated data
    } catch (err) {
      console.log(err);
      throw err; // Throw the error to be caught in the try-catch block
    }
  };

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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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

  const showModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleOk2 = () => {
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    form.resetFields();
    setIsModalOpen2(false);
  };

  const showModal3 = () => {
    setIsModalOpen3(true);
  };

  const handleOk3 = () => {
    setIsModalOpen3(false);
  };

  const handleCancel3 = () => {
    form.resetFields();
    setIsModalOpen3(false);
  };

  const showModal4 = () => {
    setIsModalOpen4(true);
  };

  const handleOk4 = () => {
    setIsModalOpen4(false);
  };

  const handleCancel4 = () => {
    form.resetFields();
    setIsModalOpen4(false);
  };

  const handleSubmit = (values) => {
    setLoading(true);
    let data = new FormData();
    data.append("client_name", values.client_name);
    data.append("client_designation", values.client_designation);
    data.append("project_name", values.project_name);
    data.append("client_id", values.client_id);
    data.append("image", values.image[0].originFileObj);
    data.append("password", values.password);
    data.append("client_status", "new");
    axios
      .post(process.env.REACT_APP_API_URL + "/create_clientAccount", data)
      .then((res) => {
        handleCancel(true);
        form.resetFields();
        setLoading(false);
        getAccountDetails();
        openNotificationWithIcon("success", "Account Added Successfully");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        openNotificationWithIcon("error", "Failed to add department");
      });
  };

  const [clientId, setClientId] = useState([]);
  const handleIconEdit = (client_id) => {
    showModal2();
    setClientId(client_id);
  };

  const handleAddIcon = async (values) => {
    try {
      values.client_id = clientId;
      setLoading(true);
      const { client_id, icon_name, social_url, password } = values;
      const data = {
        client_id,
        icon_name,
        social_url,
        password,
      };

      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/create_clientSocilaAccount",
        data
      );
      if (response.status === 200) {
        handleCancel2(true);
        form.resetFields();
        setLoading(false);
        setTimeout(() => {
          getAccountDetails();
          getSocialAccountDetails();
        }, 500);
      } else {
        console.log("Failed to add icon:", response);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [getImage, setImage] = useState([]);
  const [getUpdateId, setUpdateId] = useState([]);

  const handleEdit = (id) => {
    showModal1();
    const clientData = getAcountdata.find((x) => x._id === id);
    setImage(clientData.img);
    setUpdateId(clientData._id);
    form.setFieldsValue({
      client_name: clientData.client_name,
      client_designation: clientData.client_designation,
      project_name: clientData.project_name,
      client_id: clientData.client_id,
      password: clientData.password,
    });
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      let data = new FormData();
      data.append("id", getUpdateId);
      data.append("client_name", values.client_name);
      data.append("client_designation", values.client_designation);
      data.append("project_name", values.project_name);
      data.append("client_id", values.client_id);
      data.append("client_status", "new");
      if (values.image) {
        data.append("image", values.image[0].originFileObj);
      }
      data.append("password", values.password);

      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/update_clientAccount",
        data
      );
      form.resetFields();
      handleCancel1(true);
      setLoading(false);
      getAccountDetails();
      openNotificationWithIcon("success", "Account updated successfully");
    } catch (error) {
      setLoading(false);
      console.log(error);
      openNotificationWithIcon("error", "Failed to update account");
    }
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
      .delete(`${process.env.REACT_APP_API_URL}/delete_account/${id}`)
      .then((response) => {
        console.log(response.data);
        const updatedData = getAcountdata.filter(
          (account) => account._id !== id
        );
        setAcountdata(updatedData);
        getAccountDetails();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleIconDelete = async (id) => {
    try {
      setSocialClientId(id);
      getSocialAccountDetails();
      showModal3();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSocialIconDelete = (id) => {
    confirm({
      title: "Delete the Issued Item",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Issue Item?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteIcon(id);
      },
    });
  };

  const deleteIcon = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/delete_socialaccount/${id}`)
      .then((response) => {
        console.log(response.data);
        const updatedData = getSocialAcountdata.filter(
          (account) => account._id !== id
        );
        setSocialAcountdata(updatedData);
        getAccountDetails();
        setIsModalOpen4(false);
        form.resetFields();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [iconId, setIconId] = useState([]);
  const [iconName, seticonName] = useState([]);
  const handleShow = (id) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getsocialmedia/${id}`)
      .then((response) => {
        showModal4();
        let data = response.data;
        setIconId(data._id);
        seticonName(data.icon_name);
        // const formattedIconName = data.icon_name.replace("fa fa-", "");
        form.setFieldsValue({
          key: data._id,
          icon_name: data.icon_name,
          social_url: data.social_url,
          password: data.password,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleIconUpdate = (values) => {
    seticonName(values.icon_name);
    values.id = iconId;
    axios
      .post(process.env.REACT_APP_API_URL + "/update-icon", values)
      .then((res) => {
        if (res !== "") {
          getSocialAccountDetails();
          setIsModalOpen4(false);
          handleCancel4();
          form.resetFields();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMove = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/update-clientstatus", {
        id,
        client_status: "old",
      })
      .then((res) => {
        if (res.data) {
          getSocialAccountDetails();
          getAccountDetails();
          openNotificationWithIcon(
            "success",
            "Account Moved to Old Clients List"
          );
        }
      })
      .catch((err) => {
        console.log(err);
        openNotificationWithIcon("error", "Failed to Move account");
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <span className="pageTitle">Clients Details</span>
        </div>
        <div>
          <Button type="primary" onClick={showModal}>
            Add New Client +
          </Button>
        </div>
      </div>

      <Modal open={isModalOpen2} onCancel={handleCancel2} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Add Social Media</span>
              </Col>
              <Col span={24}>
                <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={handleAddIcon}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        label="Social Icon"
                        name="icon_name"
                        rules={[
                          {
                            required: true,
                            message: "Please select an icon!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Icon"
                          allowClear
                          className="myAntIptSelect2"
                        >
                          <Option> Select icon</Option>
                          <Option value="fa-solid fa-facebook">Facebook - </Option>
                          <Option value="fa-solid fa-star">Instagram - </Option>
                          <Option value="fa-brands fa-discord">LinkedIn - </Option>
                          <Option value="fa-solid fa-bomb">TikTok - </Option>
                          <Option value="fa-regular fa-file">Twitch  -</Option>
                          <Option value="fa-solid fa-truck-fast">Twitter  -</Option>
                          <Option value="fa-regular fa-circle-xmark">WhatsApp - </Option>
                          <Option value="fa-solid fa-pen-nib">Google  -</Option>
                          <Option value="fa-solid fa-circle-xmark">Google Plus  -</Option>
                          <Option value="fa-regular fa-envelope">YouTube  - </Option>
                          <Option value="">
                            YouTube Play  - 
                          </Option>
                          <Option value="">
                            YouTube Square  -   </Option>
                          <Option value="">Pinterest  - </Option>
                          <Option value="">GitHub  - </Option>
                          <Option value="">GitLab  - </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="ID"
                        name="social_url"
                        rules={[
                          {
                            required: true,
                            message: "Please input Social URL",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client Id"
                          size="small"
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
                            message: "Please input client Password",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client Password"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                    {/* <Col span={12}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Delete
                        </Button>
                      </Form.Item>
                    </Col> */}
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Add New Account</span>
              </Col>
              <Col span={24}>
                <Form
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
                    <Col span={24} style={{ marginBottom: "20px" }}>
                      <Form.Item
                        label="Upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        name="image"
                        rules={[
                          {
                            required: true,
                            message: "Please input Client Image",
                          },
                        ]}
                      > 
                        <Upload listType="picture-card" accept=".jpg, .jpeg, .png" maxCount={1}>
                          <div>
                            <PlusOutlined />
                            <div
                              style={{
                                marginTop: 8,
                              }}
                            >
                              Upload
                            </div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Client name"
                        name="client_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input client name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Client Designation"
                        name="client_designation"
                        rules={[
                          {
                            required: true,
                            message: "Please input client designation",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client designation"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Project Name"
                        name="project_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input project name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter project name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Client Id"
                        name="client_id"
                        rules={[
                          {
                            required: true,
                            message: "Please input client Id",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client Id"
                          size="small"
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
                            message: "Please input client Password",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client Password"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>

      <Modal open={isModalOpen1} onCancel={handleCancel1} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Update Account</span>
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
                    <Col span={24} style={{ marginBottom: "20px" }}>
                      <Form.Item
                        label="Upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        name="image"
                      >
                        <Upload
                          listType="picture-card"
                          src={getImage}
                          maxCount={1}
                        >
                          <div>
                            <PlusOutlined />
                            <div
                              style={{
                                marginTop: 8,
                              }}
                            >
                              Upload
                            </div>
                          </div>
                        </Upload>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Client name"
                        name="client_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input client name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Client Designation"
                        name="client_designation"
                        rules={[
                          {
                            required: true,
                            message: "Please input client designation",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client designation"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Project Name"
                        name="project_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input project name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter project name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Client Id"
                        name="client_id"
                        rules={[
                          {
                            required: true,
                            message: "Please input client Id",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client Id"
                          size="small"
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
                            message: "Please input client Password",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter client Password"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
      <Modal open={isModalOpen4} onCancel={handleCancel4} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Social Media Deatils</span>
              </Col>
              <Col span={24}>
                <Form
                  form={form}
                  name="basic"
                  layout="vertical"
                  onFinish={handleIconUpdate}
                  initialValues={{
                    remember: true,
                  }}
                  autoComplete="off"
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        label="Social Icon"
                        name="icon_name"
                        rules={[
                          {
                            required: true,
                            message: "Please select an icon!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Icon"
                          allowClear
                          className="myAntIptSelect2"
                        >
                          <Option> Select icon</Option>
                          <Option value="fa fa-facebook">Facebook </Option>
                          <Option value="fa fa-instagram">Instagram</Option>
                          <Option value="fa fa-linkedin">LinkedIn</Option>
                          <Option value="fa fa-tiktok">TikTok</Option>
                          <Option value="fa fa-twitch">Twitch</Option>
                          <Option value="fa fa-twitter">Twitter</Option>
                          <Option value="fa fa-whatsapp">WhatsApp</Option>
                          <Option value="fa fa-google">Google</Option>
                          <Option value="fa fa-google-plus">Google Plus</Option>
                          <Option value="fa fa-youtube">YouTube</Option>
                          <Option value="fa fa-youtube-play">
                            YouTube Play
                          </Option>
                          <Option value="fa fa-youtube-square">
                            YouTube Square
                          </Option>
                          <Option value="fa fa-pinterest">Pinterest</Option>
                          <Option value="fa fa-pinterest-p">Pinterest P</Option>
                          <Option value="fa fa-pinterest-square">
                            Pinterest Square
                          </Option>
                          <Option value="fa fa-github">GitHub</Option>
                          <Option value="fa fa-gitlab">GitLab</Option>
                          <Option value="fas fa-phone">Phone</Option>
                          <Option value="fas fa-phone-square">
                            Phone Square
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="ID"
                        name="social_url"
                        rules={[
                          {
                            required: true,
                            message: "Please input ID",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter platform ID"
                          size="small"
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
                            message: "Please input password",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter platform password"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Update
                        </Button>
                        <Button
                          type="primary"
                          onClick={() => handleSocialIconDelete(iconId)}
                          danger
                        >
                          Delete
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>

      <Row
        gutter={[
          {
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          },
          20,
        ]}
      >
        {getAcountdata.map((x) => (
          <Card key={x._id} className="card_style">
            <Space direction="vertical">
              <Space wrap>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="1">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleDelete(x._id)}
                        >
                          Delete
                        </a>
                      </Menu.Item>
                      <Menu.Item key="2">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleEdit(x._id)}
                        >
                          Edit
                        </a>
                      </Menu.Item>
                      <Menu.Item key="3">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleMove(x._id)}
                        >
                          Move to old client
                        </a>
                      </Menu.Item>
                      <Menu.Item key="4">
                        <Link to={`/account-details/${x._id}`}>
                          <a rel="noopener noreferrer">View Details</a>
                        </Link>
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomRight"
                >
                  <MoreOutlined className="setdata" />
                </Dropdown>
              </Space>
            </Space>
            <img className="set_img" alt="example" src={x.img} />
            <p className="client_name">
               <Link to={`/account-details/${x._id}`}>
                          {/* <a rel="noopener noreferrer">View Details</a> */}
                        {x.client_name}
                        </Link>
                        </p>
            <p className="client-designation">{x.client_designation}</p>
            <p className="project-name">{x.project_name}</p>
            {getSocialAcountdata.map((y) => {
              if (x._id === y.client_id) {
                return (
                  <li key={y._id} className="list-group-item setplusonedata">
                    <a target="_blank" onClick={() => handleShow(y._id)}>
                      <i id="setsize" className={y.icon_name}></i>
                    </a>
                  </li>
                );
              }
              return null;
            })}
            {/* <DeleteOutlined className="setplusdata"   onClick={() => handleIconDelete(x._id)} /> */}
            <PlusOutlined
              className="setplusdata"
              onClick={() => handleIconEdit(x._id)}
            />
          </Card>
        ))}
      </Row>
    </div>
  );
};

export default ShowClientsDetails;
