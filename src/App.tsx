import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import NavigationBar from './NavigationBar.tsx';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavigationBar />
      <Container fluid className="text-center mt-4">
        <Row className="justify-content-center my-4">
          <Col xs="auto">
            <a href="https://electron-vite.github.io" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
          </Col>
          <Col xs="auto">
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </Col>
        </Row>
        <h1>Vite + React</h1>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="my-4">
              <Card.Body>
                <Button variant="primary" onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </Button>
                <Card.Text className="mt-3">
                  Edit <code>src/App.tsx</code> and save to test HMR
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      </Container>
    </>
  )
}

export default App
