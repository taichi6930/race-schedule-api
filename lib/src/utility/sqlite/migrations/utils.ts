import { readFileSync } from 'node:fs';


const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current);
    return result;
};


const readCsvFile = (
    filePath: string,
): {
    headers: string[];
    rows: string[][];
} => {
    const fileContent = readFileSync(filePath, 'utf8');
    const lines: string[] = fileContent.split('\n');

    if (lines.length < 2) {
        throw new Error('CSVファイルにデータがありません');
    }

    const headers: string[] = parseLine(lines[0].trim());
    const rows: string[][] = lines
        .slice(1)
        .map((line: string): string => line.trim())
        .filter((line: string): boolean => line.length > 0)
        .map((line: string): string[] => parseLine(line));

    return { headers, rows };
};

export const CsvUtils = {
    parseLine,
    readCsvFile,
} as const;
