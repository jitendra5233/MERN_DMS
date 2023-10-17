import React, { useEffect, useState } from "react";
import {
  PlusOutlined,
  ShareAltOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const PostionCard = ({
  name,
  open_position,
  experience,
  type,
  salary_range,
  location,
  date,
  slug1,
  slug2,
}) => {
  const navigate = useNavigate();

  const handlelinkOpen = (slug1, slug2) => {
    navigate("/show-candidate/" + slug1 + "/" + slug2);
  };

  return (
    <div>
      <Card
        style={{
          borderRadius: "10px",
          padding: "0",
          width: "330px",
          cursor: "pointer",
        }}
        className="DepCard"
        onClick={() => handlelinkOpen(slug1, slug2)}
      >
        <div style={{ padding: "20px" }}>
          <Row>
            <Col span={24}>
              <span className="potionCardTitle">{name}</span>
            </Col>
            {/* <Col span={12} style={{ textAlign: "end" }}>
              <span
                className="postionCardSubtitle"
                style={{ margin: "0 10px" }}
              >
                Share form
              </span>
              <ShareAltOutlined />
            </Col> */}
            <Col span={12}>
              <span className="postionCardSubtitle">Candidate</span>
            </Col>
          </Row>
        </div>
        <div
          style={{
            backgroundColor: "#F5F6FA",
            margin: "0 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px",
            }}
          >
            <div>Total</div>
            <div style={{ fontSize: "16px", fontWeight: "700" }}>
              {open_position}
            </div>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <div>
            <Row gutter={[0, 20]}>
              <Col span={12}>Experience Required:</Col>
              <Col span={12} style={{ textAlign: "end" }}>
                {experience}{" "}
              </Col>
              <Col span={12}>Hiring Status:</Col>
              <Col span={12} style={{ textAlign: "end" }}>
                {type}
              </Col>
              <Col span={12}>Salary Range:</Col>
              <Col span={12} style={{ textAlign: "end" }}>
                {salary_range}
              </Col>
              <Col span={12}>Location:</Col>
              <Col span={12} style={{ textAlign: "end" }}>
                {location}
              </Col>
              <Col span={12}>Date:</Col>
              <Col span={12} style={{ textAlign: "end" }}>
                {date}
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ShowPostions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [allDep, setAllDep] = useState([]);
  const r_prams = useParams();

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
      .post(process.env.REACT_APP_API_URL + "/getDepartmentPostions", {
        id: r_prams.id,
      })
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
    values.ref_id = r_prams.id;
    values.slug = createSlug(values.name);
    axios
      .post(process.env.REACT_APP_API_URL + "/addDepartmentPostions", values)
      .then((res) => {
        setLoading(false);
        handleCancel();
        form.resetFields();
        openNotificationWithIcon("success");
        getDepartment();
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
          <span className="pageTitle">Open Position</span>
        </div>
        <div>
          <Button type="primary" onClick={showModal}>
            Create new position +
          </Button>
        </div>
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Add New position</span>
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
                    <Col span={12}>
                      <Form.Item
                        label="Position name"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Position name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Position name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Total No of Positions open"
                        name="open_position"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Positions open No",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Ex. 10"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Experience"
                        name="experience"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Required Experience",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Experience Required"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Hiring Status"
                        name="type"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Hiring Status",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Hiring Status"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Salary Range"
                        name="salary_range"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Salary Range",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Salary Range"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Location"
                        name="location"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Location",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Location"
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
          let {
            name,
            open_position,
            experience,
            type,
            salary_range,
            location,
            slug,
          } = x;

          return (
            <Col xs={24} sm={24} md={8} lg={8}>
              <PostionCard
                name={name}
                open_position={open_position}
                experience={experience}
                type={type}
                salary_range={salary_range}
                location={location}
                date={new Date(x.createdAt).toLocaleDateString()}
                slug1={r_prams.id}
                slug2={slug}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ShowPostions;
