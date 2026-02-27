import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/authSlice";
import { fetchPermissions, fetchRoles } from "../../redux/slices/roleSlice";
import { loginService } from "../../../../backend/services/authService";
import useAuth from "../../hooks/useAuth";

const { Title, Text } = Typography;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { user, token } = await loginService(values.email, values.password);
      dispatch(login({ user, token }));
      await dispatch(fetchRoles());
      await dispatch(fetchPermissions());
      message.success("Login Successful!");
      navigate("/", { replace: true });
    } catch {
      message.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]">
      <Card className="w-[420px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-none">
        <div className="px-10 pt-10 pb-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] flex items-center justify-center mx-auto mb-4">
              <LockOutlined className="text-white text-2xl" />
            </div>
            <Title level={3} className="m-0 text-[#1a1a2e]">
              Welcome Back
            </Title>
            <Text type="secondary">Sign in to your RBAC dashboard</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email address"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-11 rounded-lg font-semibold bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] border-none"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
}

export default Login;