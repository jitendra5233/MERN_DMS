import { DownSquareOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Avatar,
  notification,
  Upload,
  message,
  Spin,
  Empty,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DepartmentCard = ({ img, name, slug }) => {
  const navigate = useNavigate();

  const handlelinkOpen = (slug) => {
    navigate("/show-postion/" + slug);
  };
  return (
    <div>
      <Card
        style={{ borderRadius: "10px", padding: "0", cursor: "pointer" }}
        className="DepCard"
        onClick={() => handlelinkOpen(slug)}
      >
        <div>
          <div style={{ padding: "60px 70px", textAlign: "center" }}>
            <DownSquareOutlined className="hiringDashboardActionIcon" />
            <img src={img} style={{ height: "100px", width: "100px" }} />
          </div>
          <div style={{ backgroundColor: "#F5F6FA" }}>
            <div
              style={{
                textAlign: "center",
                padding: "15px",
              }}
            >
              <span>{name}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const HiringDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [allDep, setAllDep] = useState([]);

  useEffect(() => {
    getDepartment();
  }, []);

  const openNotificationWithIcon = (type) => {
    if (type === "error") {
      api[type]({
        message: "Server Error",
        description: "",
      });
    } else {
      api[type]({
        message: "Department Added Successful",
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

  const getDepartment = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getDepartment")
      .then((res) => {
        setAllDep(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createSlug = (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = (values) => {
    setLoading(true);
    let data = new FormData();
    data.append("name", values.name);
    data.append("slug", createSlug(values.name));
    data.append("image", values.image[0].originFileObj);
    axios
      .post(process.env.REACT_APP_API_URL + "/addDepartment", data)
      .then((res) => {
        setLoading(false);
        handleCancel();
        form.resetFields();
        if (res.data.status === true) {
          openNotificationWithIcon("success");
          getDepartment();
        } else {
          openNotificationWithIcon("error");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
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
          <span className="pageTitle">Department in Techies Infotech</span>
        </div>
        <div>
          <Button type="primary" onClick={showModal}>
            Add New Department +
          </Button>
        </div>
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Add New Department</span>
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
                    <Col span={24} style={{ marginBottom: "20px" }}>
                      <Form.Item
                        label="Upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        name="image"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Department Image",
                          },
                        ]}
                      >
                        <Upload listType="picture-card" maxCount={1}>
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
                    <Col span={24}>
                      <Form.Item
                        label="Department name"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Department name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Department name"
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

      {allDep.length == 0 ? (
        <div style={{ padding: "8rem 0" }}>
          <Empty />
        </div>
      ) : (
        ""
      )}

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
        {allDep.map((x, i) => {
          let { img, name, slug } = x;
          return (
            <Col xs={24} sm={24} md={8} lg={6} key={i}>
              <DepartmentCard img={img} name={name} slug={slug} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default HiringDashboard;
