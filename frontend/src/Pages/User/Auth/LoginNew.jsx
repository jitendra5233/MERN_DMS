import { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  notification,
  Spin,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../../../Redux/Actions";
import axios from "axios";

let myStyle = {
  container: {
    padding: "3em 9em",
  },
  main: { height: "83vh", overflow: "hidden", borderRadius: "10px" },
};

const LoginNew = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);

  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    if (selector.isLogin) {
      navigate("/");
    }
  };

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

  const handleSubmit = (values) => {
    setLoading(true);
    axios
      .post(process.env.REACT_APP_API_URL + "/login", values)
      .then((res) => {
        if (res.data.length === 0) {
          setLoading(false);
          openNotificationWithIcon("error");
        } else {
          let data = res.data[0];

          if (data.employee_type == "admin") {
            setLoading(false);
            dispatch(
              handleLogin({
                id: data._id,
                token2: data._id,
                employee_id: data._id,
                f_name: "",
                l_name: "",
                role: data.employee_type,
                photo: "",
              })
            );
            openNotificationWithIcon("success");
            navigate("/");
          }

          axios
            .post(process.env.REACT_APP_API_URL + "/getEmpData", {
              token: data._id,
            })
            .then((res2) => {
              setLoading(false);

              dispatch(
                handleLogin({
                  id: data._id,
                  token2: data.employee_id,
                  employee_id: data.employee_id,
                  f_name: res2.data[0].f_name,
                  l_name: res2.data[0].l_name,
                  role: data.employee_type,
                  photo: res2.data[0].photo,
                })
              );
              openNotificationWithIcon("success");
              navigate("/");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Spin spinning={loading}>
        {contextHolder}
        <div style={myStyle.container}>
          <Row style={myStyle.main}>
            <Col span={12} style={{ backgroundColor: "#f6f7fc" }}>
              <div>
                <div className="loginFormContainer">
                  <div className="loginTitleDiv">
                    <div>
                      <span className="loginTitle">Welcome To Dashboard!</span>
                    </div>
                    <div>
                      <span className="loginSubTitle">
                        Please enter your email and password to login
                      </span>
                    </div>
                  </div>
                  <div className="loginForm">
                    <Form
                      name="basic"
                      layout="vertical"
                      initialValues={{
                        remember: true,
                      }}
                      onFinish={handleSubmit}
                      onFinishFailed={onFinishFailed}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            type: "email",
                            message: "The input is not valid E-mail!",
                          },
                          {
                            required: true,
                            message: "Please input your E-mail!",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="myAntIpt"
                          placeholder="Enter your email"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                      >
                        <Input.Password
                          className="myAntIpt"
                          placeholder="Enter Your password"
                        />
                      </Form.Item>

                      <Form.Item name="remember" valuePropName="checked">
                        <div className="remenberAndFrgotPassContainer">
                          <div>
                            <Checkbox>Remember me</Checkbox>
                          </div>
                          <div>
                            {/* <a Link="forgotPassword">Forgot Password?</a> */}
                            <Link to="/forgotPassword">Forgot Password?</Link>
                          </div>
                        </div>
                      </Form.Item>

                      <Form.Item>
                        <Button
                          className="myAntLoginBtn"
                          type="primary"
                          htmlType="submit"
                          block
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <img src="./images/loginRightImg.png" style={{ width: "100%" }} />
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default LoginNew;
