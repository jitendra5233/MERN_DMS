import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Input,
  List,
  Modal,
  Row,
  Spin,
  notification,
} from "antd";
import {
  ArrowLeftOutlined,
  BackwardFilled,
  EllipsisOutlined,
  StepBackwardFilled,
} from "@ant-design/icons";
import EmpMessage from "./EmpMessage";
import { useSelector } from "react-redux";
import axios from "axios";
import EmpMessageRoot from "./EmpMessageRoot";

const EmpMessContainer = ({ title, type, anonymous, data }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messDataRoot, setMessDataRoot] = useState([]);
  const [ShowReply, setShowReply] = useState(false);
  const [activeMessage, setActiveMessage] = useState();

  const [api, contextHolder] = notification.useNotification();
  let selector = useSelector((state) => state.persistedReducer.user);

  useEffect(() => {
    setMessDataRoot(data);
  });

  const items = [
    {
      key: "1",
      label: <div onClick={() => showModal()}>New Message</div>,
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (values) => {
    console.log(title);

    values.ref_id = selector.token2;
    values.type = type;
    values.anonymous = anonymous;

    axios
      .post(process.env.REACT_APP_API_URL + "/addFeedbackIssues", values)
      .then((result) => {
        handleCancel();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const ShowMesages = (data) => {
    setShowReply(true);
    setActiveMessage(data);
    console.log(data);
  };

  return (
    <div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Add New Feedback/Issues</span>
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
                        label="Title"
                        name="title"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Title",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Title"
                          size="small"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Description",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input.TextArea
                          className="myAntIpt2"
                          placeholder="Enter your Description"
                          size="small"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">
                          Add
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
      <div className="EmpMessageContainer" style={{ display: "flex" }}>
        <div>
          <span className="EmpTabHeading">{title}</span>
        </div>
        <div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <EllipsisOutlined />
          </Dropdown>
        </div>
      </div>
      <div
        className="EmpMessageContainer"
        style={{
          margin: "30px 0",
        }}
      >
        {ShowReply == false ? (
          <List itemLayout="horizontal">
            {messDataRoot.map((x) => {
              return (
                <EmpMessageRoot
                  message={x.title}
                  photo={selector.photo}
                  anonymous={anonymous}
                  ShowMesages={() => ShowMesages(x)}
                  dateTime={`${new Date(
                    x.createdAt
                  ).toDateString()}  ${new Date(
                    x.createdAt
                  ).toLocaleTimeString()}`}
                />
              );
            })}
          </List>
        ) : (
          <div>
            <div style={{ display: "flex" }}>
              <div>
                <ArrowLeftOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowReply(false)}
                />
              </div>
              <div style={{ textAlign: "center", width: "100%" }}>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  {activeMessage.title}
                </span>
              </div>
            </div>
            <div>
              <EmpMessage message={activeMessage.description} />
            </div>
            <List itemLayout="horizontal">
              {messDataRoot.map((x) => {
                return (
                  <EmpMessageRoot
                    message={x.title}
                    photo={selector.photo}
                    anonymous={anonymous}
                    ShowMesages={() => ShowMesages(x)}
                    dateTime={`${new Date(
                      x.createdAt
                    ).toDateString()}  ${new Date(
                      x.createdAt
                    ).toLocaleTimeString()}`}
                  />
                );
              })}
            </List>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpMessContainer;
