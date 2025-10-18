import { useState, useEffect, useRef, RefObject } from 'react';
import { ActionSidebarRef } from '../components/ActionSidebar';
import { HistorySidebarRef } from '../components/HistorySidebar';

export const useResize = (
    isModalOpen: boolean,
    isHistorySidebarOpen: boolean,
    actionSidebarRef: RefObject<ActionSidebarRef>,
    historySidebarRef: RefObject<HistorySidebarRef>
) => {
    const [isResizing, setIsResizing] = useState(false);
    const [showResizeButtons, setShowResizeButtons] = useState(false);
    const [isCloseResizeButtonHovered, setIsCloseResizeButtonHovered] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<'left' | 'right' | null>(null);
    const resizeIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isResizing) {
            document.body.classList.add('resizing-sidebar');
        } else {
            document.body.classList.remove('resizing-sidebar');
        }
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            setShowResizeButtons(true);
        }
    }, [isResizing]);

    useEffect(() => {
        if (!isModalOpen && !isHistorySidebarOpen) {
            setShowResizeButtons(false);
        }
    }, [isModalOpen, isHistorySidebarOpen]);

    useEffect(() => {
        if (!isResizing) {
            setResizeDirection(null);
        }
    }, [isResizing]);

    const handleResizeClick = (direction: 'left' | 'right') => {
        const step = 10;
        const multiplier = direction === 'left' ? 1 : -1;
        const change = step * multiplier;

        if (isModalOpen && actionSidebarRef.current) {
            actionSidebarRef.current.setWidth(actionSidebarRef.current.getWidth() + change);
        }

        if (isHistorySidebarOpen && historySidebarRef.current) {
            historySidebarRef.current.setWidth(historySidebarRef.current.getWidth() + change);
        }
    };

    const handleResizeMouseDown = (direction: 'left' | 'right') => {
        if (resizeIntervalRef.current) clearInterval(resizeIntervalRef.current);
        handleResizeClick(direction);
        resizeIntervalRef.current = window.setInterval(() => handleResizeClick(direction), 50);
    };

    const handleResizeMouseUp = () => {
        if (resizeIntervalRef.current) clearInterval(resizeIntervalRef.current);
        resizeIntervalRef.current = null;
    };

    const handleCloseResizeButtons = () => setShowResizeButtons(false);

    return { isResizing, setIsResizing, showResizeButtons, isCloseResizeButtonHovered, setIsCloseResizeButtonHovered, resizeDirection, setResizeDirection, handleResizeMouseDown, handleResizeMouseUp, handleCloseResizeButtons };
};