import { useState, useEffect } from "react";
import {
  PieChartOutlined,
  UserOutlined,
  GlobalOutlined,
  HomeFilled,
  SearchOutlined,
  DropboxOutlined,
  ContactsOutlined,
  QuestionOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Avatar,
  Popover,
  Row,
  Col,
  Form,
  Input,
  Spin,
  Upload,
  Modal,
  notification,
} from "antd";
import axios from "axios";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutAc } from "../Redux/Actions";
const { Header, Content, Footer, Sider } = Layout;
const LayoutEmp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  const [collapsed, setCollapsed] = useState(false);
  const [f_name, setFName] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [l_name, setLName] = useState("");
  const [user_id, setUserId] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { SubMenu } = Menu;

  useEffect(() => {
    checkLogin();
    setProfile();
  }, []);

  const setProfile = () => {
    let user = selector.user;
    setFName(user.f_name);
    setLName(user.l_name);
    setUserId(user.token);
  };

  const checkLogin = () => {
    if (!selector.isLogin) {
      navigate("/login");
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const openNotificationWithIcon = (type, message) => {
    if (type === "error") {
      notification.error({
        message: "Server error!",
        description: "",
      });
    } else if (type === "warning") {
      notification.warning({
        message,
        description: "",
      });
    } else {
      notification[type]({
        message,
        description: "",
      });
    }
  };
  const content = (
    <div style={{ textAlign: "center" }}>
      <div>
        <Avatar
          size={35}
          src={<img src="./icon/userImg.png" alt="avatar" />}
          style={{ margin: " 0 15px" }}
        />
      </div>
      <div>
        <h4>
          {f_name} {l_name}
        </h4>
      </div>
      <div>
        <h5>
          {selector.user.role == "emp"
            ? "Employee"
            : selector.user.role == "admin"
            ? "Admin"
            : selector.user.role == "hr"
            ? "HR"
            : ""}
        </h5>
      </div>
      <div style={{ margin: "10px 0 0 0" }}>
        <Link to={`/profile/${user_id}`} className="menuText">
          <Button type="primary" block primary onClick={showModal}>
            Profile
          </Button>
        </Link>
        {/* <Button type="primary" block primary onClick={showModal}>
          Update Password
        </Button> */}
        <Button type="primary" block danger onClick={() => handleLogout()}>
          Logout
        </Button>
      </div>
    </div>
  );

  const handleLogout = () => {
    dispatch(handleLogoutAc());
    navigate("/login");
  };

  const handleUpdate = async (values) => {
    values.id = user_id;
    if (values.new_password !== values.confirm_password) {
      openNotificationWithIcon(
        "warning",
        "Confirm Password and New Password must be the same!"
      );
    } else {
      setLoading(true);
      try {
        const { id, old_password, new_password } = values;
        const response = await axios.post(
          process.env.REACT_APP_API_URL + "/update_password",
          {
            id,
            oldpassword: old_password,
            newpassword: new_password,
          }
        );
        if (response.data.message == "Password updated successfully") {
          form.resetFields();
          setLoading(false);
          handleCancel(true);
          openNotificationWithIcon("success", response.data.message);
        }
        if (response.data.message == "Old Password does Not Matched!") {
          setLoading(false);
          openNotificationWithIcon("warning", response.data.message);
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
        openNotificationWithIcon("error", "Failed to update Password");
      }
    }
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const url =
    "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg";
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  const items = [
    getItem("Dashboard", "1", <PieChartOutlined />, "", "/"),
    getItem("User", "sub1", <UserOutlined />, [
      getItem("Users", "3", "", "", "/users"),
      getItem("Add User", "4", "", ""),
    ]),
  ];
  return (
    <>
      <Layout>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              boxShadow: "1px 1px 4px 0px rgba(0, 0, 0, 0.10)",
            }}
          >
            <Row style={{ margin: "0 30px" }}>
              <Col span={18} className="h64p">
                <Link to={"/"}>
                  <img
                    src="./logo.png"
                    alt=""
                    style={{ padding: "1rem 0", cursor: "pointer" }}
                  />
                </Link>
              </Col>
              <Col span={6} className="h64p">
                <Row>
                  <Col
                    span={10}
                    className="h64p"
                    style={{ textAlign: "end", cursor: "pointer" }}
                  >
                    <img
                      style={{ width: "22px", margin: "22px  0" }}
                      src="./icon/bellicon.svg"
                    />
                  </Col>
                  <Col span={4} className="h64p">
                    <Avatar
                      size={35}
                      src={<img src="./icon/userImg.png" alt="avatar" />}
                      style={{ margin: " 0 15px" }}
                    />
                  </Col>
                  <Col span={10} className="h64p" style={{ cursor: "pointer" }}>
                    <Popover
                      placement="bottom"
                      content={content}
                      trigger="click"
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <div className="appBarUserContainer">
                          <span className="appBarUserName">{f_name}</span>

                          <span className="appBarUserType">
                            {selector.user.role == "emp"
                              ? "Employee"
                              : selector.user.role == "admin"
                              ? "Admin"
                              : selector.user.role == "hr"
                              ? "HR"
                              : ""}
                          </span>
                        </div>
                        <img
                          style={{ margin: "0 20px" }}
                          src="./icon/ArrowDown.png"
                        />
                      </div>
                    </Popover>
                  </Col>
                  {/* <Col span={1} className="h64p"></Col> */}
                </Row>
              </Col>
            </Row>
          </Header>

          <Content
            style={{
              margin: "24px 16px 0",
              overflow: "auto",
              height: "80vh",
            }}
          >
            <div
              style={{
                padding: 40,
                height: "100%",
                background: colorBgContainer,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
export default LayoutEmp;
