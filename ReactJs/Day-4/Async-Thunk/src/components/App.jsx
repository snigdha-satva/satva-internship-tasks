import { Input, Spin, Card, Row, Col, Typography, Alert } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../redux/slices/movieSlice'
import '../styles/App.css'

const { Title } = Typography
const { Search } = Input

function App() {
  const dispatch = useDispatch()
  const { movies, loading, error } = useSelector((state) => state.movies)

  const handleSearch = (value) => {
    if (value.trim()) {
      dispatch(fetchMovies(value))
    }
  }

  return (
    <div className="appContainer">
        <Title level={2} className="pageTitle">
          Movie Search
        </Title>

        <div className="searchBar">
          <Search
            placeholder="Search movies..."
            enterButton="Search"
            size="large"
            onSearch={handleSearch}
          />
      </div>

      {loading && (
        <div className="loaderContainer">
          <Spin size="large"
           />
        </div>
      )}

      {error && (
        <div className="errorContainer">
          <Alert type="error" message={error} />
        </div>
      )}
      <div className="gridWrapper">
        <Row gutter={[24, 24]} className="movieGrid">
          {movies.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.show.id}>
              <Card
                title={item.show.name}
                variant="outlined"
                hoverable
                className="movieCard"
              >
                <div
                  className="movieDescription"
                  dangerouslySetInnerHTML={{
                    __html: item.show.summary || 'No description available'
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default App