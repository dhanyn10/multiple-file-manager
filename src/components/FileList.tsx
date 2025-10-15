import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';

interface FileEntry {
  name: string;
  isDirectory: boolean;
}

interface FileListProps {
  currentFiles: FileEntry[];
}

const FileList = ({ currentFiles }: FileListProps) => {
  return (
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
  );
};

export default FileList;