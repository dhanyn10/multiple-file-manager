interface ActionButtonsProps {
  selectedFileCount: number;
  onExecuteClick: () => void;
}

const ActionButtons = ({ selectedFileCount, onExecuteClick }: ActionButtonsProps) => (
  <div className="flex items-center space-x-4">
    <span className="text-sm font-medium">{selectedFileCount} file(s) selected</span>
    <button
      onClick={onExecuteClick}
      className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Next
    </button>
  </div>
);

export default ActionButtons;