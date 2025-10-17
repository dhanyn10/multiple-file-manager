import { useState, useCallback, useEffect, RefObject } from 'react';

interface UseResizableSidebarProps {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  otherSidebarOpen?: boolean;
}

export const useResizableSidebar = ({
  initialWidth = 384,
  minWidth = 320,
  maxWidth = 800,
  otherSidebarOpen = false,
}: UseResizableSidebarProps) => {
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX - (otherSidebarOpen ? initialWidth : 0);
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing, minWidth, maxWidth, otherSidebarOpen, initialWidth]);

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
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return { sidebarWidth, handleMouseDown };
};