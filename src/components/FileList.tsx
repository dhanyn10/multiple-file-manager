import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';

interface FileEntry {
  name: string;
  isDirectory: boolean;
}

interface FileListProps {
  currentFiles: FileEntry[];
  selectedFiles: Set<string>;
  onFileSelect: (fileName: string, isShiftClick: boolean) => void;
}

const FileList = ({ currentFiles, selectedFiles, onFileSelect }: FileListProps) => {
  const handleItemClick = (e: React.MouseEvent, file: FileEntry) => {
    // Selection only applies to files, not folders
    if (file.isDirectory) {
      return;
    }
    onFileSelect(file.name, e.shiftKey);
  };

  return (
    <div className="h-full overflow-y-auto bg-white rounded-md border border-gray-200">
      <ul className="divide-y divide-gray-200 select-none">
        {currentFiles.map((file) => (
          <li
            key={file.name}
            onClick={(e) => handleItemClick(e, file)}
            className={`p-2 flex items-center transition-colors duration-150 ${
              file.isDirectory ? 'cursor-default' : 'cursor-pointer'
            } ${selectedFiles.has(file.name)
                ? 'bg-blue-100' // Style for selected item
                : file.isDirectory ? 'hover:bg-gray-100' : 'hover:bg-blue-50'
              } `}
          >
            <FontAwesomeIcon
              icon={file.isDirectory ? faFolder : faFile}
              className={`mr-3 ${file.isDirectory ? 'text-blue-500' : 'text-gray-500'}`}
            />
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;