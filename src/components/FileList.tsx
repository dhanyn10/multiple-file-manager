import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';

interface FileEntry {
  name: string;
  isDirectory: boolean;
}

interface FileListProps {
  currentFiles: FileEntry[];
  selectedFiles: Set<string>;
  highlightedFiles: Set<string>;
  onFileSelect: (fileName: string, isShiftClick: boolean) => void;
}

const FileList = ({ currentFiles, selectedFiles, highlightedFiles, onFileSelect }: FileListProps) => {
  const handleItemClick = (e: React.MouseEvent, file: FileEntry) => {
    // Selection only applies to files, not folders
    if (file.isDirectory) {
      return;
    }
    onFileSelect(file.name, e.shiftKey);
  };

  return (
    <div className="h-full overflow-y-auto bg-white rounded-md border border-gray-200">
      <ul className="divide-y divide-gray-200 select-none pt-8 pb-1">
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
              icon={file.isDirectory ? faFolder : faFile}
              className={`mr-3 ${file.isDirectory ? 'text-blue-500' : 'text-gray-500'}`}
            />
            {file.isDirectory ? (
              <span className="break-all font-mono">{file.name}</span>
            ) : (
              <span className="break-all font-mono">
                {file.name.split('').map((char, index) => {
                  // Whitespace needs to be handled specially to be visible and hoverable
                  const isWhitespace = char.trim() === '';
                  return (
                    <span key={index} className="relative group inline-block">
                      <span className={`hover:bg-yellow-200 px-px ${isWhitespace ? 'w-2' : ''}`}>
                        {isWhitespace ? '\u00A0' : char}
                      </span>
                      <span role="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max min-w-[1.5rem] text-center px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        {index + 1}
                      </span>
                    </span>
                  );
                })}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;