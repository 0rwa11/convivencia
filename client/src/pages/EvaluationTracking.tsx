import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Plus, Trash2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useEvaluation, EvaluationRecord } from '@/contexts/EvaluationContext';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function EvaluationTracking() {
  const { records, addRecord, updateRecord, deleteRecord } = useEvaluation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (records.length > 0 && !expandedId) {
      setExpandedId(records[0].id);
    }
  }, [records, expandedId]);

  const handleAddRecord = () => {
    const newRecord: EvaluationRecord = {
      id: Date.now().toString(),
      sessionNumber: Math.max(...records.map((r: any) => r.sessionNumber), 0) + 1,
      date: new Date().toISOString().split('T')[0],
      groupName: '',
      facilitator: '',
      beforeGrouping: '',
      beforeIsolation: '',
      beforeTensions: '',
      beforeCommunication: '',
      beforeMixedInteractions: 0,
      duringParticipation: '',
      duringRespect: '',
      duringOpenness: '',
      duringLaughter: '',
      duringMixedInteractions: '',
      afterGrouping: '',
      afterMixedInteractions: 0,
      afterStereotypes: '',
      notes: '',
    };
    addRecord(newRecord);
    setExpandedId(newRecord.id);
  };

  const handleUpdateRecord = (id: string, field: keyof EvaluationRecord, value: any) => {
    const record = records.find((r: any) => r.id === id);
    if (record) {
      updateRecord(id, { ...record, [field]: value });
    }
  };

  const handleDeleteRecord = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteRecord(deleteConfirm);
      if (expandedId === deleteConfirm) {
        setExpandedId(null);
      }
      setDeleteConfirm(null);
    }
  };

  const downloadAsCSV = () => {
    const headers = [
      'Sesión', 'Fecha', 'Grupo', 'Facilitador',
      'ANTES: Agrupación', 'ANTES: Aislamiento', 'ANTES: Tensiones', 'ANTES: Comunicación', 'ANTES: Interacciones Mixtas',
      'DURANTE: Participación', 'DURANTE: Respeto', 'DURANTE: Apertura', 'DURANTE: Risa', 'DURANTE: Interacciones Mixtas',
      'DESPUÉS: Agrupación', 'DESPUÉS: Interacciones Mixtas', 'DESPUÉS: Estereotipos',
      'Notas'
    ];

    const rows = records.map((r: any) => [
      r.sessionNumber,
      r.date,
      r.groupName,
      r.facilitator,
      r.beforeGrouping,
      r.beforeIsolation,
      r.beforeTensions,
      r.beforeCommunication,
      r.beforeMixedInteractions,
      r.duringParticipation,
      r.duringRespect,
      r.duringOpenness,
      r.duringLaughter,
      r.duringMixedInteractions,
      r.afterGrouping,
      r.afterMixedInteractions,
      r.afterStereotypes,
      r.notes,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluaciones_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const downloadAsExcel = () => {
    const headers = [
      'Sesión', 'Fecha', 'Grupo', 'Facilitador',
      'ANTES: Agrupación', 'ANTES: Aislamiento', 'ANTES: Tensiones', 'ANTES: Comunicación', 'ANTES: Interacciones Mixtas',
      'DURANTE: Participación', 'DURANTE: Respeto', 'DURANTE: Apertura', 'DURANTE: Risa', 'DURANTE: Interacciones Mixtas',
      'DESPUÉS: Agrupación', 'DESPUÉS: Interacciones Mixtas', 'DESPUÉS: Estereotipos',
      'Notas'
    ];

    const rows = records.map((r: any) => [
      r.sessionNumber,
      r.date,
      r.groupName,
      r.facilitator,
      r.beforeGrouping,
      r.beforeIsolation,
      r.beforeTensions,
      r.beforeCommunication,
      r.beforeMixedInteractions,
      r.duringParticipation,
      r.duringRespect,
      r.duringOpenness,
      r.duringLaughter,
      r.duringMixedInteractions,
      r.afterGrouping,
      r.afterMixedInteractions,
      r.afterStereotypes,
      r.notes,
    ]);

    let html = '<table border="1"><thead><tr>';
    headers.forEach((h: string) => (html += `<th>${h}</th>`));
    html += '</tr></thead><tbody>';

    rows.forEach((row: any) => {
      html += '<tr>';
      row.forEach((cell: any) => (html += `<td>${cell}</td>`));
      html += '</tr>';
    });
    html += '</tbody></table>';

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluaciones_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Registro de Evaluaciones</h1>
          <p className="text-lg text-muted-foreground">
            Fichas de evaluación estructuradas con criterios antes, durante y después
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button size="lg" onClick={handleAddRecord} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Agregar Sesión
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={downloadAsCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar CSV
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={downloadAsExcel}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar Excel
          </Button>
        </div>

        {/* Records */}
        <div className="space-y-4">
          {records.map((record: any) => (
            <Card key={record.id} className="border-0 shadow-sm overflow-hidden">
              {/* Header */}
              <div
                className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() =>
                  setExpandedId(expandedId === record.id ? null : record.id)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-bold text-foreground">
                        Sesión {record.sessionNumber}
                      </h3>
                      <span className="text-sm text-muted-foreground">{record.date}</span>
                      <span className="text-sm text-muted-foreground">{record.groupName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecord(record.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Eliminar evaluacion"
                      >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {expandedId === record.id ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              {expandedId === record.id && (
                <div className="p-6 space-y-8">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Facilitador/a
                      </label>
                      <input
                        type="text"
                        value={record.facilitator}
                        onChange={(e) =>
                          handleUpdateRecord(record.id, 'facilitator', e.target.value)
                        }
                        placeholder="Nombre del facilitador"
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Grupo
                      </label>
                      <input
                        type="text"
                        value={record.groupName}
                        onChange={(e) =>
                          handleUpdateRecord(record.id, 'groupName', e.target.value)
                        }
                        placeholder="Grupo 1"
                        className="w-full px-3 py-2 border border-border rounded-lg"
                      />
                    </div>
                  </div>

                  {/* ANTES */}
                  <div className="border-t border-border pt-6">
                    <h4 className="text-lg font-bold text-foreground mb-4">ANTES (Línea Base)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Agrupación por nacionalidad
                        </label>
                        <select
                          value={record.beforeGrouping}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'beforeGrouping', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Muy separados">Muy separados</option>
                          <option value="Parcialmente separados">Parcialmente separados</option>
                          <option value="Mixtos">Mixtos</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Nivel de aislamiento
                        </label>
                        <select
                          value={record.beforeIsolation}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'beforeIsolation', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Alto">Alto</option>
                          <option value="Medio">Medio</option>
                          <option value="Bajo">Bajo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Tensiones observables
                        </label>
                        <select
                          value={record.beforeTensions}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'beforeTensions', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Sí, frecuentes">Sí, frecuentes</option>
                          <option value="Sí, ocasionales">Sí, ocasionales</option>
                          <option value="No">No</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Comunicación entre grupos
                        </label>
                        <select
                          value={record.beforeCommunication}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'beforeCommunication', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Muy limitada">Muy limitada</option>
                          <option value="Limitada">Limitada</option>
                          <option value="Frecuente">Frecuente</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Interacciones mixtas (conteo en 20 min)
                        </label>
                        <input
                          type="number"
                          value={record.beforeMixedInteractions}
                          onChange={(e) =>
                            handleUpdateRecord(
                              record.id,
                              'beforeMixedInteractions',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* DURANTE */}
                  <div className="border-t border-border pt-6">
                    <h4 className="text-lg font-bold text-foreground mb-4">DURANTE (Sesión)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Participación en dinámicas
                        </label>
                        <select
                          value={record.duringParticipation}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'duringParticipation', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="100%">100%</option>
                          <option value="80-99%">80-99%</option>
                          <option value="60-79%">60-79%</option>
                          <option value="&lt;60%">&lt;60%</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Respeto mutuo
                        </label>
                        <select
                          value={record.duringRespect}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'duringRespect', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Alto">Alto</option>
                          <option value="Medio">Medio</option>
                          <option value="Bajo">Bajo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Apertura a otros
                        </label>
                        <select
                          value={record.duringOpenness}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'duringOpenness', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Alto">Alto</option>
                          <option value="Medio">Medio</option>
                          <option value="Bajo">Bajo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Risa/Ambiente lúdico
                        </label>
                        <select
                          value={record.duringLaughter}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'duringLaughter', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Alto">Alto</option>
                          <option value="Medio">Medio</option>
                          <option value="Bajo">Bajo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Interacciones mixtas observadas
                        </label>
                        <select
                          value={record.duringMixedInteractions}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'duringMixedInteractions', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Alto">Alto</option>
                          <option value="Medio">Medio</option>
                          <option value="Bajo">Bajo</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* DESPUÉS */}
                  <div className="border-t border-border pt-6">
                    <h4 className="text-lg font-bold text-foreground mb-4">DESPUÉS (Final)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Agrupación por nacionalidad
                        </label>
                        <select
                          value={record.afterGrouping}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'afterGrouping', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Muy separados">Muy separados</option>
                          <option value="Parcialmente separados">Parcialmente separados</option>
                          <option value="Mixtos">Mixtos</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Interacciones mixtas (conteo en 20 min)
                        </label>
                        <input
                          type="number"
                          value={record.afterMixedInteractions}
                          onChange={(e) =>
                            handleUpdateRecord(
                              record.id,
                              'afterMixedInteractions',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Estereotipos y prejuicios
                        </label>
                        <select
                          value={record.afterStereotypes}
                          onChange={(e) =>
                            handleUpdateRecord(record.id, 'afterStereotypes', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-border rounded-lg"
                        >
                          <option value="">Selecciona...</option>
                          <option value="Aumentaron">Aumentaron</option>
                          <option value="Sin cambios">Sin cambios</option>
                          <option value="Disminuyeron">Disminuyeron</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="border-t border-border pt-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Notas y observaciones adicionales
                    </label>
                    <textarea
                      value={record.notes}
                      onChange={(e) => handleUpdateRecord(record.id, 'notes', e.target.value)}
                      placeholder="Escribe aquí cualquier observación importante..."
                      className="w-full px-3 py-2 border border-border rounded-lg h-24"
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Info */}
        <Card className="p-6 mt-8 border-0 shadow-sm bg-primary/5">
          <h2 className="text-lg font-bold text-foreground mb-4">Cómo usar estas fichas</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">1.</span>
              <span>
                <strong>ANTES:</strong> Completa esta sección al inicio del programa para establecer la línea base
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">2.</span>
              <span>
                <strong>DURANTE:</strong> Registra observaciones inmediatamente después de cada sesión
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">3.</span>
              <span>
                <strong>DESPUÉS:</strong> Completa al final del programa para medir cambios
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">4.</span>
              <span>Descarga los datos en CSV o Excel para análisis comparativo</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Eliminar Evaluacion"
          message="Esta accion no se puede deshacer. Todos los datos de esta evaluacion seran eliminados permanentemente."
          confirmText="Eliminar"
          cancelText="Cancelar"
          isDangerous={true}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
