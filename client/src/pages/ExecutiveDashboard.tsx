import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEvaluation } from '@/contexts/EvaluationContext';

import { TrendingUp, Users, Target, Award } from 'lucide-react';

const COLORS = ['#16a34a', '#ea580c', '#0891b2', '#7c3aed'];

export default function ExecutiveDashboard() {
  const { records, getAllGroups } = useEvaluation();


  const allGroups = getAllGroups();

  // Calculate overall metrics
  const totalEvaluations = records.length;
  const totalGroups = allGroups.length;
  const avgParticipation = records.length > 0
    ? Math.round(
        records.reduce((sum: number, r: any) => {
          const percent = parseInt(r.duringParticipation.replace('%', '').split('-')[0]) || 0;
          return sum + percent;
        }, 0) / records.length
      )
    : 0;

  const avgBeforeMixed = records.length > 0
    ? Math.round(records.reduce((sum: number, r: any) => sum + r.beforeMixedInteractions, 0) / records.length)
    : 0;

  const avgAfterMixed = records.length > 0
    ? Math.round(records.reduce((sum: number, r: any) => sum + r.afterMixedInteractions, 0) / records.length)
    : 0;

  const overallImprovement = avgBeforeMixed > 0
    ? Math.round(((avgAfterMixed - avgBeforeMixed) / avgBeforeMixed) * 100)
    : 0;

  const stereotypeReduction = records.filter((r: any) => r.afterStereotypes === 'Disminuyeron').length;

  // Comparison data by group
  const comparisonData = allGroups.map((group: string) => {
    const groupRecords = records.filter((r: any) => r.groupName === group);
    const avgBefore = groupRecords.length > 0
      ? Math.round(groupRecords.reduce((sum: number, r: any) => sum + r.beforeMixedInteractions, 0) / groupRecords.length)
      : 0;
    const avgAfter = groupRecords.length > 0
      ? Math.round(groupRecords.reduce((sum: number, r: any) => sum + r.afterMixedInteractions, 0) / groupRecords.length)
      : 0;
    return {
      group,
      antes: avgBefore,
      después: avgAfter,
    };
  });

  // Respect distribution
  const respectData = [
    {
      name: 'Alto',
      value: records.filter((r: any) => r.duringRespect === 'Alto').length,
    },
    {
      name: 'Medio',
      value: records.filter((r: any) => r.duringRespect === 'Medio').length,
    },
    {
      name: 'Bajo',
      value: records.filter((r: any) => r.duringRespect === 'Bajo').length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard Ejecutivo</h1>
              <p className="text-lg text-muted-foreground">
                Resumen general del Programa de Convivencia Intercultural
              </p>
            </div>

          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Evaluaciones Realizadas</p>
                <p className="text-4xl font-bold text-blue-700">{totalEvaluations}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Grupos Participantes</p>
                <p className="text-4xl font-bold text-green-700">{totalGroups}</p>
              </div>
              <Users className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Mejora General</p>
                <p className="text-4xl font-bold text-orange-700">+{overallImprovement}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Estereotipos Reducidos</p>
                <p className="text-4xl font-bold text-purple-700">{stereotypeReduction}</p>
              </div>
              <Award className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Trend Chart */}
          <Card className="p-6 border-0 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Tendencia de Interacciones Mixtas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="antes" fill="#ef4444" />
                <Bar dataKey="después" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Respect Distribution */}
          {respectData.some(d => d.value > 0) && (
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Distribución de Respeto Mutuo</h3>
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

        {/* Key Metrics Table */}
        <Card className="p-6 border-0 shadow-sm mb-12">
          <h3 className="text-lg font-bold text-foreground mb-4">Métricas Clave</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-muted-foreground mb-2">Participación Promedio</p>
              <p className="text-3xl font-bold text-blue-700">{avgParticipation}%</p>
              <p className="text-xs text-muted-foreground mt-2">Nivel de involucramiento en dinámicas</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-muted-foreground mb-2">Interacciones Antes</p>
              <p className="text-3xl font-bold text-green-700">{avgBeforeMixed}</p>
              <p className="text-xs text-muted-foreground mt-2">Promedio inicial por grupo</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-muted-foreground mb-2">Interacciones Después</p>
              <p className="text-3xl font-bold text-orange-700">{avgAfterMixed}</p>
              <p className="text-xs text-muted-foreground mt-2">Promedio final por grupo</p>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-8 border-0 shadow-sm bg-gradient-to-r from-primary/10 to-primary/5">
          <h3 className="text-lg font-bold text-foreground mb-4">Resumen del Impacto</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            El Programa de Convivencia Intercultural ha realizado <strong>{totalEvaluations}</strong> evaluaciones con <strong>{totalGroups}</strong> grupos participantes. 
            Se observó una mejora general del <strong className="text-green-600">+{overallImprovement}%</strong> en las interacciones mixtas entre participantes de diferentes nacionalidades.
            La participación promedio fue del <strong>{avgParticipation}%</strong>, y se detectó reducción de estereotipos en <strong>{stereotypeReduction}</strong> evaluaciones.
          </p>
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button size="sm" variant="outline">
              Exportar Reporte
            </Button>
            <Button size="sm" variant="outline">
              Ver Detalles
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
