import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useEvaluation } from '@/contexts/EvaluationContext';

export default function GroupDashboard() {
  const { records, getAllGroups } = useEvaluation();

  const allGroups = getAllGroups();

  // Calculate group stats
  const groupStats = allGroups.map((groupName: string) => {
    const groupRecords = records.filter((r: any) => r.groupName === groupName);
    if (groupRecords.length === 0) return null;

    const avgBeforeMixed = Math.round(
      groupRecords.reduce((sum: number, r: any) => sum + r.beforeMixedInteractions, 0) / groupRecords.length
    );

    const avgAfterMixed = Math.round(
      groupRecords.reduce((sum: number, r: any) => sum + r.afterMixedInteractions, 0) / groupRecords.length
    );

    const improvement = avgBeforeMixed > 0
      ? Math.round(((avgAfterMixed - avgBeforeMixed) / avgBeforeMixed) * 100)
      : 0;

    const respectLevels = {
      Alto: groupRecords.filter((r: any) => r.duringRespect === 'Alto').length,
      Medio: groupRecords.filter((r: any) => r.duringRespect === 'Medio').length,
      Bajo: groupRecords.filter((r: any) => r.duringRespect === 'Bajo').length,
    };

    const avgParticipation = Math.round(
      groupRecords.reduce((sum: number, r: any) => {
        const percent = parseInt(r.duringParticipation.replace('%', '').split('-')[0]) || 0;
        return sum + percent;
      }, 0) / groupRecords.length
    );

    const stereotypeReduction = groupRecords.filter((r: any) => r.afterStereotypes === 'Disminuyeron').length > 0;

    const overallScore = (avgParticipation / 10) + (improvement / 100) + (stereotypeReduction ? 1 : 0);

    return {
      groupName,
      totalSessions: groupRecords.length,
      avgBeforeMixed,
      avgAfterMixed,
      improvement,
      respectLevels,
      avgParticipation,
      stereotypeReduction,
      overallScore,
    };
  }).filter(Boolean) as any[];

  // Data for participation trend
  const participationTrend = allGroups.map((group: string) => {
    const groupRecords = records.filter((r: any) => r.groupName === group);
    const avgParticipation = Math.round(
      groupRecords.reduce((sum: number, r: any) => {
        const percent = parseInt(r.duringParticipation.replace('%', '').split('-')[0]) || 0;
        return sum + percent;
      }, 0) / (groupRecords.length || 1)
    );
    return { group, [group]: avgParticipation };
  });

  // Data for improvement ranking
  const improvementRanking = groupStats
    .sort((a, b) => b.improvement - a.improvement)
    .map(g => ({
      name: g.groupName,
      improvement: g.improvement,
    }));

  const getRespectColor = (respect: string) => {
    switch (respect) {
      case 'Alto':
        return 'bg-green-100 text-green-800';
      case 'Medio':
        return 'bg-yellow-100 text-yellow-800';
      case 'Bajo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    return 'text-orange-600';
  };

  const hasData = records.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Dashboard de Grupos</h1>
          <p className="text-lg text-muted-foreground">
            Resumen de desempeño y progreso por grupo
          </p>
        </div>

        {!hasData && (
          <Card className="p-8 border-0 shadow-sm bg-yellow-50 mb-8">
            <p className="text-center text-lg text-muted-foreground">
              No hay datos de evaluación aún. Completa el <strong>Registro de Evaluaciones</strong> para ver el dashboard.
            </p>
          </Card>
        )}

        {/* Overall Stats */}
        {hasData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Total de Grupos</h3>
              <p className="text-4xl font-bold text-blue-700">{groupStats.length}</p>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Participación Promedio</h3>
              <p className="text-4xl font-bold text-green-700">
                {groupStats.length > 0 ? Math.round(groupStats.reduce((sum, g) => sum + g.avgParticipation, 0) / groupStats.length) : 0}%
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Mejora Promedio</h3>
              <p className="text-4xl font-bold text-purple-700">
                +{groupStats.length > 0 ? Math.round(groupStats.reduce((sum, g) => sum + g.improvement, 0) / groupStats.length) : 0}%
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Reducción de Estereotipos</h3>
              <p className="text-4xl font-bold text-orange-700">
                {groupStats.filter(g => g.stereotypeReduction).length}/{groupStats.length}
              </p>
            </Card>
          </div>
        )}

        {/* Group Performance Cards */}
        {hasData && groupStats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {groupStats.map((group) => (
              <Card key={group.groupName} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{group.groupName}</h3>
                    <p className="text-sm text-muted-foreground">{group.totalSessions} sesiones</p>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(group.overallScore)}`}>
                    {group.overallScore.toFixed(1)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Participación Promedio</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${group.avgParticipation}%` }}
                      />
                    </div>
                    <p className="text-sm font-semibold text-foreground mt-1">{group.avgParticipation}%</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Respeto Mutuo</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRespectColor(
                      group.respectLevels.Alto > 0 ? 'Alto' : group.respectLevels.Medio > 0 ? 'Medio' : 'Bajo'
                    )}`}>
                      {group.respectLevels.Alto > 0 ? 'Alto' : group.respectLevels.Medio > 0 ? 'Medio' : 'Bajo'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Mejora en Interacciones</p>
                    <p className="text-2xl font-bold text-green-600">+{group.improvement}%</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Estereotipos</p>
                    {group.stereotypeReduction ? (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        ✓ Disminuyeron
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                        Sin cambios
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Charts */}
        {hasData && improvementRanking.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Improvement Ranking */}
            <Card className="p-6 border-0 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Ranking de Mejora</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={improvementRanking}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="improvement" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Participation by Group */}
            {participationTrend.length > 0 && (
              <Card className="p-6 border-0 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">Participación por Grupo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={participationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="group" />
                    <YAxis />
                    <Tooltip />
                    {allGroups.map((group, idx) => (
                      <Bar key={group} dataKey={group} fill={['#0891b2', '#7c3aed', '#ea580c', '#16a34a'][idx % 4]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* Detailed Table */}
        {hasData && groupStats.length > 0 && (
          <Card className="p-6 border-0 shadow-sm overflow-x-auto">
            <h3 className="text-lg font-bold text-foreground mb-4">Resumen Detallado</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Grupo</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Sesiones</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Participación</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Mejora</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Puntuación</th>
                </tr>
              </thead>
              <tbody>
                {groupStats.map((group) => (
                  <tr key={group.groupName} className="border-b border-border hover:bg-primary/5">
                    <td className="py-3 px-4 font-semibold text-foreground">{group.groupName}</td>
                    <td className="py-3 px-4">{group.totalSessions}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${group.avgParticipation}%` }}
                          />
                        </div>
                        <span className="font-semibold">{group.avgParticipation}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-green-600">+{group.improvement}%</span>
                    </td>
                    <td className={`py-3 px-4 font-bold text-lg ${getScoreColor(group.overallScore)}`}>
                      {group.overallScore.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {/* Info */}
        <Card className="p-6 mt-8 border-0 shadow-sm bg-primary/5">
          <h3 className="text-lg font-bold text-foreground mb-4">Interpretación de Puntuaciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-semibold text-green-700 mb-2">9.0 - 10.0 (Excelente)</p>
              <p className="text-sm text-muted-foreground">Grupo con alto desempeño en todos los indicadores</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-2">8.0 - 8.9 (Muy Bueno)</p>
              <p className="text-sm text-muted-foreground">Grupo con buen desempeño general</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-700 mb-2">7.0 - 7.9 (Bueno)</p>
              <p className="text-sm text-muted-foreground">Grupo con desempeño aceptable, área de mejora</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
