/**
 * Data Export/Import Utilities
 * 
 * Provides functionality to export evaluation data to JSON/CSV and import from files.
 * All data is stored in localStorage and can be backed up/restored using these utilities.
 */

import { EvaluationRecord } from '@/contexts/EvaluationContext';

const EVALUATION_STORAGE_KEY = 'convivencia_evaluations';

/**
 * Export evaluation data to JSON format
 */
export function exportToJSON(): string {
  const stored = localStorage.getItem(EVALUATION_STORAGE_KEY);
  const data = stored ? JSON.parse(stored) : [];
  
  return JSON.stringify(data, null, 2);
}

/**
 * Export evaluation data to CSV format
 */
export function exportToCSV(): string {
  const stored = localStorage.getItem(EVALUATION_STORAGE_KEY);
  const records: EvaluationRecord[] = stored ? JSON.parse(stored) : [];
  
  if (records.length === 0) {
    return 'No data to export';
  }

  // Get all unique keys from records
  const keys = Array.from(
    new Set(records.flatMap(record => Object.keys(record)))
  );

  // Create header row
  const header = keys.join(',');

  // Create data rows
  const rows = records.map(record => {
    return keys.map(key => {
      const value = (record as any)[key];
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Download data as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import evaluation data from JSON file
 */
export async function importFromJSON(file: File): Promise<EvaluationRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (!Array.isArray(data)) {
          reject(new Error('Invalid JSON format: expected an array'));
          return;
        }

        // Validate that records have the expected structure
        const validRecords = data.filter((record: any) => {
          return record.id && record.sessionNumber && record.date && record.groupName;
        });

        if (validRecords.length === 0) {
          reject(new Error('No valid evaluation records found in file'));
          return;
        }

        resolve(validRecords);
      } catch (error) {
        reject(new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Import evaluation data from CSV file
 */
export async function importFromCSV(file: File): Promise<EvaluationRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('CSV file must have at least a header row and one data row'));
          return;
        }

        // Parse header
        const headers = parseCSVLine(lines[0]);
        
        // Parse data rows
        const records: EvaluationRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          const record: any = {};
          
          headers.forEach((header, index) => {
            record[header] = values[index] ?? '';
          });

          // Validate required fields
          if (record.id && record.sessionNumber && record.date && record.groupName) {
            // Convert numeric fields
            record.sessionNumber = parseInt(record.sessionNumber, 10);
            record.beforeMixedInteractions = parseInt(record.beforeMixedInteractions || '0', 10);
            record.afterMixedInteractions = parseInt(record.afterMixedInteractions || '0', 10);
            
            records.push(record as EvaluationRecord);
          }
        }

        if (records.length === 0) {
          reject(new Error('No valid evaluation records found in CSV'));
          return;
        }

        resolve(records);
      } catch (error) {
        reject(new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Parse a CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Merge imported records with existing records
 */
export function mergeRecords(
  existingRecords: EvaluationRecord[],
  newRecords: EvaluationRecord[]
): EvaluationRecord[] {
  // Create a map of existing records by ID for quick lookup
  const existingMap = new Map(existingRecords.map(r => [r.id, r]));

  // Add or update records
  newRecords.forEach(newRecord => {
    existingMap.set(newRecord.id, newRecord);
  });

  // Return merged records as array
  return Array.from(existingMap.values());
}

/**
 * Save records to localStorage
 */
export function saveRecordsToStorage(records: EvaluationRecord[]): void {
  localStorage.setItem(EVALUATION_STORAGE_KEY, JSON.stringify(records));
}

/**
 * Get all records from localStorage
 */
export function getRecordsFromStorage(): EvaluationRecord[] {
  const stored = localStorage.getItem(EVALUATION_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Clear all evaluation data from localStorage
 */
export function clearAllData(): void {
  localStorage.removeItem(EVALUATION_STORAGE_KEY);
}

/**
 * Create a backup of all data with timestamp
 */
export function createBackup(): { timestamp: string; data: EvaluationRecord[] } {
  const records = getRecordsFromStorage();
  const timestamp = new Date().toISOString();
  return { timestamp, data: records };
}

/**
 * Restore data from a backup
 */
export function restoreFromBackup(backup: { timestamp: string; data: EvaluationRecord[] }): void {
  saveRecordsToStorage(backup.data);
}
