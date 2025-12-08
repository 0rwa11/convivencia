import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useEvaluation } from '@/contexts/EvaluationContext';


export default function BackupRestore() {
  const { records } = useEvaluation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = () => {
    try {
      setIsLoading(true);
      const backupData = {
        timestamp: new Date().toISOString(),
        evaluations: records,
        version: '1.0',
      };

      const json = JSON.stringify(backupData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `convivencia_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({
        type: 'success',
        text: `✅ Respaldo exportado exitosamente (${records.length} evaluaciones)`,
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: '❌ Error al exportar respaldo',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.evaluations || !Array.isArray(backupData.evaluations)) {
        throw new Error('Formato de archivo inválido');
      }

      // Save to localStorage
      localStorage.setItem('convivencia_evaluations', JSON.stringify(backupData.evaluations));
      


      setMessage({
        type: 'success',
        text: `✅ Respaldo importado exitosamente (${backupData.evaluations.length} evaluaciones)`,
      });

      // Reload page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Error al importar: ${error instanceof Error ? error.message : 'Archivo inválido'}`,
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const lastSyncTime = null;
  const storageSize = 0;

  return (
    <div className="space-y-4">
      {/* Messages */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Export Section */}
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-2">📥 Exportar Respaldo</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Descarga todos tus datos como archivo JSON. Puedes importarlo en otro dispositivo.
        </p>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExport}
            disabled={isLoading || records.length === 0}
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar Respaldo
          </Button>
          <span className="text-sm text-muted-foreground">
            {records.length} evaluaciones
          </span>
        </div>
      </Card>

      {/* Import Section */}
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-2">📤 Importar Respaldo</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Sube un archivo JSON de respaldo anterior para restaurar tus datos.
        </p>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isLoading}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Seleccionar Archivo
          </Button>
          <span className="text-sm text-muted-foreground">
            Formato: .json
          </span>
        </div>
      </Card>

      {/* Info Section */}
	      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
	        <h3 className="text-lg font-semibold text-foreground mb-3">ℹ️ Información de Datos Locales</h3>
	        <div className="space-y-2 text-sm">
	          <div className="flex justify-between">
	            <span className="text-muted-foreground">Total de evaluaciones:</span>
	            <span className="font-medium text-foreground">{records.length}</span>
	          </div>
	        </div>
	      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-3">📋 Instrucciones</h3>
        <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
          <li>Usa <strong>"Descargar Respaldo"</strong> para guardar tus datos en tu computadora</li>
          <li>En otro dispositivo, ve a esta página y usa <strong>"Seleccionar Archivo"</strong></li>
          <li>Sube el archivo JSON que descargaste</li>
          <li>Tus datos se importarán automáticamente</li>
          <li>La página se recargará para mostrar los nuevos datos</li>
        </ol>
      </Card>
    </div>
  );
}
