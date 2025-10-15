import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import NavigationBar from './NavigationBar.tsx';
import './App.css'

interface FileEntry {
  name: string;
  isDirectory: boolean;
}

function App() {
  const [directory, setDirectory] = useState('');
  const [files, setFiles] = useState<FileEntry[]>([]);

  useEffect(() => {
    const handleDirectorySelected = (_event: any, path: string) => {
      if (path) {
        setDirectory(path);
        window.ipcRenderer.send('get-directory-contents', path);
      }
    };

    const handleDirectoryContents = (_event: any, fileList: FileEntry[]) => {
      setFiles(fileList);
    };

    window.ipcRenderer.on('directory-selected', handleDirectorySelected);
    window.ipcRenderer.on('directory-contents', handleDirectoryContents);

    return () => {
      window.ipcRenderer.off('directory-selected', handleDirectorySelected);
      window.ipcRenderer.off('directory-contents', handleDirectoryContents);
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
        {files.length > 0 && (
          <Row className="mt-4">
            <Col>
              <ListGroup>
                {files.map((file) => (
                  <ListGroup.Item key={file.name}>{file.isDirectory ? '📁' : '📄'} {file.name}</ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
}

export default App
