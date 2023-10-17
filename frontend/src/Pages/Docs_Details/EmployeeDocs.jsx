import React, { useEffect, useState } from "react";
import { Col, Form, Row, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";

const EmployeeDocs = () => {
  const r_prams = useParams();
  const [form] = Form.useForm();
  const [activeCan, setActiveCan] = useState(false);

  const onFinish = (values) => {
    console.log(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    getDocs();
  }, []);

  const getDocs = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getCandidateDocs", {
        id: r_prams.id,
      })
      .then((res) => {
        res.data.map((x, i) => {
          if (x.name == "offerletter") {
            props1.defaultFileList.push({
              uid: x._id,
              name: "Offer letter " + (i + 1),
              status: "done",
              url: x.url,
            });
          }
          if (x.name == "appraisalletter") {
            props2.defaultFileList.push({
              uid: x._id,
              name: "Appraisal letter " + (i + 1),
              status: "done",
              url: x.url,
            });
          }
          if (x.name == "PFForm11") {
            props3.defaultFileList.push({
              uid: x._id,
              name: "PF Form " + (i + 1),
              status: "done",
              url: x.url,
            });
          }
          if (x.name == "EmployeeDetailsheet") {
            props4.defaultFileList.push({
              uid: x._id,
              name: "Employee Detail sheet " + (i + 1),
              status: "done",
              url: x.url,
            });
          }
        });
        setActiveCan(!activeCan);
      })
      .catch((err) => {
        console.log(console.log(err));
      });
  };

  const deleteDoc = (id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/deleteCandidateDocs", { id })
      .then((res) => {
        message.success("Doc Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const props1 = {
    name: "file",
    multiple: true,
    action: process.env.REACT_APP_API_URL + "/uploadDocs",
    data: { name: "offerletter", ref_id: r_prams.id },
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
    data: { name: "appraisalletter", ref_id: r_prams.id },
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
    data: { name: "PFForm11", ref_id: r_prams.id },
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

  const props4 = {
    name: "file",
    multiple: true,
    action: process.env.REACT_APP_API_URL + "/uploadDocs",
    data: { name: "EmployeeDetailsheet", ref_id: r_prams.id },
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

  return (
    <div>
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
            <span className="pageTitle">Document</span>
          </div>
        </div>
        <div>
          <Form
            form={form}
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row>
              <Col span={24}>
                <Form.Item label="Offer letter" name="offerletter">
                  <Dragger {...props1}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Drag and Drop Files here</p>
                  </Dragger>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Appraisal letter" name="appraisalletter">
                  <Dragger {...props2}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Drag and Drop Files here</p>
                  </Dragger>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="PF/Form 11" name="PFForm11">
                  <Dragger {...props3}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Drag and Drop Files here</p>
                  </Dragger>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Employee Detail sheet"
                  name="EmployeeDetailsheet"
                >
                  <Dragger {...props4}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Drag and Drop Files here</p>
                  </Dragger>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocs;
