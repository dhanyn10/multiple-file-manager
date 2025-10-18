import { useState, useEffect } from 'react';
import { RenameOperation } from '../components/ActionSidebar';

interface ClearHistoryResult {
    success: boolean;
    error?: string;
}

export const useOperationHistory = (
    directory: string,
    selectedFiles: Set<string>,
    setSelectedFiles: (files: Set<string>) => void,
    setLastSelectedFile: (file: string | null) => void,
    setRecentlyRenamed: (files: Set<string>) => void,
    setIsHistorySidebarOpen: (isOpen: boolean) => void
) => {
    const [undoStack, setUndoStack] = useState<RenameOperation[]>([]);
    const [redoStack, setRedoStack] = useState<RenameOperation[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            const savedHistory = await window.ipcRenderer.invoke('get-rename-history');
            if (Array.isArray(savedHistory)) {
                setUndoStack(savedHistory as RenameOperation[]);
                setRedoStack([]);
            }
        };
        void fetchHistory();
    }, []);

    const handleExecuteRename = (operations: RenameOperation[]) => {
        if (operations.length > 0) {
            window.ipcRenderer.send('execute-rename', directory, operations);
            setUndoStack(prev => [...operations, ...prev]);
            setRedoStack([]);
            const newNames = new Set(operations.map(op => op.newName));
            setRecentlyRenamed(newNames);
            setIsHistorySidebarOpen(true);
        }
    };

    const handleExecuteDelete = (operations: { fileName: string; timestamp: string }[]) => {
        if (operations.length > 0) {
            const filesToDelete = operations.map(op => op.fileName);
            window.ipcRenderer.send('execute-delete', directory, filesToDelete);

            const undoOps: RenameOperation[] = operations.map(op => ({
                originalName: op.fileName,
                newName: `DELETED_${op.timestamp}`,
                timestamp: op.timestamp,
            }));

            setUndoStack(prev => [...undoOps, ...prev]);
            setRedoStack([]);
            setRecentlyRenamed(new Set());
            setIsHistorySidebarOpen(true);

            const newSelectedFiles = new Set(selectedFiles);
            filesToDelete.forEach(file => newSelectedFiles.delete(file));
            setSelectedFiles(newSelectedFiles);
            setLastSelectedFile(null);
        }
    };

    const handleUndo = (operationToUndo: RenameOperation) => {
        const newUndoStack = undoStack.filter(op => op.timestamp !== operationToUndo.timestamp);
        if (newUndoStack.length === undoStack.length) return;

        if (operationToUndo.newName.startsWith('DELETED_')) {
            window.ipcRenderer.send('execute-restore', directory, [operationToUndo.originalName]);
        } else {
            const reversedOp: RenameOperation = {
                originalName: operationToUndo.newName,
                newName: operationToUndo.originalName,
                timestamp: new Date().toISOString()
            };
            window.ipcRenderer.send('execute-rename', directory, [reversedOp]);
        }

        setUndoStack(newUndoStack);
        setRedoStack(prev => [operationToUndo, ...prev]);
    };

    const handleRedo = (operationToRedo: RenameOperation) => {
        const newRedoStack = redoStack.filter(op => op.timestamp !== operationToRedo.timestamp);
        if (newRedoStack.length === redoStack.length) return;

        if (operationToRedo.newName.startsWith('DELETED_')) {
            window.ipcRenderer.send('execute-delete', directory, [operationToRedo.originalName]);
        } else {
            window.ipcRenderer.send('execute-rename', directory, [operationToRedo]);
        }

        setRedoStack(newRedoStack);
        setUndoStack(prev => [operationToRedo, ...prev]);
    };

    const handleClearHistory = async () => {
        const result: ClearHistoryResult = await window.ipcRenderer.invoke('clear-rename-history');
        if (result.success) {
            setUndoStack([]);
            setRedoStack([]);
        }
    };

    return {
        undoStack, setUndoStack,
        redoStack, setRedoStack,
        handleExecuteRename, handleExecuteDelete,
        handleUndo, handleRedo, handleClearHistory,
    };
};