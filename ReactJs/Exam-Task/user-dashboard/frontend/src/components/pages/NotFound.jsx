import { Result, Button } from "antd"
import { useNavigate } from "react-router-dom"

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="center-page">
      <Result
        status="404"
        title="404"
        subTitle="The page you are looking for does not exist."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back to Login
          </Button>
        }
      />
    </div>
  )
}

export default NotFound