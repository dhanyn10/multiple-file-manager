import { useState, useRef, CSSProperties, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

interface ActionButtonsProps {
  selectedFileCount: number;
  onExecuteClick: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onDetectMissingFiles?: () => void;
  isNavbarVersion?: boolean; // To differentiate between the main and navbar versions
}

const ActionButtons = ({
  selectedFileCount,
  onExecuteClick,
  onSelectAll,
  onDeselectAll,
  onDetectMissingFiles,
  isNavbarVersion = false
}: ActionButtonsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [buttonStyle, setButtonStyle] = useState<CSSProperties>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isHovered && containerRef.current && leftContentRef.current && buttonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonWidth = buttonRef.current.offsetWidth;
      const leftContentWidth = leftContentRef.current.offsetWidth;

      // Cursor's X position relative to the container's left edge
      const cursorX = e.clientX - containerRect.left;

      // Calculate the maximum right position to avoid overlapping the left content
      const margin = 32; // 32px margin
      const maxRight = containerRect.width - (leftContentWidth + margin + (buttonWidth / 2));

      // Calculate the button's new right position based on cursor
      const newRight = containerRect.width - cursorX;
      const finalRight = Math.min(newRight, maxRight);

      setButtonStyle({
        transform: `translateX(${-finalRight}px) translateY(-50%) translateX(50%) scale(1.1)`,
      });
    }
  }, [isHovered]); // Re-create function only if isHovered changes


  if (isNavbarVersion) {
    return (
      <div className="flex items-center space-x-4 text-white">
        <button onClick={onSelectAll} className="text-sm font-medium text-blue-100 hover:text-white">Select All</button>
        <button onClick={onDeselectAll} className="text-sm font-medium text-blue-100 hover:text-white">Deselect All</button>
        <span className="text-sm font-medium">{selectedFileCount} file(s) selected</span>
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="p-2 rounded-md hover:bg-blue-700"
            aria-label="More options"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 text-slate-800">
              <button
                onClick={() => { onDetectMissingFiles?.(); setIsDropdownOpen(false); }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
              >
                Detect Missing Files
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onExecuteClick}
          className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
        >
          Next
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        setButtonStyle({}); // Reset style to avoid jump on first enter
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-between w-full h-full"
    >
      <div ref={leftContentRef} className="flex items-center gap-4 z-10">
        <span className="text-sm font-medium text-slate-700">{selectedFileCount} file(s) selected</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onSelectAll}
            className="px-2 py-1 bg-white/50 text-slate-700 text-xs font-semibold rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer"
          >
            Select All
          </button>
          <button onClick={onDeselectAll} className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer">
            Deselect All
          </button>
        </div>
      </div>
      <button
        ref={buttonRef}
        onClick={onExecuteClick}
        style={isHovered ? buttonStyle : {}}
        className={`absolute top-1/2 right-0 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-100 ease-out cursor-pointer ${
          isHovered ? '' : '-translate-y-1/2'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default ActionButtons;