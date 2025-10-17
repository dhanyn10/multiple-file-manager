export interface MissingSequence {
  prefix: string;
  suffix: string;
  missingNumbers: number[];
  minNumber: number;
  maxNumber: number;
  originalFormat: string; // To help reconstruct the missing file names
  paddingLength: number;
}

/**
 * Detects missing numerical sequences in a list of file names.
 * It looks for patterns like "file1.txt", "image_005.jpg", "document (10).pdf".
 *
 * @param fileNames An array of file names (strings).
 * @returns An array of MissingSequence objects, each describing a detected gap.
 */
export function detectMissingFiles(fileNames: string[]): MissingSequence[] {
  const detectedSequences: {
    [key: string]: {
      numbers: Set<number>;
      originalPrefix: string;
      originalSuffix: string;
      paddingLength: number; // To reconstruct numbers with leading zeros
    };
  } = {};

  // Regex to capture prefix, number (with optional leading zeros), and suffix
  // It tries to be flexible:
  // Group 1: prefix (anything before the number)
  // Group 2: the number itself (e.g., "001", "10"). It's the last group of digits in the name.
  // Group 3: suffix (anything after the number, including extension).
  const regex = /^(.*?)(\d+)([^0-9]*)$/;

  fileNames.forEach(fileName => {
    const match = fileName.match(regex);
    if (match && !/^\d+$/.test(fileName)) { // Ensure it's not just a number and has some context
      const prefix = match[1];
      const numberStr = match[2];
      const suffix = match[3];
      const number = parseInt(numberStr, 10);
      const paddingLength = numberStr.length;

      // Create a unique key for the sequence based on prefix, suffix, and number padding length.
      // This separates sequences like `file1.txt` from `file01.txt`.
      const sequenceKey = `${prefix}___${suffix}___${paddingLength}`;

      if (!detectedSequences[sequenceKey]) {
        detectedSequences[sequenceKey] = {
          numbers: new Set<number>(),
          originalPrefix: prefix,
          originalSuffix: suffix,
          paddingLength: paddingLength, // All members of this sequence will have the same padding length
        };
      }
      detectedSequences[sequenceKey].numbers.add(number);
    }
  });

  const results: MissingSequence[] = [];

  for (const sequenceKey in detectedSequences) {
    const { numbers, originalPrefix, originalSuffix, paddingLength } = detectedSequences[sequenceKey];
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    if (sortedNumbers.length > 1) { // Need at least two numbers to infer a sequence
      const minNumber = sortedNumbers[0];
      const maxNumber = sortedNumbers[sortedNumbers.length - 1];
      const missingNumbers: number[] = [];

      for (let i = minNumber; i <= maxNumber; i++) {
        if (!numbers.has(i)) {
          missingNumbers.push(i);
        }
      }

      if (missingNumbers.length > 0) {
        // Reconstruct a representative format string for display
        const exampleNumber = sortedNumbers[0];
        const formattedExampleNumber = String(exampleNumber).padStart(paddingLength, '0');
        const originalFormat = `${originalPrefix}${formattedExampleNumber}${originalSuffix}`;

        results.push({
          prefix: originalPrefix,
          suffix: originalSuffix,
          missingNumbers,
          minNumber,
          maxNumber,
          originalFormat,
          paddingLength,
        });
      }
    }
  }
  return results;
}