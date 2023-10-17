import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
  notification,
  Spin,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../Redux/Actions";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.persistedReducer);
  let { Title } = Typography;

  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [f_name, setFName] = useState("");
  const [l_name, setLName] = useState("");

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
        setLoading(false);
        if (res.data.length === 0) {
          openNotificationWithIcon("error");
        } else {
          let data = res.data[0];

          dispatch(
            handleLogin({
              id: data._id,
              f_name: data.f_name,
              l_name: data.l_name,
            })
          );
          openNotificationWithIcon("success");
          navigate("/");
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
    <div style={{ padding: "1rem" }}>
      <Spin spinning={loading}>
        {contextHolder}

        <Row
          type="flex"
          justify="center"
          align="middle"
          style={{ padding: "5rem" }}
        >
          <Col span={24} style={{ textAlign: "center", padding: "0.5rem" }}>
            <Title level={2}>Login</Title>
          </Col>
          <Col>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
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
                    required: true,
                    message: "Please input your Email!",
                  },
                ]}
              >
                <Input />
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
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default Login;
