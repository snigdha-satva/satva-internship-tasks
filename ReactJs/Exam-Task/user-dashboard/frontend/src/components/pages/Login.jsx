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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: "none",
        }}
        styles={{ body: { padding: "40px 40px 32px" } }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <LockOutlined style={{ color: "#fff", fontSize: 24 }} />
          </div>
          <Title level={3} style={{ margin: 0, color: "#1a1a2e" }}>
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
              prefix={<MailOutlined style={{ color: "#bbb" }} />}
              placeholder="Email address"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bbb" }} />}
              placeholder="Password"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                borderRadius: 8,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                fontWeight: 600,
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;