import { Button, Col, Form, Input, Row, Typography, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddEditCandidateDetails = () => {
  let [activeCan, setActiveCan] = useState();
  const [empCode, setEmpCode] = useState("");

  const [canDetails, setCanDetails] = useState([]);
  

  const [form] = Form.useForm();
  let { Title } = Typography;
  const r_prams = useParams();

  useEffect(() => {
    getCandidateData(r_prams.id);
    // getTotalNoOfEmp();
  }, []);

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

  const getCandidateData = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getCandidateDataByIdDetail", {
        id,
      })
      .then((res) => {
        let data = res.data;
        if (data.length != 0) {
          let formData = data[0];

          if (formData.emp_code === undefined) {
            getTotalNoOfEmp();
          }

          setCanDetails(formData);
          console.log(setCanDetails(formData));
          // console.log(canDetails);

          form.setFieldsValue(formData);
          axios
            .post(process.env.REACT_APP_API_URL + "/getCandidateDocs", { id })
            .then((res) => {
              res.data.map((x, i) => {
                if (x.name == "salary_slip") {
                  props1.defaultFileList.push({
                    uid: x._id,
                    name: "Salary Slip " + (i + 1),
                    status: "done",
                    url: x.url,
                  });
                }
                if (x.name == "experience") {
                  props2.defaultFileList.push({
                    uid: x._id,
                    name: "Experience letter " + (i + 1),
                    status: "done",
                    url: x.url,
                  });
                }
                if (x.name == "education") {
                  props3.defaultFileList.push({
                    uid: x._id,
                    name: "Education Document " + (i + 1),
                    status: "done",
                    url: x.url,
                  });
                }
              });
              setActiveCan("ok");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("no");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteDoc = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteCandidateDocs", { id })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const props1 = {
    name: "file",
    multiple: true,
    action: process.env.REACT_APP_API_URL + "/uploadDocs",
    data: { name: "salary_slip", ref_id: r_prams.id },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status == "removed") {
        deleteDoc(info.file.uid);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    defaultFileList: [],
  };

  const props2 = {
    name: "file",
    multiple: true,
    action: process.env.REACT_APP_API_URL + "/uploadDocs",
    data: { name: "experience", ref_id: r_prams.id },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status == "removed") {
        deleteDoc(info.file.uid);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    defaultFileList: [],
  };

  const props3 = {
    name: "file",
    multiple: true,
    action: process.env.REACT_APP_API_URL + "/uploadDocs",
    data: { name: "education", ref_id: r_prams.id },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status == "removed") {
        deleteDoc(info.file.uid);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    defaultFileList: [],
  };

  const onFinish = (values) => {
    // console.log(values,"value")
    values.ref_id = r_prams.id;

    values.department = canDetails.ref_id;
    values.job_title = canDetails.profile_id;

    axios
      .post(process.env.REACT_APP_API_URL + "/addCandidateDetails", values)
      .then((res) => {
        // console.log(res,"result")
        message.success("Added");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className="mainContainer">
        <Row>
          <Col span={24}>
            <div className="mainTitle">
              <Title level={4}>New Hired Candidates details</Title>
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
                    label="First Name"
                    name="f_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your First Name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Last Name"
                    name="l_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Last Name!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Email!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Emp Code"
                    name="emp_code"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Emp Code!",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Phone Number!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label="Aadhar Card"
                    name="aadhar_no"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Last Salary!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Pan Card No"
                    name="pan_no"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Pan Card No!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Bank Name"
                    name="bank_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Account No!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Account No"
                    name="account_no"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Account No!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="IFSC code "
                    name="ifsc"
                    rules={[
                      {
                        required: true,
                        message: "Please input your IFSC Code!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Last 3 month salary slip"
                    name="salary_slip"
                  >
                    <Dragger {...props1}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Drag and Drop Files here
                      </p>
                    </Dragger>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Experience letter" name="ex_latter">
                    <Dragger {...props2}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Drag and Drop Files here
                      </p>
                    </Dragger>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Education Documents" name="edu_docs">
                    <Dragger {...props3}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Drag and Drop Files here
                      </p>
                    </Dragger>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    <Button
                      className="myAntLoginBtn"
                      type="primary"
                      htmlType="submit"
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AddEditCandidateDetails;
