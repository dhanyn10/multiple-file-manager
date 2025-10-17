interface ActionPreviewProps {
  selectedFiles: Set<string>;
  selectedAction: string;
  actionFrom: string;
  actionTo: string;
  startIndex: string;
  endIndex: string;
}

const ActionPreview = ({ selectedFiles, selectedAction, actionFrom, actionTo, startIndex, endIndex }: ActionPreviewProps) => {
  const getNewName = (file: string): [string, string] => {
    let newName = file;
    let status = '';

    if (selectedAction === 'delete-duplicated') {
      const duplicatePattern = /(.+?)(?:_(\d+)|_copy|\s*\((\d+)\))?(\.\w+)$/;
      const match = file.match(duplicatePattern);
      if (match) {
        const baseName = match[1];
        const extension = match[4];
        const fullBaseName = `${baseName}${extension}`;
        if (file !== fullBaseName && selectedFiles.has(fullBaseName)) {
          status = 'Will be deleted';
        } else {
          status = 'Will be kept';
        }
      } else {
        status = 'Will be kept';
      }
    } else if (selectedAction === 'rename' && actionFrom) {
      newName = file.replace(actionFrom, actionTo);
    } else if (selectedAction === 'rename-by-index' && startIndex !== '') {
      const start = parseInt(startIndex, 10);
      const end = endIndex !== '' ? parseInt(endIndex, 10) : start + 1;
      if (!isNaN(start) && !isNaN(end) && start < end) {
        const lastDotIndex = file.lastIndexOf('.');
        const effectiveEnd = (lastDotIndex > start && end > lastDotIndex) ? lastDotIndex : end;
        newName = file.slice(0, start) + actionTo + file.slice(effectiveEnd);
      }
    } else if (selectedAction === 'insert-at-index' && startIndex !== '') {
      const insertIndex = parseInt(startIndex, 10);
      if (!isNaN(insertIndex)) {
        newName = file.slice(0, insertIndex) + actionTo + file.slice(insertIndex);
      }
    }

    return [newName, status];
  };

  return (
    <table className="w-full text-sm text-left text-slate-500 table-fixed">
      <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
        <tr>
          <th scope="col" className="px-4 py-2">Original Name</th>
          <th scope="col" className="px-4 py-2">{selectedAction === 'delete-duplicated' ? 'Status' : 'New Name'}</th>
        </tr>
      </thead>
      <tbody>
        {Array.from(selectedFiles).map(file => {
          const [newName, status] = getNewName(file);
          return (
            <tr key={file} className="bg-white border-b border-slate-200/60 hover:bg-slate-50">
              <td className="px-4 py-2 font-medium text-slate-900 break-all">{file}</td>
              <td className={`px-4 py-2 break-all ${status ? (status === 'Will be deleted' ? 'text-red-500 font-semibold' : 'text-green-600') : (newName !== file ? 'text-blue-500 font-semibold' : '')}`}>{status || newName}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ActionPreview;