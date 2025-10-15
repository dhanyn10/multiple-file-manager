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
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {currentFiles.map((file) => (
          <li
            key={file.name}
            className={`p-2 flex items-center cursor-pointer transition-colors duration-150 ${
              file.isDirectory
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
                : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
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