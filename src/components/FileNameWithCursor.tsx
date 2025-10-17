interface FileNameWithCursorProps {
  fileName: string;
  startIndex: number | null;
  endIndex?: number | null;
}

const FileNameWithCursor = ({ fileName, startIndex, endIndex }: FileNameWithCursorProps) => {
  if (startIndex === null || startIndex < 0 || startIndex > fileName.length) {
    return <span className="break-all font-mono">{fileName}</span>;
  }

  // If endIndex is provided and valid, highlight the range
  if (endIndex !== null && endIndex !== undefined && endIndex > startIndex) {
    // Cap the endIndex at the file's length to prevent errors.
    const cappedEndIndex = Math.min(endIndex, fileName.length);

    const lastDotIndex = fileName.lastIndexOf('.');
    // If there's an extension and the endIndex goes beyond it, cap it at the dot.
    // Make sure the dot is after the startIndex.
    const effectiveEndIndex = (lastDotIndex > startIndex && cappedEndIndex > lastDotIndex)
      ? lastDotIndex
      : cappedEndIndex;

    const before = fileName.substring(0, startIndex);
    const highlighted = fileName.substring(startIndex, effectiveEndIndex);
    const after = fileName.substring(effectiveEndIndex);
    return (
      <span className="break-all font-mono relative">
        {before}
        <span className="bg-blue-300/50 rounded-sm">{highlighted}</span>
        {after}
      </span>
    );
  }

  // Otherwise, just show the cursor at startIndex
  const before = fileName.substring(0, startIndex);
  const after = fileName.substring(startIndex);

  return (
    <span className="break-all font-mono relative">
      {before}
      <span
        className="absolute inline-block w-px h-[1.1em] bg-blue-600 animate-pulse -translate-y-px"
      />
      {after}
    </span>
  );
};

export default FileNameWithCursor;