interface FileNameWithCursorProps {
  fileName: string;
  cursorIndex: number | null;
}

const FileNameWithCursor = ({ fileName, cursorIndex }: FileNameWithCursorProps) => {
  if (cursorIndex === null || cursorIndex < 0 || cursorIndex > fileName.length) {
    return <span className="break-all font-mono">{fileName}</span>;
  }

  const before = fileName.substring(0, cursorIndex);
  const after = fileName.substring(cursorIndex);

  return (
    <span className="break-all font-mono relative">
      {before}
      <span
        className="
          absolute
          inline-block
          w-px
          h-[1.1em]
          bg-blue-600
          animate-pulse
          -translate-y-px
        "
      />
      {after}
    </span>
  );
};

export default FileNameWithCursor;