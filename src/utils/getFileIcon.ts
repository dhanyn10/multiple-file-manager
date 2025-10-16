import {
  faFile,
  faFileImage,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileZipper,
  faFileAudio,
  faFileVideo,
  faFileCode,
  faFileCsv,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

const iconMap: { [key: string]: IconDefinition } = {
  // Images
  jpg: faFileImage,
  jpeg: faFileImage,
  png: faFileImage,
  gif: faFileImage,
  bmp: faFileImage,
  svg: faFileImage,
  webp: faFileImage,

  // Documents
  pdf: faFilePdf,
  doc: faFileWord,
  docx: faFileWord,
  xls: faFileExcel,
  xlsx: faFileExcel,
  ppt: faFilePowerpoint,
  pptx: faFilePowerpoint,

  // Archives
  zip: faFileZipper,
  rar: faFileZipper,
  '7z': faFileZipper,
  tar: faFileZipper,
  gz: faFileZipper,

  // Audio
  mp3: faFileAudio,
  wav: faFileAudio,
  ogg: faFileAudio,
  flac: faFileAudio,

  // Video
  mp4: faFileVideo,
  mkv: faFileVideo,
  avi: faFileVideo,
  mov: faFileVideo,
  webm: faFileVideo,

  // Code
  js: faFileCode,
  jsx: faFileCode,
  ts: faFileCode,
  tsx: faFileCode,
  html: faFileCode,
  css: faFileCode,
  json: faFileCode,
  py: faFileCode,
  java: faFileCode,
  c: faFileCode,
  cpp: faFileCode,
  cs: faFileCode,
  go: faFileCode,
  php: faFileCode,
  rb: faFileCode,
  rs: faFileCode,
  md: faFileCode,
  sh: faFileCode,

  // Data
  csv: faFileCsv,
};

export const getFileIcon = (fileName: string): IconDefinition => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension && iconMap[extension]) {
    return iconMap[extension];
  }
  return faFile; // Default icon
};