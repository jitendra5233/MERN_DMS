import {
  Button,
  Table,
  Modal,
  Typography,
  Row,
  Col,
  Avatar,
  Form,
  Input,
  Select,
  notification,
  Spin,
  Upload,
  Dropdown,
  Card,
} from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  LogoutOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { handleLogin } from "../../Redux/Actions";
import { useDispatch } from "react-redux";

const ShowHiredCandidate = () => {
  const [tableData, setTableData] = useState([]);
  const [form] = Form.useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectedComment, setRejectedComment] = useState("");

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();

  const [activeId, setActiveId] = useState("");

  const openNotificationWithIcon = (type) => {
    if (type === "error") {
      api[type]({
        message: "Invalid Email or Password",
        description: "",
      });
    } else {
      api[type]({
        message: "Login Successful",
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
    form.resetFields();
    setIsModalOpen(false);
    setActiveId("");
  };

  useEffect(() => {
    getUsers();
    // getRoles();
  }, []);

  const items = [
    {
      key: "1",
      label: <Link onClick={() => viewComment()}>View Comment</Link>,
    },
    {
      key: "4",
      label: (
        <Link onClick={() => handleDelete()} style={{ color: "red" }}>
          Delete
        </Link>
      ),
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "emailid",
      key: "emailid",
    },
    {
      title: "Last Salary",
      dataIndex: "last_salary",
      key: "last_salary",
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
    },
    {
      title: "Expected Salary",
      dataIndex: "expected_salary",
      key: "expected_salary",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "CV",
      dataIndex: "cv",
      key: "cv",
      render: ({ name, link }) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <div>
              <FileTextOutlined /> {name}'s cv
            </div>
            <div>
              <a href={link} target="_blank">
                <DownloadOutlined style={{ fontSize: "15px" }} />
              </a>
            </div>
          </div>
        );
      },
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      render: (id) => {
        return (
          <div style={{ cursor: "pointer", textAlign: "center" }}>
            <Dropdown
              menu={{ items }}
              placement="bottomLeft"
              arrow
              trigger={["click"]}
              onClick={() => setActiveId(id)}
            >
              <EllipsisOutlined style={{ fontSize: "18px" }} />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const handleEdit = (id) => {
    setActiveId(id);
    tableData.map((x) => {
      if (x.key == id) {
        form.setFieldsValue({
          f_name: x.f_name,
          l_name: x.l_name,
          emp_code: x.empcode,
          title: x.jobtitle,
          email: x.emailid,
          password: x.password,
          c_password: x.password,
        });
      }
    });
    showModal();
  };

  const handleDelete = () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/delete_candidate", {
        id: activeId,
      })
      .then((result) => {
        let data = result.data;

        console.log(data);
        getUsers();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUsers = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/getRejectedCandidate")
      .then((result) => {
        let data = result.data;

        let newData = [];

        data.map((x) => {
          newData.push({
            key: x._id,
            name: `${x.f_name} ${x.l_name}`,
            emailid: x.email,
            last_salary: x.l_salary,
            experience: x.experience,
            expected_salary: x.expected_salary,
            location: x.candidate_location,
            cv: { name: x.f_name, link: x.cv },
            edit: x._id,
            f_name: x.f_name,
            l_name: x.l_name,
            comment: x.rejectComment,
          });
        });

        setTableData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let { Title } = Typography;

  const handleSubmit = (values) => {
    console.log(values);
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

  const viewComment = () => {
    tableData.map((x) => {
      if (x.key == activeId) {
        setRejectedComment(x.comment);
        showModal();
      }
    });
  };

  let { Option } = Select;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span className="pageTitle">Rejected Candidates</span>
        </div>
        <div>
          {/* <Button type="primary" onClick={showModal}>
            Add Hired Candidate +
          </Button> */}
        </div>

        <Modal open={isModalOpen} onCancel={handleCancel} footer={[]}>
          <Spin spinning={loading}>
            {contextHolder}
            <div style={{ padding: "30px" }}>
              <Row>
                <Col span={24} style={{ marginBottom: "30px" }}>
                  <span className="popupTitle">Candidate Rejected Comment</span>
                </Col>
                <Col span={24}>
                  <div style={{ textAlign: "center" }}>
                    <Card>{rejectedComment}</Card>
                  </div>
                </Col>
              </Row>
            </div>
          </Spin>
        </Modal>
      </div>

      <div style={{ marginTop: "25px" }}>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
};

export default ShowHiredCandidate;
