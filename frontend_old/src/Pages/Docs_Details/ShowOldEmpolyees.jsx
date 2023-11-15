import {
  EllipsisOutlined,
  FileDoneOutlined,
  LineChartOutlined,
  MoreOutlined,
  PlusOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
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
  Empty,
  Select,
  Dropdown,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const EmployeeCard = ({
  id,
  img,
  name,
  designation,
  ref_id = 0,
  getEmployee,
}) => {
  const navigate = useNavigate();

  const openPage = (name) => {
    navigate(name + "/" + (ref_id != null ? ref_id : id));
  };

  const SaveAsOldEmployee = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/saveToNewEmp", { id })
      .then((result) => {
        getEmployee();
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const items = [
    {
      key: "1",
      label: <Link onClick={() => SaveAsOldEmployee()}>Move to New</Link>,
    },
  ];

  return (
    <div>
      <Card
        style={{
          borderRadius: "10px",
          padding: "1rem",
          width: "250px",
          backgroundColor: "#F0F1F6",
        }}
        className="DepCard"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {img == undefined ? (
              <img
                src="./user1.png"
                style={{ height: "72px", width: "72px", borderRadius: "100%" }}
              />
            ) : (
              <img
                src={img}
                style={{ height: "72px", width: "72px", borderRadius: "100%" }}
              />
            )}
          </div>
          <div>
            <Dropdown
              menu={{ items }}
              placement="bottomLeft"
              arrow
              trigger={["click"]}
            >
              <MoreOutlined style={{ fontSize: "15px", cursor: "pointer" }} />
            </Dropdown>
          </div>
        </div>
        <div style={{ margin: "20px 0" }}>
          <div>
            <span className="potionCardTitle" style={{ cursor: "pointer" }}>
              {name}
            </span>
          </div>
          <div>
            <span className="postionCardSubtitle"> {designation} </span>
          </div>
        </div>
        <div>
          <div>
            <span className="employeeCardTxt">Status</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPage("/employee-details")}
            >
              <div>
                <ProfileOutlined style={{ fontSize: "20px" }} />
              </div>
              <div className="employeeCardTxt">Details</div>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPage("/employee-docs")}
            >
              <div>
                <FileDoneOutlined style={{ fontSize: "20px" }} />
              </div>
              <div className="employeeCardTxt">Documents</div>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPage("/employee-kpi")}
            >
              <div>
                <LineChartOutlined style={{ fontSize: "20px" }} />
              </div>
              <div className="employeeCardTxt">KPI</div>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => openPage("/employee-appraisal")}
            >
              <div>
                <LineChartOutlined style={{ fontSize: "20px" }} />
              </div>
              <div className="employeeCardTxt">Appraisal</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ShowOldEmpolyees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [allDep, setAllDep] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [allEmp, setAllEmp] = useState([]);

  const { Option } = Select;

  useEffect(() => {
    getEmployee();
    getTotalNoOfEmp();
    getDepartments();
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

  const getTotalNoOfEmp = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getTotalNumberOfEmp")
      .then((res) => {
        let data = res.data + 1;
        form.setFieldsValue({
          emp_code: data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getDepartments = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getDepartment")
      .then((res) => {
        setAllDep(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllJobProfiles = (ref_id) => {
    console.log(ref_id);
    axios
      .post(process.env.REACT_APP_API_URL + "/getDepartmentPostions", {
        id: ref_id,
      })
      .then((res) => {
        setAllJobs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getEmployee = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getAllEmployee")
      .then((res) => {
        setAllEmp(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleSubmit = (values) => {
    setLoading(true);

    let data = new FormData();
    data.append("f_name", values.f_name);
    data.append("l_name", values.l_name);
    data.append("department", values.department);
    data.append("designation", values.designation);
    data.append("emp_code", values.emp_code);

    if (values.image != undefined && values.image.length != 0) {
      data.append("image", values.image[0].originFileObj);
    }

    values.ref_id = null;

    axios
      .post(process.env.REACT_APP_API_URL + "/addNewEmployee", values)
      .then((res) => {
        setLoading(false);
        handleCancel();
        form.resetFields();
        openNotificationWithIcon("success");
        getEmployee();
        getTotalNoOfEmp();
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
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
          <span className="pageTitle">Old Employees</span>
        </div>
        <div>
          <Button type="primary" onClick={showModal}>
            New Emp +
          </Button>
        </div>
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">New Employee</span>
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
                    <Col span={24} style={{ marginBottom: "10px" }}>
                      <Form.Item
                        label="Porfile Photo"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        name="image"
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

                    <Col span={12}>
                      <Form.Item
                        label="First Name"
                        name="f_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input your First Name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your First Name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Last Name"
                        name="l_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Last Name",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Last Name"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Department"
                        name="department"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Department",
                          },
                        ]}
                        hasFeedback
                      >
                        {/* <Input
                          className="myAntIpt2"
                          placeholder="Enter your Department"
                          size="small"
                        /> */}
                        <Select
                          placeholder="Select Department"
                          className="myAntIptSelect2"
                          allowClear
                          onChange={(value) => getAllJobProfiles(value)}
                        >
                          {allDep.map((x) => (
                            <Option value={x.slug}>{x.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Designation"
                        name="designation"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Designation",
                          },
                        ]}
                        hasFeedback
                      >
                        <Select
                          placeholder="Select designation"
                          className="myAntIptSelect2"
                          allowClear
                        >
                          {allJobs.map((x) => (
                            <Option value={x.slug}>{x.name}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Emp Code"
                        name="emp_code"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Emp Code",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt2"
                          placeholder="Enter your Emp Code"
                          size="small"
                          disabled
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
        {allEmp.map((x, i) => {
          let { _id, f_name, l_name, profile_img, designation, ref_id } = x;
          if (x.old_emp == "true") {
            return (
              <Col xs={24} sm={24} md={8} lg={6} key={i}>
                <EmployeeCard
                  id={_id}
                  ref_id={ref_id}
                  img={profile_img}
                  name={`${f_name} ${l_name}`}
                  designation={designation}
                  getEmp={getEmployee()}
                />
              </Col>
            );
          }
        })}
      </Row>
    </div>
  );
};

export default ShowOldEmpolyees;
