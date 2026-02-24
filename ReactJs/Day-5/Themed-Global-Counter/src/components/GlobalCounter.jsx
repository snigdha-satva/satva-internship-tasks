import { Card, Button, Space, Statistic, Switch, Typography } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  increment,
  decrement,
  reset,
  toggleLock,
} from "../redux/slices/counterSlice";

const { Text } = Typography;

function GlobalCounter() {
  const dispatch = useDispatch();
  const { value, locked } = useSelector((state) => state.counter);

  return (
    <Card
      style={{
        maxWidth: 400,
        margin: "40px auto",
        borderRadius: 12,
        textAlign: "center",
      }}
    >
      <Statistic
        title="Global Counter"
        value={value}
        style={{ marginBottom: 24 }}
      />

      <Space size="middle">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => dispatch(increment())}
          disabled={locked}
        >
          Increment
        </Button>

        <Button
          danger
          icon={<MinusOutlined />}
          onClick={() => dispatch(decrement())}
          disabled={locked}
        >
          Decrement
        </Button>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => dispatch(reset())}
        >
          Reset
        </Button>
      </Space>

      <div style={{ marginTop: 32 }}>
        <Space>
          <Text>Lock Counter</Text>
          <Switch
            checked={locked}
            onChange={() => dispatch(toggleLock())}
            checkedChildren={<LockOutlined />}
            unCheckedChildren={<UnlockOutlined />}
          />
        </Space>
      </div>
    </Card>
  );
}

export default GlobalCounter;