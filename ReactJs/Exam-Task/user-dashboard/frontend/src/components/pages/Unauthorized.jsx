import { Result, Button } from "antd"
import { useNavigate } from "react-router-dom"

function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className="center-page">
      <Result
        status="403"
        title="403"
        subTitle="You do not have permission to access this page."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back to Login
          </Button>
        }
      />
    </div>
  )
}

export default Unauthorized