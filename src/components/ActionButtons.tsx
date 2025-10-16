import { useState, useRef } from 'react';

interface ActionButtonsProps {
  selectedFileCount: number;
  onExecuteClick: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  isNavbarVersion?: boolean; // To differentiate between the main and navbar versions
}

const ActionButtons = ({
  selectedFileCount,
  onExecuteClick,
  onSelectAll,
  onDeselectAll,
  isNavbarVersion = false
}: ActionButtonsProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && textRef.current && buttonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate the right edge of the left-side content
      const leftContentWidth = textRef.current.offsetWidth;
      
      // Get button width to prevent overlap
      const buttonWidth = buttonRef.current.offsetWidth;
      
      // Add a larger margin
      const margin = 32; // Add a 32px margin
      const minX = leftContentWidth + margin + (buttonWidth / 2);

      // Get the cursor's X position relative to the container
      let newX = e.clientX - containerRect.left;

      // Clamp the position so it doesn't go past the minimum X
      setPosition({ x: Math.max(newX, minX), y: 0 });
    }
  };

  if (isNavbarVersion) {
    return (
      <div className="flex items-center space-x-4">
        <button onClick={onSelectAll} className="text-sm font-medium text-blue-100 hover:text-white cursor-pointer">Select All</button>
        <button onClick={onDeselectAll} className="text-sm font-medium text-blue-100 hover:text-white cursor-pointer">Deselect All</button>
        <span className="text-sm font-medium">{selectedFileCount} file(s) selected</span>
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-between w-full h-full"
    >
      <div ref={textRef} className="flex items-center gap-4">
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
        style={{ left: isHovered ? `${position.x}px` : 'auto', right: isHovered ? 'auto' : '0' }}
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-100 ease-out cursor-pointer ${isHovered ? 'scale-110' : 'translate-x-0'}`}
      >
        Next
      </button>
    </div>
  );
};

export default ActionButtons;