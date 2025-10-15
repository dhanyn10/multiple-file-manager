import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import NavigationBar from './NavigationBar.tsx';
import './App.css'

function App() {
  const [directory, setDirectory] = useState('');

  useEffect(() => {
    const handleDirectorySelected = (_event: any, path: string) => {
      if (path) {
        setDirectory(path);
      }
    };

    window.ipcRenderer.on('directory-selected', handleDirectorySelected);

    return () => {
      window.ipcRenderer.off('directory-selected', handleDirectorySelected);
    };
  }, []);

  const handleBrowseClick = () => {
    window.ipcRenderer.send('open-directory-dialog');
  };

  return (
    <>
      <NavigationBar />
      <Container className="mt-4">
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Pilih Direktori:</Form.Label>
              <InputGroup>
                <Form.Control type="text" value={directory} readOnly placeholder="Tidak ada direktori yang dipilih" />
                <Button variant="outline-secondary" onClick={handleBrowseClick}>
                  Browse...
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App
