import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useEvaluation } from '@/contexts/EvaluationContext';
import {
  exportToJSON,
  exportToCSV,
  downloadFile,
  importFromJSON,
  importFromCSV,
  mergeRecords,
  saveRecordsToStorage,
} from '@/lib/dataExport';

type MessageType = 'success' | 'error' | 'info';

interface Message {
  type: MessageType;
  text: string;
}

export default function BackupRestore() {
  const { records } = useEvaluation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleExportJSON = () => {
    try {
      if (records.length === 0) {
        showMessage('info', 'No evaluation records to export');
        return;
      }
      const json = exportToJSON();
      const timestamp = new Date().toISOString().split('T')[0];
      downloadFile(json, `convivencia-evaluations-${timestamp}.json`, 'application/json');
      showMessage('success', `Exported ${records.length} evaluation records to JSON`);
    } catch (error) {
      showMessage('error', `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExportCSV = () => {
    try {
      if (records.length === 0) {
        showMessage('info', 'No evaluation records to export');
        return;
      }
      const csv = exportToCSV();
      const timestamp = new Date().toISOString().split('T')[0];
      downloadFile(csv, `convivencia-evaluations-${timestamp}.csv`, 'text/csv');
      showMessage('success', `Exported ${records.length} evaluation records to CSV`);
    } catch (error) {
      showMessage('error', `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      let importedRecords;

      if (file.name.endsWith('.json')) {
        importedRecords = await importFromJSON(file);
      } else if (file.name.endsWith('.csv')) {
        importedRecords = await importFromCSV(file);
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV.');
      }

      const merged = mergeRecords(records, importedRecords);
      saveRecordsToStorage(merged);

      showMessage('success', `Imported ${importedRecords.length} evaluation records. Reloading...`);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      showMessage('error', `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-0 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Data Backup & Restore</h2>
        
        {message && (
          <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-900' :
            message.type === 'error' ? 'bg-red-50 text-red-900' :
            'bg-blue-50 text-blue-900'
          }`}>
            {message.type === 'success' && <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            {message.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            {message.type === 'info' && <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Data
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download your evaluation records as a backup. Current records: <strong>{records.length}</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleExportJSON}
                variant="outline"
                className="flex-1"
                disabled={records.length === 0}
              >
                Export as JSON
              </Button>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="flex-1"
                disabled={records.length === 0}
              >
                Export as CSV
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Data
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a JSON or CSV file to restore or merge evaluation records. Existing records with the same ID will be updated.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleImportClick}
                variant="default"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Importing...' : 'Choose File to Import'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="border-t pt-6 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Info: How it works</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Export:</strong> Creates a backup file of all your evaluation records</li>
              <li>• <strong>Import:</strong> Restores records from a backup or merges new records</li>
              <li>• <strong>Formats:</strong> JSON for full data preservation, CSV for spreadsheet compatibility</li>
              <li>• <strong>Storage:</strong> All data is stored locally in your browser</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
