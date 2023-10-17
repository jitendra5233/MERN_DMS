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
const EmployeeKPI = () => {
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
  const currentYear = new Date().getFullYear();
  const [updateId, setUpdateId] = useState(null);
  const [accountData, setAccountData] = useState([]);
  const [EmpRole, setEmpRole] = useState();
  const [EmpDate, setEmpDate] = useState("NA");
  const [ReviewerDate, setReviewerDate] = useState("NA");
  const { confirm } = Modal;

  useEffect(() => {
    getDetails();
    getApiQuestions();
    setEmpRole(selector.role);
  }, []);
  const onChange = (key) => {
    form3.resetFields();
    setMonths(key);
    getApiQuestions(EmpId, key);
  };
  const [adminRating, setAdminRating] = useState(0);
  const [employeeRating, setEmployeeRating] = useState(0);

  const getApiQuestions = (EmpId, kpiMonths) => {
    const uniqueKey = Date.now();
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/getApiQuestion/${EmpId}/${kpiMonths}?key=${uniqueKey}`
      )
      .then((result) => {
        const data = result.data;
        if (data.length > 0) {
          const { _id, kpiQuestions, ...rest } = data[0];
          let totalRating = 0;
          let questionLength = 0;
          let totaladminRating = 0;
          data[0].kpiQuestions.forEach((question) => {
            const rating = parseInt(question.rating, 10);
            const Adminrating = parseInt(question.r_rating, 10);

            if (!isNaN(rating)) {
              totalRating += rating;
              questionLength++;
            }
            if (!isNaN(Adminrating)) {
              totaladminRating += Adminrating;
            }
          });
          const averageRating =
            questionLength > 0 ? totalRating / questionLength : 0;
          const Adminaveragerating =
            questionLength > 0 ? totaladminRating / questionLength : 0;

          setAdminRating(Adminaveragerating);
          setEmployeeRating(averageRating);

          setUpdateId(_id);
          form.setFieldsValue({ ...rest });
          form3.setFieldsValue({
            e_collaboration: rest.e_collaboration,
            e_commitment: rest.e_commitment,
            e_integrity: rest.e_integrity,
            e_quality: rest.e_quality,
            r_collaboration: rest.r_collaboration,
            r_commitment: rest.r_commitment,
            r_integrity: rest.r_integrity,
            r_quality: rest.r_quality,
            e_assesment: rest.e_assesment,
            e_assesment1: rest.e_assesment1,
            r_assesment: rest.r_assesment,
            r_assesment1: rest.r_assesment1,
          });
          if (rest.Emp_upadate_date != "NA") {
            setEmpDate(new Date(rest.Emp_upadate_date).toLocaleDateString());
          } else {
            setEmpDate(rest.Emp_upadate_date);
          }
          if (rest.Reviewer_upadate_date != "NA") {
            setReviewerDate(
              new Date(rest.Reviewer_upadate_date).toLocaleDateString()
            );
          } else {
            setReviewerDate(rest.Reviewer_upadate_date);
          }
          setAccountData(kpiQuestions);
        } else {
          setEmpDate("NA");
          setReviewerDate("NA");
          setAdminRating(0);
          setEmployeeRating(0);
          setUpdateId(null);
          form.resetFields();
          setAccountData([]);
        }
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
          getApiQuestions(data._id);
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
    values.months = KpiMonths;
    values.emp_id = EmpId;
    axios
      .post(process.env.REACT_APP_API_URL + "/create_KPI", values)
      .then((res) => {
        form2.resetFields();
        message.success("Added");
        // getDetails();
        // getApiQuestions();
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
      .then((response) => {
        getApiQuestions(EmpId, KpiMonths);
      })
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
        getApiQuestions(updateId, KpiMonths);
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
        getApiQuestions(updateId, KpiMonths);
      })
      .catch((err) => {
        console.error("Error updating comment:", err);
      });
  };
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    // onChange(event.target.value);
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
          <Row gutter={[24, 0]}>
            <Col span={6}>
              <h2>What do the ratings mean?</h2>
              <div style={{ padding: "10px" }}>
                <h1>5</h1>
                <h1>4</h1>
                <h1>3</h1>
                <h1>2</h1>
                <h1>1</h1>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ marginTop: "32px", padding: "10px" }}>
                <h1>Top Performer</h1>
                <h1>Exceeds Expectations</h1>
                <h1>Meets Expectations</h1>
                <h1>Needs Improvement</h1>
                <h1>Significantly Underperforms</h1>
              </div>
            </Col>
            <Col
              span={12}
              style={{ marginTop: "32px", padding: "10px", fontSize: "12.5px" }}
            >
              <p>
                The employee has performed above average and stretched themself
                to achieve positive feedback and ratings.
              </p>
              <p>The employee has performed below average.</p>
              <p>
                The employee has performed on par with their colleagues, and as
                per expectations for their role/position.
              </p>
              <p>
                Focus should be placed on identifying measures to improve
                performance.
              </p>
              <p>
                The employee has significantly underperformed in this
                performance period, and a performance improvement plan should be
                implemented as soon as possible.
              </p>
            </Col>
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div style={{ marginTop: "20px" }}>
              <h1>Objectives and Outcomes Performance Review</h1>
            </div>
          </div>

          <div>
            <Row gutter={[24, 0]}>
              <div className="row">
                <Col span={24} className="container">
                  <h3 className="left">
                    Employee Name <span>{EmpName}</span>
                  </h3>
                  <h3 className="left">
                    Department <span>{EmpDepartment}</span>
                  </h3>
                  <h3 className="left">
                    Role Title <span>{EmpJobTitle}</span>
                  </h3>
                </Col>
              </div>
            </Row>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <div>
                <span className="pageTitle">KPI Details</span>
              </div>
              <div className="year-select-container">
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

            <Form name="basic" layout="vertical">
              <Row gutter={[24, 0]}>
                <Col span={24}>
                  <h3 className="left">
                    Goals and Objectives / Employee Assessment
                  </h3>
                  <p className="setmargin">
                    List each objective that was set this performance period.
                    For each objective, indicate achieved/not achieved with
                    comments.
                  </p>
                  <List
                    bordered
                    dataSource={accountData}
                    renderItem={(item) => (
                      <List.Item className="list-style">
                        <div>
                          <span className="question">{item.question}</span>
                        </div>
                        <Form.Item
                          label="E-Rating"
                          name={`rating-${item._id}`}
                          initialValue={item.rating}
                        >
                          <Select
                            placeholder="Rating"
                            allowClear
                            className="myAntIptSelect2 padrating"
                            onChange={(value) =>
                              handleRatingChange(item._id, value)
                            }
                            disabled
                          >
                            <Select.Option value="1">1</Select.Option>
                            <Select.Option value="2">2</Select.Option>
                            <Select.Option value="3">3</Select.Option>
                            <Select.Option value="4">4</Select.Option>
                            <Select.Option value="5">5</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="R-Rating"
                          name={`r_rating-${item._id}`}
                          initialValue={item.r_rating}
                        >
                          <Select
                            placeholder="Rating"
                            allowClear
                            className="myAntIptSelect2"
                            onChange={(value) =>
                              handleRRatingChange(item._id, value)
                            }
                          >
                            <Select.Option value="1">1</Select.Option>
                            <Select.Option value="2">2</Select.Option>
                            <Select.Option value="3">3</Select.Option>
                            <Select.Option value="4">4</Select.Option>
                            <Select.Option value="5">5</Select.Option>
                          </Select>
                        </Form.Item>
                        <Col span={6}>
                          <Form.Item
                            label="Employee Comment"
                            name={`comment-${item._id}`}
                            initialValue={item.comment}
                          >
                            <TextArea
                              onChange={(e) =>
                                handleCommentChange(item._id, e.target.value)
                              }
                              readOnly
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            label="Reviewer Comment"
                            name={`r_comment-${item._id}`}
                            initialValue={item.r_comment}
                          >
                            <TextArea
                              onChange={(e) =>
                                handleRCommentChange(item._id, e.target.value)
                              }
                            />
                          </Form.Item>
                        </Col>
                        {item.comment === "" && (
                          <i
                            className="fa fa-trash"
                            id="deleteicon"
                            aria-hidden="true"
                            onClick={() => handleDeleteIcon(item._id)}
                          ></i>
                        )}
                        {EmpRole == "admin" && (
                          <i
                            className="fa fa-check-square"
                            id="deleteicon"
                            aria-hidden="true"
                            onClick={() =>
                              handleUpdateComment(
                                item._id,
                                item.rating,
                                item.comment,
                                item.r_rating,
                                item.r_comment
                              )
                            }
                          ></i>
                        )}
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
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

export default EmployeeKPI;
