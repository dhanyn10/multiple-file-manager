import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface NavigationBarProps {
  actionsSlot?: React.ReactNode;
  onHistoryClick: () => void;
  isHistorySidebarOpen: boolean;
  showResizeButtons: boolean;
  onResizeMouseDown: (direction: 'left' | 'right') => void;
  onResizeMouseUp: () => void;
  isCloseResizeButtonHovered: boolean;
  resizeDirection: 'left' | 'right' | null;
}

function NavigationBar({ actionsSlot, onHistoryClick, isHistorySidebarOpen, showResizeButtons, resizeDirection, onResizeMouseDown, onResizeMouseUp, isCloseResizeButtonHovered }: NavigationBarProps) {
  const handleExternalLink = (url: string) => {
    window.ipcRenderer.send('open-external-link', url);
  };

  return (
    <header className="sticky top-0 z-20 bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="font-bold text-xl">File Manager</a>
        <div className="flex items-center space-x-4">
          {actionsSlot}
          {showResizeButtons && (
            <div className={`flex items-center rounded-md transition-all duration-200 ${isCloseResizeButtonHovered ? 'ring-2 ring-red-400' : ''}`}>
              <button
                onMouseDown={() => onResizeMouseDown('left')}
                onMouseUp={onResizeMouseUp}
                onMouseLeave={onResizeMouseUp}
                className={`text-blue-600 px-2 py-1 rounded-l-md text-xs transition-all duration-200 ${
                  resizeDirection === 'left' ? 'bg-blue-200' : 'bg-white hover:bg-blue-100'
                }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button
                onMouseDown={() => onResizeMouseDown('right')}
                onMouseUp={onResizeMouseUp}
                onMouseLeave={onResizeMouseUp}
                className={`text-blue-600 px-2 py-1 rounded-r-md border-l border-blue-200 text-xs transition-all duration-200 ${
                  resizeDirection === 'right' ? 'bg-blue-200' : 'bg-white hover:bg-blue-100'
                }`}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
          <button
            onClick={onHistoryClick}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isHistorySidebarOpen
                ? 'bg-blue-700 text-white'
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
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