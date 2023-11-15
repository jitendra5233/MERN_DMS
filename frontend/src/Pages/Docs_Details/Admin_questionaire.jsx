import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
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
  List,
  Tabs,
} from "antd";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useSelector } from "react-redux";
const Admin_questionaire = () => {
  let selector = useSelector((state) => state.persistedReducer.user);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [form3] = Form.useForm();
  const r_prams = useParams();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  let { Option } = Select;
  const [socialIcons, setSocialIcons] = useState([
    { icon_name: undefined, social_url: undefined },
  ]);
  const [EmpName, setEmpName] = useState("");
  const [EmpDepartment, setEmpDepartment] = useState("");
  const [EmpJobTitle, setEmpJobTitle] = useState("");
  const [EmpId, setEmpId] = useState("");
  const [KpiMonths, setMonths] = useState("");
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentID] = useState("");
  const [allDep, setAllDep] = useState([]);

  const currentYear = new Date().getFullYear();
  const [updateId, setUpdateId] = useState(null);
  const [accountData, setAccountData] = useState([]);
  const [EmpRole, setEmpRole] = useState();
  const [EmpDate, setEmpDate] = useState("NA");
  const [ReviewerDate, setReviewerDate] = useState("NA");
  const { confirm } = Modal;

  useEffect(() => {
    getDetails();
    setEmpRole(selector.role);
    getDepartment();
  }, []);
  const onChange = (key) => {
    form3.resetFields();
    setMonths(key);
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
          form.setFieldsValue(data);
          setEmpName(data.name);
          setEmpDepartment(data.department);
          setEmpJobTitle(data.job_title);
          setEmpId(data._id);
        }
      })
      .catch((err) => {
        console.log(console.log(err));
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleAddMore = () => {
    setSocialIcons([
      ...socialIcons,
      { icon_name: undefined, social_url: undefined },
    ]);
  };

  const handleRemove = (index) => {
    setSocialIcons((prevIcons) => prevIcons.filter((item, i) => i !== index));
  };
  const handleSaveQUES = (values) => {
    values.department_id = selectedDepartmentId;
    values.department = selectedDepartment;
    axios
      .post(process.env.REACT_APP_API_URL + "/create_admin_KPI", values)
      .then((res) => {
        setSocialIcons([
          ...socialIcons,
          { icon_name: undefined, social_url: undefined },
        ]);
        form2.resetFields();
        message.success("Added");
        onChange(KpiMonths);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleDepartmentChange(event) {
    const selectedKey =
      event.target.options[event.target.selectedIndex].getAttribute("data-key");
    const selectedValue = event.target.value;
    setSelectedDepartment(selectedValue);
    setSelectedDepartmentID(selectedKey);
  }

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
  //   const years = [];
  //   for (let year = 2022; year <= 2050; year++) {
  //     years.push(year.toString());
  //   }
  //   const items = [
  //     {
  //       key: `January ${selectedYear}`,
  //       label: `January ${selectedYear}`,
  //     },
  //     {
  //       key: `February ${selectedYear}`,
  //       label: `February ${selectedYear}`,
  //     },
  //     {
  //       key: `March ${selectedYear}`,
  //       label: `March ${selectedYear}`,
  //     },
  //     {
  //       key: `April ${selectedYear}`,
  //       label: `April ${selectedYear}`,
  //     },
  //     {
  //       key: `May ${selectedYear}`,
  //       label: `May ${selectedYear}`,
  //     },
  //     {
  //       key: `June ${selectedYear}`,
  //       label: `June ${selectedYear}`,
  //     },
  //     {
  //       key: `July ${selectedYear}`,
  //       label: `July ${selectedYear}`,
  //     },
  //     {
  //       key: `August ${selectedYear}`,
  //       label: `August ${selectedYear}`,
  //     },
  //     {
  //       key: `September ${selectedYear}`,
  //       label: `September ${selectedYear}`,
  //     },
  //     {
  //       key: `October ${selectedYear}`,
  //       label: `October ${selectedYear}`,
  //     },
  //     {
  //       key: `November ${selectedYear}`,
  //       label: `November ${selectedYear}`,
  //     },
  //     {
  //       key: `December ${selectedYear}`,
  //       label: `December ${selectedYear}`,
  //     },
  //   ];
  return (
    <div>
      <div>
        <Divider />
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          ></div>

          <div>
            {/* <Tabs defaultActiveKey="1" items={items} onChange={onChange} /> */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <div>KPI Questions</div>

              <div className="year-select-container">
                <select
                  className="year-select"
                  value={selectedDepartment}
                  onChange={(event) => handleDepartmentChange(event)}
                >
                  {allDep.map((x) => (
                    <option key={x._id} value={x.slug} data-key={x._id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {EmpRole == "admin" && (
              <Row>
                <Col span={24}>
                  <Form
                    form={form2}
                    name="basic"
                    layout="vertical"
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={handleSaveQUES}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                  >
                    <Row gutter={24}>
                      {socialIcons.map((item, index) => (
                        <React.Fragment key={index}>
                          <Col span={20}>
                            <Form.Item
                              label={`Question ${index + 1}`}
                              name={["socialIcons", index, "qusetion"]}
                              initialValue={item.social_url}
                              hasFeedback
                              rules={[
                                {
                                  required: true,
                                  message: "Please input your qusetion",
                                },
                              ]}
                            >
                              <TextArea
                                className="myAntIpt2"
                                placeholder="Enter Question....."
                                size="small"
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            {index === socialIcons.length - 1 && (
                              <Form.Item>
                                <Button
                                  type="primary"
                                  onClick={handleAddMore}
                                  block
                                  className="add-more-button"
                                >
                                  <PlusOutlined />
                                  {/* Add More */}
                                </Button>
                              </Form.Item>
                            )}
                            {index !== socialIcons.length - 1 && (
                              <Button
                                type="primary"
                                onClick={() => handleRemove(index)}
                                block
                                className="remove-button"
                              >
                                <DeleteOutlined />
                              </Button>
                            )}
                          </Col>
                        </React.Fragment>
                      ))}
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
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_questionaire;
