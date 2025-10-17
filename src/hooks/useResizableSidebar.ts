import { useState, useCallback, useEffect, useRef } from 'react';

interface UseResizableSidebarProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number | string;
  otherSidebarOpen?: boolean;
  onResizeStart?: () => void;
  onResizeMove?: (direction: 'left' | 'right') => void;
  onResizeEnd?: () => void;
}

export const useResizableSidebar = ({
  initialWidth = 384,
  minWidth = 320,
  maxWidth = '50vw',
  onResizeStart,
  onResizeMove,
  onResizeEnd,
}: UseResizableSidebarProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const startX = useRef(0);
  const startWidth = useRef(initialWidth);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    onResizeStart?.();
  }, [sidebarWidth, onResizeStart]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {      
      const deltaX = e.clientX - startX.current;
      const newWidth = startWidth.current - deltaX;
      const direction = deltaX < 0 ? 'left' : 'right';
      onResizeMove?.(direction);
      if (newWidth >= minWidth) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing, minWidth, onResizeMove, startX, startWidth]);

  useEffect(() => {
    if (isResizing) {
      onResizeStart?.();
    } else {
      onResizeEnd?.();
    }
  }, [isResizing, onResizeStart, onResizeEnd]);


  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]); // handleMouseMove is stable due to useCallback

  return { sidebarWidth, maxWidth, handleMouseDown };
};