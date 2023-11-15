import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  message,
  notification,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EmployeeAppraisal = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const r_prams = useParams();
  const [employee, setEmployee] = useState([]);
  const [allDep, setAllDep] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [e_c_salary, setE_e_salary] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  let { Option } = Select;

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "% of appraisal",
      dataIndex: "appraisal_p",
      key: "appraisal_p",
    },
    {
      title: "Salary",
      dataIndex: "cureent_salary",
      key: "cureent_salary",
    },
    {
      title: "Appraisal",
      dataIndex: "appraisal",
      key: "appraisal",
    },
    {
      title: "New Salary",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",

      render: ({ id, cureent_salary, ref_id }, i) => {
        console.log(i.last);
        return (
          <div>
            {/* <span style={{ marginRight: "10px", cursor: "pointer" }}>
              <EditOutlined
                onClick={() => handleEdit(id)}
                style={{ cursor: "pointer" }}
              />
            </span> */}
            <span>
              {i.last !== true ? (
                <></>
              ) : (
                <>
                  <DeleteOutlined
                    onClick={() => handleDelete(id, cureent_salary, ref_id)}
                    style={{ cursor: "pointer" }}
                  />
                </>
              )}
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getDetails();
    getDepartments();
    getApprisals();
  }, []);

  const handleDelete = (id, cureent_salary, ref_id) => {
    axios
      .post(process.env.REACT_APP_API_URL + "/handleDeleteAppriasal", {
        id,
        s: cureent_salary,
        ref_id,
      })
      .then((res) => {
        message.success("Deleted");
        getDetails();
        getApprisals();
      })
      .then((err) => {
        console.log(err);
      });
  };

  const handleEdit = (id) => {
    console.log(id);
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

  const getDetails = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getCandidateDataByIdDetail", {
        id: r_prams.id,
      })
      .then((res) => {
        if (res.data.length != 0) {
          let data = res.data[0];
          data.name = `${data.f_name} ${data.l_name}`;
          getAllJobProfiles(data.department);
          form.setFieldsValue(data);

          setE_e_salary(data.salary);

          form2.setFieldsValue({
            c_salary: data.salary,
            salary: data.salary,
          });

          setEmployee(data);
        }
      })
      .catch((err) => {
        console.log(console.log(err));
      });
  };

  const getApprisals = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/getAppraisal", { id: r_prams.id })
      .then((res) => {
        let data = [];

        res.data.map((x, i) => {
          data.push({
            no: i + 1,
            date: new Date(x.date).toLocaleDateString(),
            appraisal_p: x.appraisal_p + "%",
            salary: x.salary,
            appraisal: x.appraisal,
            cureent_salary: x.salary - x.appraisal,
            action: {
              id: x._id,
              cureent_salary: x.salary - x.appraisal,
              ref_id: x.ref_id,
            },
            last: i == res.data.length - 1 ? true : false,
          });
        });

        setTableData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (values) => {
    values.ref_id = r_prams.id;

    axios
      .post(process.env.REACT_APP_API_URL + "/addAppraisal", values)
      .then((res) => {
        form2.resetFields();
        message.success("Added");
        getApprisals();
        handleCancel();
        getDetails();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const openApprisalModel = () => {
    setShowModel(true);
  };

  const handleCancel = () => {
    setShowModel(false);
  };

  const updateSalary = (app) => {
    if (app != null) {
      let current_salary = parseInt(e_c_salary);
      form2.setFieldsValue({
        appraisal: (current_salary / 100) * app,
        salary: (current_salary / 100) * app + current_salary,
      });
    }
  };

  return (
    <div>
      <Modal open={showModel} onCancel={handleCancel} footer={[]}>
        <Spin spinning={loading}>
          {contextHolder}
          <div style={{ padding: "30px" }}>
            <Row>
              <Col span={24} style={{ marginBottom: "30px" }}>
                <span className="popupTitle">Add New Appraisal</span>
              </Col>
              <Col span={24}>
                <Form
                  form={form2}
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
                        label="Appraisal Start Date"
                        name="date"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Appraisal Start Date",
                          },
                        ]}
                        hasFeedback
                      >
                        <DatePicker className="myAntIpt2" size="small" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Appraisal %"
                        name="appraisal_p"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Appraisal %",
                          },
                        ]}
                      >
                        <InputNumber
                          onChange={(no) => updateSalary(no)}
                          className="myAntIpt2"
                          size="small"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Current Salary" name="c_salary">
                        <Input readOnly className="myAntIpt2" size="small" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Appraisal" name="appraisal">
                        <Input readOnly className="myAntIpt2" size="small" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="New Salary" name="salary">
                        <Input readOnly className="myAntIpt2" size="small" />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item>
                        <Button
                          style={{ margin: 0 }}
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
        </Spin>
      </Modal>
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
            <span className="pageTitle">Appraisal</span>
          </div>
        </div>
        <div>
          <Form form={form} name="basic" layout="vertical" autoComplete="off">
            <Row gutter={[24, 0]}>
              <Col span={6}>
                <Form.Item label="Name" name="name">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Employee Code" name="emp_code">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Department" name="department">
                  <Select
                    disabled
                    placeholder="Select Department"
                    onChange={(value) => {
                      form.resetFields(["designation"]);
                      getAllJobProfiles(value);
                    }}
                  >
                    {allDep.map((x) => (
                      <Option value={x.slug}>{x.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Designation" name="job_title">
                  <Select disabled placeholder="Select designation">
                    {allJobs.map((x) => (
                      <Option value={x.slug}>{x.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <Divider />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <span className="pageTitle">Appraisal History</span>
          </div>
          <div>
            <Button type="primary" onClick={openApprisalModel}>
              Add Appraisal +
            </Button>
          </div>
        </div>
        <div>
          <Table columns={columns} dataSource={tableData} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeAppraisal;
