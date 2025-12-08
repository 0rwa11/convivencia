import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText } from 'lucide-react';
import { useEvaluation } from '@/contexts/EvaluationContext';
import { generatePDFReport, printReportAsPDF } from '@/lib/pdfGenerator';

const COLORS = ['#16a34a', '#ea580c', '#0891b2', '#7c3aed', '#db2777'];

interface ComparisonChartsProps {}

interface FilteredRecord {
  id: string;
  sessionNumber: number;
  date: string;
  groupName: string;
  facilitator: string;
  beforeGrouping: string;
  beforeIsolation: string;
  beforeTensions: string;
  beforeCommunication: string;
  beforeMixedInteractions: number;
  duringParticipation: string;
  duringRespect: string;
  duringOpenness: string;
  duringLaughter: string;
  duringMixedInteractions: string;
  afterGrouping: string;
  afterMixedInteractions: number;
  afterStereotypes: string;
  notes: string;
}

export default function ComparisonCharts() {
  const { records, getAllGroups, getGroupStats } = useEvaluation();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  const allGroups = getAllGroups();
  const groupOptions = ['all', ...allGroups];

  // Filter data based on selected group
  const filteredRecords = selectedGroup === 'all' 
    ? records 
    : records.filter((r: any) => r.groupName === selectedGroup);

  // Calculate metrics
  const avgBeforeMixed = filteredRecords.length > 0
    ? Math.round(filteredRecords.reduce((sum: number, r: any) => sum + r.beforeMixedInteractions, 0) / filteredRecords.length)
    : 0;

  const avgAfterMixed = filteredRecords.length > 0
    ? Math.round(filteredRecords.reduce((sum: number, r: any) => sum + r.afterMixedInteractions, 0) / filteredRecords.length)
    : 0;

  const improvementPercent = avgBeforeMixed > 0
    ? Math.round(((avgAfterMixed - avgBeforeMixed) / avgBeforeMixed) * 100)
    : 0;

  // Data for comparison chart
  const comparisonChartData = [
    {
      name: 'Interacciones Mixtas',
      Antes: avgBeforeMixed,
      Después: avgAfterMixed,
    },
  ];

  // Data for improvement by group
  const improvementByGroup = allGroups.map(group => {
    const groupData = records.filter((r: any) => r.groupName === group);
    if (groupData.length === 0) return { name: group, improvement: 0 };
    
    const before = groupData.reduce((sum: number, r: any) => sum + r.beforeMixedInteractions, 0) / groupData.length;
    const after = groupData.reduce((sum: number, r: any) => sum + r.afterMixedInteractions, 0) / groupData.length;
    const improvement = before > 0 ? Math.round(((after - before) / before) * 100) : 0;
    
    return { name: group, improvement };
  });

  // Stereotype reduction data
  const stereotypeData = [
    {
      name: 'Disminuyeron',
      value: filteredRecords.filter((r: any) => r.afterStereotypes === 'Disminuyeron').length,
    },
    {
      name: 'Sin cambios',
      value: filteredRecords.filter((r: any) => r.afterStereotypes === 'Sin cambios').length,
    },
    {
      name: 'Aumentaron',
      value: filteredRecords.filter((r: any) => r.afterStereotypes === 'Aumentaron').length,
    },
  ];

  // Respect levels
  const respectData = [
    {
      name: 'Alto',
      value: filteredRecords.filter((r: any) => r.duringRespect === 'Alto').length,
    },
    {
      name: 'Medio',
      value: filteredRecords.filter((r: any) => r.duringRespect === 'Medio').length,
    },
    {
      name: 'Bajo',
      value: filteredRecords.filter((r: any) => r.duringRespect === 'Bajo').length,
    },
  ];

  const hasData = records.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Análisis Comparativo</h1>
          <p className="text-lg text-muted-foreground">
            Visualización de cambios ANTES/DESPUÉS del programa
          </p>
        </div>

        {!hasData && (
          <Card className="p-8 border-0 shadow-sm bg-yellow-50 mb-8">
            <p className="text-center text-lg text-muted-foreground">
              No hay datos de evaluación aún. Completa el <strong>Registro de Evaluaciones</strong> para ver los gráficos.
            </p>
          </Card>
        )}

        {/* Export Buttons */}
        {hasData && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              size="lg"
              onClick={() => generatePDFReport(records, selectedGroup)}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar Reporte HTML
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => printReportAsPDF(records, selectedGroup)}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Imprimir como PDF
            </Button>
          </div>
        )}

        {/* Group Filter */}
        {hasData && (
          <Card className="p-6 mb-8 border-0 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Filtrar por Grupo</h3>
            <div className="flex flex-wrap gap-2">
              {groupOptions.map((group) => (
                <Button
                  key={group}
                  variant={selectedGroup === group ? 'default' : 'outline'}
                  onClick={() => setSelectedGroup(group)}
                >
                  {group === 'all' ? 'Todos los Grupos' : group}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {/* Key Metrics */}
        {hasData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Interacciones Antes</h3>
              <p className="text-4xl font-bold text-green-700">{avgBeforeMixed}</p>
              <p className="text-xs text-muted-foreground mt-2">promedio por grupo</p>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Interacciones Después</h3>
              <p className="text-4xl font-bold text-blue-700">{avgAfterMixed}</p>
              <p className="text-xs text-muted-foreground mt-2">promedio por grupo</p>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Mejora</h3>
              <p className="text-4xl font-bold text-orange-700">+{improvementPercent}%</p>
              <p className="text-xs text-muted-foreground mt-2">aumento promedio</p>
            </Card>
          </div>
        )}

        {/* Charts */}
        {hasData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Comparison Chart */}
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Interacciones Mixtas: Antes vs Después</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Antes" fill="#ef4444" />
                  <Bar dataKey="Después" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Improvement by Group */}
            {improvementByGroup.length > 0 && (
              <Card className="p-6 border-0 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">Mejora por Grupo (%)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={improvementByGroup}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="improvement" fill="#0891b2" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Stereotype Reduction */}
            {stereotypeData.some(d => d.value > 0) && (
              <Card className="p-6 border-0 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">Cambio en Estereotipos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stereotypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stereotypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Respect Levels */}
            {respectData.some(d => d.value > 0) && (
              <Card className="p-6 border-0 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">Niveles de Respeto Mutuo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={respectData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {respectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* Summary Table */}
        {hasData && filteredRecords.length > 0 && (
          <Card className="p-6 border-0 shadow-sm overflow-x-auto">
            <h3 className="text-lg font-bold text-foreground mb-4">Resumen Detallado por Grupo</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Grupo</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Antes</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Después</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Mejora</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Agrupación</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Estereotipos</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record: any, idx: number) => (
                  <tr key={idx} className="border-b border-border hover:bg-primary/5">
                    <td className="py-3 px-4">{record.groupName}</td>
                    <td className="py-3 px-4">{record.beforeMixedInteractions}</td>
                    <td className="py-3 px-4">{record.afterMixedInteractions}</td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-semibold">
                        +{record.beforeMixedInteractions > 0 ? Math.round(((record.afterMixedInteractions - record.beforeMixedInteractions) / record.beforeMixedInteractions) * 100) : 0}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="text-red-600">{record.beforeGrouping}</span>
                      <br />
                      <span className="text-green-600">{record.afterGrouping}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        {record.afterStereotypes}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* Info */}
        <Card className="p-6 mt-8 border-0 shadow-sm bg-primary/5">
          <h3 className="text-lg font-bold text-foreground mb-4">Cómo interpretar estos gráficos</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong>Interacciones Mixtas:</strong> Número de conversaciones, risas y actividades compartidas entre diferentes nacionalidades</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong>Mejora %:</strong> Aumento porcentual en interacciones mixtas (objetivo: +50% o más)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong>Estereotipos:</strong> Cambio en percepciones y prejuicios observados</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">•</span>
              <span><strong>Respeto Mutuo:</strong> Nivel de diálogo respetuoso durante las sesiones</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
