interface NavigationBarProps {
  actionsSlot?: React.ReactNode;
  onHistoryClick: () => void;
}

function NavigationBar({ actionsSlot, onHistoryClick }: NavigationBarProps) {
  const handleExternalLink = (url: string) => {
    window.ipcRenderer.send('open-external-link', url);
  };

  return (
    <header className="sticky top-0 z-20 bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="font-bold text-xl">File Manager</a>
        <div className="flex items-center space-x-4">
          {actionsSlot}
          <button
            onClick={onHistoryClick}
            className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            History
          </button>
          <button
            onClick={() => handleExternalLink('https://github.com/dhanyn10/multiple-file-manager')}
            className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            GitHub
          </button>
          <button
            onClick={() => handleExternalLink('https://github.com/dhanyn10/multiple-file-manager/issues')}
            className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Issues
          </button>
        </div>
      </nav>
    </header>
  );
}

export default NavigationBar;