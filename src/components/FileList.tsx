import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { getFileIcon } from '../utils/getFileIcon';
import FileNameWithCursor from './FileNameWithCursor';

interface FileEntry {
  name: string;
  isDirectory: boolean;
}

interface FileListProps {
  currentFiles: FileEntry[];
  selectedFiles: Set<string>;
  highlightedFiles: Set<string>;
  activeAction: string;
  cursorIndex: number | null;
  onFileSelect: (fileName: string, isShiftClick: boolean) => void;
}

const FileList = ({
  currentFiles,
  selectedFiles,
  highlightedFiles,
  activeAction,
  cursorIndex,
  onFileSelect,
}: FileListProps) => {
  const handleItemClick = (e: React.MouseEvent, file: FileEntry) => {
    // Selection only applies to files, not folders
    if (file.isDirectory) {
      return;
    }
    onFileSelect(file.name, e.shiftKey);
  };

  const showCursor = activeAction === 'rename-by-index' || activeAction === 'insert-at-index';

  return (
    <div className="h-full overflow-y-auto bg-white rounded-md border border-gray-200">
      <ul className="divide-y divide-gray-200 select-none">
        {currentFiles.map((file) => (
          <li
            key={file.name}
            onClick={(e) => handleItemClick(e, file)}
            className={`p-2 flex items-center file-item ${
              file.isDirectory // Folder
                ? 'cursor-default hover:bg-gray-100' // Gray hover
                : highlightedFiles.has(file.name) // Newly renamed file
                ? 'bg-blue-100 hover:bg-white cursor-pointer' // Blue background, white on hover
                : selectedFiles.has(file.name) // Selected file
                ? 'bg-blue-100 hover:bg-blue-50 cursor-pointer' // Blue background, light blue on hover
                : 'cursor-pointer hover:bg-blue-50' // Normal file, light blue on hover
            }`}
          >
            <FontAwesomeIcon
              icon={file.isDirectory ? faFolder : getFileIcon(file.name)}
              className={`mr-3 ${file.isDirectory ? 'text-blue-500' : 'text-gray-500'}`}
            />
            {file.isDirectory ? (
              <span className="break-all font-mono">{file.name}</span>
            ) : (
              <FileNameWithCursor
                fileName={file.name}
                cursorIndex={
                  showCursor && selectedFiles.has(file.name) ? cursorIndex : null
                }
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;