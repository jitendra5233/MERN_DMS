import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
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
  message,
  Spin,
  Space,
  Dropdown,
  Menu,
  Select,
} from "antd";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
const { confirm } = Modal;
let { Option } = Select;

const OldClient = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);

  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    getOldAccountDetails();
    getSocialAccountDetails();
  }, []);

  const [getAcountdata, setAcountdata] = useState([]);
  const [getSocialAcountdata, setSocialAcountdata] = useState([]);
  const [getocialClientId, setSocialClientId] = useState([]);

  const getOldAccountDetails = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getOldAccountDetails")
      .then((result) => {
        let data = result.data;
        setAcountdata(data);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const getSocialAccountDetails = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getsocialAccountDeatils")
      .then((result) => {
        let data = result.data;
        setSocialAcountdata(data);
        let newData = [];
        data.map((x) => {
          if (x.client_id == getocialClientId) {
            newData.push({
              key: x._id,
              icon_name: x.icon_name,
              social_url: x.social_url,
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
    axios
      .post(process.env.REACT_APP_API_URL + "/create_clientAccount", data)
      .then((res) => {
        handleCancel(true);
        form.resetFields();
        setLoading(false);
        getOldAccountDetails();
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
          getOldAccountDetails();
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

  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },

    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
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
      getOldAccountDetails();
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
      onCancel() {},
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
        getOldAccountDetails();
        form.resetFields();
      })
      .catch((error) => {
        console.error(error);
      });
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
        form.resetFields();
        getOldAccountDetails();
        setIsModalOpen4(false);
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
        const formattedIconName = data.icon_name.replace("fab fa-", "");
        form.setFieldsValue({
          key: data._id,
          icon_name: formattedIconName,
          social_url: data.social_url,
          password: data.password,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleIconUpdate = (values) => {
    values.id = iconId;
    values.icon_name = iconName;
    console.log(values);
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
      .post(process.env.REACT_APP_API_URL + "/updatetoold-clientstatus", {
        id,
        client_status: "new",
      })
      .then((res) => {
        if (res.data != "") {
          openNotificationWithIcon(
            "success",
            "Account Moved to New Clients List"
          );
          getSocialAccountDetails();
          getOldAccountDetails();
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
          <span className="pageTitle">Old Clients Details</span>
        </div>
        {/* <div>
          <Button type="primary" onClick={showModal}>
            Add New Client +
          </Button>
        </div> */}
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
                          <Option value="fab fa-facebook">Facebook</Option>
                          <Option value="fab fa-instagram">Instagram</Option>
                          <Option value="fab fa-linkedin">LinkedIn</Option>
                          <Option value="fab fa-tiktok">TikTok</Option>
                          <Option value="fab fa-twitch">Twitch</Option>
                          <Option value="fab fa-twitter">Twitter</Option>
                          <Option value="fab fa-whatsapp">WhatsApp</Option>
                          <Option value="fab fa-google">Google</Option>
                          <Option value="fab fa-google-plus">
                            Google Plus
                          </Option>
                          <Option value="fab fa-youtube">YouTube</Option>
                          <Option value="fab fa-youtube-play">
                            YouTube Play
                          </Option>
                          <Option value="fab fa-youtube-square">
                            YouTube Square
                          </Option>
                          <Option value="fab fa-pinterest">Pinterest</Option>
                          <Option value="fab fa-pinterest-p">
                            Pinterest P
                          </Option>
                          <Option value="fab fa-pinterest-square">
                            Pinterest Square
                          </Option>
                          <Option value="fab fa-github">GitHub</Option>
                          <Option value="fab fa-gitlab">GitLab</Option>
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
                        label="Plateform Name"
                        name="icon_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input platform Name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter platform Name"
                          size="small"
                        />
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
                          Move to new client
                        </a>
                      </Menu.Item>
                      {/* <Menu.Item key="4">
                          <Link to={`/account-details/${x._id}`}>
                          <a rel="noopener noreferrer">
                          View Details
                        </a>
                          </Link>
                      </Menu.Item> */}
                    </Menu>
                  }
                  placement="bottomRight"
                >
                  <MoreOutlined className="setdata" />
                </Dropdown>
              </Space>
            </Space>
            <img className="set_img" alt="example" src={x.img} />
            <p className="client_name">{x.client_name}</p>
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

export default OldClient;
