import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import NavigationBar from './components/NavigationBar';
import FileList from './components/FileList';
import FilePagination from './components/FilePagination';
import './App.css';

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
                <FileList currentFiles={currentFiles} />
              </Col>
            </Row>
            <FilePagination
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              setCurrentPage={setCurrentPage}
              pageCount={pageCount}
              currentPage={currentPage}
            />
          </div>
        )}
      </Container>
    </div>
  )
}

export default App
