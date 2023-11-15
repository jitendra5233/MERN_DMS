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
const AssignKPIEMP = () => {
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
  const [EmployeeData, SetEmployeeData] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [adminKPI, setAllKPI] = useState([]);
  const [allDep, setAllDep] = useState([]);
  const currentYear = new Date().getFullYear();
  const [updateId, setUpdateId] = useState(null);
  const [accountData, setAccountData] = useState([]);
  const [EmpRole, setEmpRole] = useState();
  const [EmpDate, setEmpDate] = useState("NA");
  const [ReviewerDate, setReviewerDate] = useState("NA");
  const { confirm } = Modal;

  useEffect(() => {
    setEmpRole(selector.role);
    getDepartment();
  }, []);
  const onChange = (key) => {
    form3.resetFields();
    setMonths(key);
  };
  const [adminRating, setAdminRating] = useState(0);
  const [employeeRating, setEmployeeRating] = useState(0);

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
    values.months = KpiMonths;
    values.emp_id = EmpId;
    axios
      .post(process.env.REACT_APP_API_URL + "/create_KPI", values)
      .then((res) => {
        form2.resetFields();
        message.success("Added");

        onChange(KpiMonths);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteIcon = (questionId) => {
    // console.log(empId);
    const kpiId = updateId;
    confirm({
      title: "Delete the Social Icon",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure to delete this Social Icon?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteSocialIcon(kpiId, questionId);
      },
    });
  };

  const deleteSocialIcon = (kpiId, questionId) => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/delete_kpi_question/${kpiId}/${questionId}`
      )
      .then((response) => {})
      .catch((error) => {
        console.error(error);
      });
  };

  const [commentAndRating, setCommentAndRating] = useState({});
  const [RcommentAndRating, setRCommentAndRating] = useState({});

  const handleRatingChange = (itemId, rating) => {
    setCommentAndRating((prevState) => ({
      ...prevState,
      [itemId]: { ...prevState[itemId], rating },
    }));
  };
  const handleCommentChange = (itemId, comment) => {
    setCommentAndRating((prevState) => ({
      ...prevState,
      [itemId]: { ...prevState[itemId], comment },
    }));
  };

  const handleRRatingChange = (itemId, r_rating) => {
    setRCommentAndRating((prevState) => ({
      ...prevState,
      [itemId]: { ...prevState[itemId], r_rating },
    }));
  };
  const handleRCommentChange = (itemId, r_comment) => {
    setRCommentAndRating((prevState) => ({
      ...prevState,
      [itemId]: { ...prevState[itemId], r_comment },
    }));
  };

  const handleUpdateComment = (
    itemId,
    Rating,
    Comment,
    R_Rating,
    R_Comment
  ) => {
    const itemToUpdate = RcommentAndRating[itemId];

    if (
      itemToUpdate &&
      (itemToUpdate.r_rating !== undefined ||
        itemToUpdate.r_comment !== undefined)
    ) {
      const { r_rating, r_comment } = itemToUpdate;

      const dataToUpdate = {
        r_rating: r_rating !== undefined ? r_rating : R_Rating,
        r_comment: r_comment !== undefined ? r_comment : R_Comment,
        Rating,
        Comment,
        EmpId,
        itemId,
      };
      axios
        .post(process.env.REACT_APP_API_URL + "/updatecomment", dataToUpdate)
        .then((res) => {
          console.log("Comment updated:", res.data);
          message.success("Updated");
          // getApiQuestions(updateId, KpiMonths);
        })
        .catch((err) => {
          console.error("Error updating comment:", err);
        });
    }
  };

  const handleCompanyValue = (values) => {
    values.emp_id = EmpId;
    values.months = KpiMonths;
    values.Reviewer_upadate_date = new Date();
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_URL + "/updatecompanyValue", values)
      .then((res) => {
        console.log("Comment updated:", res.data);
        setLoading(false);
        message.success("Updated");
        // getApiQuestions(updateId, KpiMonths);
      })
      .catch((err) => {
        console.error("Error updating comment:", err);
      });
  };
  const handleEmployeeAssesmentValue = (values) => {
    values.emp_id = EmpId;
    values.months = KpiMonths;
    values.Reviewer_upadate_date = new Date();
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_URL + "/updateEmployeeAssesment", values)
      .then((res) => {
        console.log("Comment updated:", res.data);
        setLoading(false);
        message.success("Updated");
        // getApiQuestions(updateId, KpiMonths);
      })
      .catch((err) => {
        console.error("Error updating comment:", err);
      });
  };
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    // onChange(event.target.value);
  };
  function handleDepartmentChange(event) {
    const selectedKey =
      event.target.options[event.target.selectedIndex].getAttribute("data-key");
    const selectedValue = event.target.value;
    setSelectedDepartment(selectedValue);
    setSelectedDepartmentID(selectedKey);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/getAdminApiQuestion/${selectedKey}`
      )
      .then((result) => {
        const data = result.data;
        if (data.length > 0) {
          const { _id, kpiQuestions, ...rest } = data[0];
          setAllKPI(kpiQuestions);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/getEmployeeDepartment/${selectedValue}`
      )
      .then((result) => {
        const data = result.data;
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleDepartmentChange(event) {
    const selectedKey =
      event.target.options[event.target.selectedIndex].getAttribute("data-key");
    const selectedValue = event.target.value;
    setSelectedDepartment(selectedValue);
    setSelectedDepartmentID(selectedKey);

    // Create an array of promise objects for both API requests
    const apiRequests = [
      axios.get(
        `${process.env.REACT_APP_API_URL}/getAdminApiQuestion/${selectedKey}`
      ),
      axios.get(
        `${process.env.REACT_APP_API_URL}/getEmployeeDepartment/${selectedValue}`
      ),
    ];

    Promise.all(apiRequests)
      .then((results) => {
        const adminApiResult = results[0].data;
        const employeeDepartmentResult = results[1].data;
        const data = adminApiResult;
        if (data.length > 0) {
          const { _id, kpiQuestions, ...rest } = data[0];
          setAllKPI(kpiQuestions);
        }
        SetEmployeeData(employeeDepartmentResult);
      })
      .catch((err) => {
        console.error(err);
      });
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

  // Event handler to update the selected values
  function handleSelectChange(event) {
    const selectedOptions = event.target.selectedOptions;
    const selectedValuesArray = Array.from(selectedOptions).map(
      (option) => option.value
    );
    setSelectedValues(selectedValuesArray);
  }
  const handleEmployeeChange = (event) => {
    const selectedKey =
      event.target.options[event.target.selectedIndex].getAttribute("data-key");
    const selectedValue = event.target.value;
    setSelectedEmpId(selectedKey);
  };
  const handleSaveKPI = (values) => {
    values.emp_id = selectedEmpId;
    values.kpiQuestions = selectedValues;
    values.department = selectedDepartment;
    values.department_id = selectedDepartmentId;
    if (KpiMonths != "") {
      values.month = KpiMonths;
      values.months = "";
    } else {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const months = [
        `January ${currentYear}`,
        `February ${currentYear}`,
        `March ${currentYear}`,
        `April ${currentYear}`,
        `May ${currentYear}`,
        `June ${currentYear}`,
        `July ${currentYear}`,
        `August ${currentYear}`,
        `September ${currentYear}`,
        `October ${currentYear}`,
        `November ${currentYear}`,
        `December ${currentYear}`,
      ];
      values.months = months;
      values.month = "";
    }
    axios
      .post(process.env.REACT_APP_API_URL + "/create_KPI", values)
      .then((res) => {
        form2.resetFields();
        message.success("Added");
        onChange(KpiMonths);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const years = [];
  for (let year = 2022; year <= 2050; year++) {
    years.push(year.toString());
  }
  const items = [
    {
      key: `January ${selectedYear}`,
      label: `January ${selectedYear}`,
    },
    {
      key: `February ${selectedYear}`,
      label: `February ${selectedYear}`,
    },
    {
      key: `March ${selectedYear}`,
      label: `March ${selectedYear}`,
    },
    {
      key: `April ${selectedYear}`,
      label: `April ${selectedYear}`,
    },
    {
      key: `May ${selectedYear}`,
      label: `May ${selectedYear}`,
    },
    {
      key: `June ${selectedYear}`,
      label: `June ${selectedYear}`,
    },
    {
      key: `July ${selectedYear}`,
      label: `July ${selectedYear}`,
    },
    {
      key: `August ${selectedYear}`,
      label: `August ${selectedYear}`,
    },
    {
      key: `September ${selectedYear}`,
      label: `September ${selectedYear}`,
    },
    {
      key: `October ${selectedYear}`,
      label: `October ${selectedYear}`,
    },
    {
      key: `November ${selectedYear}`,
      label: `November ${selectedYear}`,
    },
    {
      key: `December ${selectedYear}`,
      label: `December ${selectedYear}`,
    },
  ];

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
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <div className="year-select-row">
                <div className="left-select">
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

                <div className="left-select">
                  <select
                    className="year-select"
                    // value={selectedEmployee}
                    onChange={(event) => handleEmployeeChange(event)}
                  >
                    <option value="Select Employee"> Select Employee</option>
                    {EmployeeData.map((x) => (
                      <option
                        key={x.ref_id}
                        value={`${x.f_name} ${x.l_name}`}
                        data-key={x.ref_id}
                      >
                        {`${x.emp_code} - ${x.f_name} ${x.l_name}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <select
                className="year-select"
                value={selectedYear}
                onChange={handleYearChange}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <Form name="basic" layout="vertical" onFinish={handleSaveKPI}>
              <Row gutter={[24, 0]}>
                <Col span={24}>
                  <select
                    className="year-select"
                    onChange={(event) => handleSelectChange(event)}
                    multiple
                    size={adminKPI.length}
                    style={{
                      width: "100%",
                      padding: "10px",
                      height: "300px",
                    }}
                  >
                    {adminKPI.map((x) => (
                      <option key={x._id} value={x.question}>
                        {x.question}
                      </option>
                    ))}
                  </select>
                </Col>
              </Row>
              <Col span={24}>
                <Form.Item>
                  <Button
                    style={{ margin: 0, float: "right", marginTop: "5px" }}
                    type="primary"
                    htmlType="submit"
                  >
                    Submit KPI
                  </Button>
                </Form.Item>
              </Col>
            </Form>
            <Form
              form={form3}
              name="basic"
              layout="vertical"
              onFinish={handleCompanyValue}
              autoComplete="off"
            >
              <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <h3 className="left">Company Values / General Assessment</h3>
                  <p className="setmargin">
                    Describe how this individual has demonstrated the Company
                    Core Values in their work, attitude and delivery.
                  </p>
                  <hr style={{ marginBottom: "20px" }} />
                </Col>
                <Col span={8}>
                  <h3 className="left">Collaboration</h3>
                  <p className="setmargin">
                    Demonstrates respect for colleagues and takes on outside
                    opinions
                  </p>
                </Col>
                <Col span={16}>
                  <Row gutter={[0, 24]}>
                    <Col span={12}>
                      <Form.Item
                        label="Employee Comment"
                        name="e_collaboration"
                      >
                        <TextArea
                          placeholder="Enter your comment here...."
                          style={{ marginInline: "-21px" }}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Reviewer Comment"
                        name="r_collaboration"
                        rules={[
                          {
                            required: true,
                            message: "Please input a valid comment!",
                          },
                        ]}
                      >
                        <TextArea placeholder="Enter your comment here...." />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
                <Col span={8}>
                  <h3 className="left">Commitment</h3>
                  <p className="setmargin">
                    Shows dedication to the company and a passion to succeed
                  </p>
                </Col>
                <Col span={16}>
                  <Row gutter={[0, 24]}>
                    <Col span={12}>
                      <Form.Item label="Employee Comment" name="e_commitment">
                        <TextArea
                          placeholder="Enter your comment here...."
                          style={{ marginInline: "-21px" }}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Reviewer Comment"
                        name="r_commitment"
                        rules={[
                          {
                            required: true,
                            message: "Please input a valid comment!",
                          },
                        ]}
                      >
                        <TextArea placeholder="Enter your comment here...." />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
                <Col span={8}>
                  <h3 className="left">Integrity</h3>
                  <p className="setmargin">
                    Is willing to question the status quo; gives meaningful
                    feedback
                  </p>
                </Col>
                <Col span={16}>
                  <Row gutter={[0, 24]}>
                    <Col span={12}>
                      <Form.Item label="Employee Comment" name="e_integrity">
                        <TextArea
                          placeholder="Enter your comment here...."
                          style={{ marginInline: "-21px" }}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Reviewer Comment"
                        name="r_integrity"
                        rules={[
                          {
                            required: true,
                            message: "Please input a valid comment!",
                          },
                        ]}
                      >
                        <TextArea placeholder="Enter your comment here...." />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
                <Col span={8}>
                  <h3 className="left">Quality</h3>
                  <p className="setmargin">
                    Provides outstanding service to clients
                  </p>
                </Col>
                <Col span={16}>
                  <Row gutter={[0, 24]}>
                    <Col span={12}>
                      <Form.Item label="Employee Comment" name="e_quality">
                        <TextArea
                          placeholder="Enter your comment here...."
                          style={{ marginInline: "-21px" }}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Reviewer Comment"
                        name="r_quality"
                        rules={[
                          {
                            required: true,
                            message: "Please input a valid comment!",
                          },
                        ]}
                      >
                        <TextArea placeholder="Enter your comment here...." />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
                <Col span={8} style={{ marginTop: "40px" }}>
                  <h3 className="left">What's been going well and why?</h3>
                </Col>
                <Col span={16}>
                  <Row gutter={[0, 24]}>
                    <Col span={12}>
                      <Form.Item label="Employee Comment" name="e_assesment">
                        <TextArea
                          placeholder="Enter your comment here...."
                          style={{ marginInline: "-21px" }}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Reviewer Comment"
                        name="r_assesment"
                        rules={[
                          {
                            required: true,
                            message: "Please input a valid comment!",
                          },
                        ]}
                      >
                        <TextArea placeholder="Enter your comment here...." />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
                <Col span={8} style={{ marginTop: "40px" }}>
                  <h3 className="left">What could be improved and why?</h3>
                </Col>
                <Col span={16}>
                  <Row gutter={[0, 24]}>
                    <Col span={12}>
                      <Form.Item label="Employee Comment" name="e_assesment1">
                        <TextArea
                          placeholder="Enter your comment here...."
                          style={{ marginInline: "-21px" }}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Reviewer Comment"
                        name="r_assesment1"
                        rules={[
                          {
                            required: true,
                            message: "Please input a valid comment!",
                          },
                        ]}
                      >
                        <TextArea placeholder="Enter your comment here...." />
                      </Form.Item>
                    </Col>
                    {EmpRole == "admin" && (
                      <Col span={24}>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ float: "right" }}
                          >
                            Submit
                          </Button>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </Form>
            {/* <Form
              form={form3}
              name="basic"
              layout="vertical"
              onFinish={handleEmployeeAssesmentValue}
              autoComplete="off"
            >
              <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
                <Col span={24}>
                  <h3 className="left">General Assessment</h3>
                  <hr style={{ marginBottom: "20px" }} />
                </Col>
                <Col span={8} style={{ marginTop: "40px" }}>
                  <h6 className="left">What's been going well and why?</h6>
                </Col>
                <Col span={16}>
                  <Row gutter={[0, 24]}>
                    <Col span={12}>
                      <Form.Item label="Employee Comment" name="e_assessment">
                        <TextArea
                          placeholder="Enter your comment here...."
                          style={{ marginInline: "-21px" }}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Reviewer Comment"
                        name="r_assessment"
                        rules={[
                          {
                            required: true,
                            message: "Please input a valid comment!",
                          },
                        ]}
                      >
                        <TextArea placeholder="Enter your comment here...." />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={[24, 0]} style={{ marginTop: "20px" }}>
                <Col span={8} style={{ marginTop: "40px" }}>
                  <h6 className="left">What could be improved and why?</h6>
                </Col>
                <Col span={16}>
                  <Row gutter={[0, 24]}>
                    <Col span={12}>
                      <Form.Item label="Employee Comment" name="e_assessment1">
                        <TextArea
                          placeholder="Enter your comment here...."
                          style={{ marginInline: "-21px" }}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Reviewer Comment"
                        name="r_assessment"
                        rules={[
                          {
                            required: true,
                            message: "Please input a valid comment!",
                          },
                        ]}
                      >
                        <TextArea placeholder="Enter your comment here...." />
                      </Form.Item>
                      {EmpRole == "admin" && (
                        <Col span={24}>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={loading}
                              style={{ float: "right" }}
                            >
                              Submit
                            </Button>
                          </Form.Item>
                        </Col>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form> */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <div>
                <Row gutter={[24, 0]}>
                  <div className="row">
                    <Col span={24} className="container">
                      <h3 className="left">
                        <h1>Final Updated Date / Overall Performance Rating</h1>
                      </h3>
                    </Col>
                    <Col span={12} className="container">
                      <h3 className="left">
                        Employee Rating Average : {employeeRating.toFixed(2)}
                      </h3>
                      <h3 className="left">Employee Date : {EmpDate}</h3>
                    </Col>
                    <Col span={12} className="container">
                      <h3 className="left">
                        Reviewer Rating Average:{adminRating.toFixed(2)}
                      </h3>
                      <h3 className="left">Reviewer Date :{ReviewerDate}</h3>
                    </Col>
                  </div>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignKPIEMP;
