import { useState, useCallback } from 'react';

export const useSidebarState = (
    setStartIndex: (val: string) => void,
    setEndIndex: (val: string) => void,
    setIndexOffset: (val: number) => void
) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);

    const handleExecuteClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        // Reset action-specific state when closing the sidebar
        setStartIndex('');
        setEndIndex('');
        setIndexOffset(0);
    }, [setIsModalOpen, setStartIndex, setEndIndex, setIndexOffset]);

    const handleHistoryClick = () => {
        setIsHistorySidebarOpen(prevState => !prevState);
    };

    return {
        isModalOpen, setIsModalOpen, isHistorySidebarOpen, setIsHistorySidebarOpen, handleExecuteClick, handleCloseModal, handleHistoryClick
    };
};