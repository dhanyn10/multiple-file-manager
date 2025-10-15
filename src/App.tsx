import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, ListGroup, Pagination } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';

import './App.css'

interface FileEntry {
  name: string;
  isDirectory: boolean;
}

function App() {
  const [directory, setDirectory] = useState('');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const handleDirectorySelected = (_event: any, path: string) => {
      if (path) {
        setDirectory(path);
        window.ipcRenderer.send('get-directory-contents', path);
      }
    };

    const handleDirectoryContents = (_event: any, fileList: FileEntry[]) => {
      setFiles(fileList);
      setCurrentPage(1); // Reset to the first page every time the directory changes
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

  // Logika Paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFiles = files.slice(indexOfFirstItem, indexOfLastItem);

  const pageCount = Math.ceil(files.length / itemsPerPage);

  const renderPaginationItems = () => {
    const items = [];
    for (let number = 1; number <= pageCount; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <NavigationBar />
      <Container fluid className="d-flex flex-column flex-grow-1 p-4">
        <Row className="flex-shrink-0">
          <Col>
            <Form.Group>
              <Form.Label>Select Directory:</Form.Label>
              <InputGroup>
                <Form.Control type="text" value={directory} readOnly placeholder="No directory selected" />
                <Button variant="outline-secondary" onClick={handleBrowseClick}>
                  Browse...
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        {files.length > 0 && (
          <div className="d-flex flex-column flex-grow-1 mt-4" style={{ minHeight: 0 }}>
            <Row className="flex-grow-1 mt-3" style={{ minHeight: 0 }}>
              <Col>
                <div style={{ height: '100%', overflowY: 'auto' }}>
                  <ListGroup>
                    {currentFiles.map((file) => (
                      <ListGroup.Item key={file.name}>
                        <FontAwesomeIcon
                          icon={file.isDirectory ? faFolder : faFile}
                          className="me-2"
                          style={{ color: file.isDirectory ? '#58a6ff' : '#8b949e' }}
                        />
                        {file.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Col>
            </Row>
            <Row className="mt-3 flex-shrink-0 align-items-center">
              <Col xs="auto">
                <Form.Group as={Row} className="align-items-center gx-2">
                  <Form.Label column xs="auto">Show:</Form.Label>
                  <Col xs="auto">
                    <Form.Select
                      style={{ width: '80px' }}
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
              <Col>
                {pageCount > 1 && (
                  <Pagination className="justify-content-end mb-0">{renderPaginationItems()}</Pagination>
                )}
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </div>
  )
}

export default App
