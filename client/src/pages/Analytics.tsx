import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Analytics() {
  const { data: stats, isLoading: statsLoading } = trpc.analytics.getEvaluationStats.useQuery();
  const { data: comparison, isLoading: comparisonLoading } = trpc.analytics.getGroupComparison.useQuery({});
  const { data: trend, isLoading: trendLoading } = trpc.analytics.getTrendAnalysis.useQuery({ days: 30 });
  const { data: report, isLoading: reportLoading } = trpc.analytics.generateSummaryReport.useQuery();

  const handleExportPDF = () => {
    toast.success("PDF export feature coming soon");
  };

  const handleExportCSV = () => {
    if (!stats) return;

    const csv = [
      ["Evaluation Statistics Report"],
      ["Generated at", new Date().toISOString()],
      [],
      ["Metric", "Value"],
      ["Total Evaluations", stats.totalEvaluations],
      ["Average Score", stats.averageScore],
      ["Highest Score", stats.highestScore],
      ["Lowest Score", stats.lowestScore],
    ].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evaluation-report.csv";
    a.click();
    toast.success("CSV report downloaded");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
            <p className="text-gray-600">Comprehensive evaluation data analysis and insights</p>
          </div>
          <div className="space-x-2">
            <Button onClick={handleExportPDF} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handleExportCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Report */}
        {report && !reportLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Evaluations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalEvaluations}</div>
                <p className="text-xs text-muted-foreground mt-1">All evaluations recorded</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.averageEvaluationScore}</div>
                <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalGroups}</div>
                <p className="text-xs text-muted-foreground mt-1">Active groups</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary.totalSessions}</div>
                <p className="text-xs text-muted-foreground mt-1">Program sessions</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Chart */}
          {trend && trend.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  30-Day Trend
                </CardTitle>
                <CardDescription>Evaluation scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="averageScore" stroke="#3b82f6" name="Average Score" />
                    <Line type="monotone" dataKey="count" stroke="#10b981" name="Count" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Group Comparison */}
          {comparison && comparison.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Group Comparison</CardTitle>
                <CardDescription>Performance across groups</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="groupId" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageScore" fill="#3b82f6" name="Average Score" />
                    <Bar dataKey="totalEvaluations" fill="#10b981" name="Total Evaluations" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Statistics by Group and Session */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* By Group */}
            {stats.byGroup && stats.byGroup.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Statistics by Group</CardTitle>
                  <CardDescription>Evaluation metrics per group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.byGroup.map((group: any) => (
                      <div key={group.groupId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Group {group.groupId}</p>
                          <p className="text-sm text-muted-foreground">{group.count} evaluations</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{group.averageScore.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* By Session */}
            {stats.bySession && stats.bySession.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Statistics by Session</CardTitle>
                  <CardDescription>Evaluation metrics per session</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.bySession.map((session: any) => (
                      <div key={session.sessionId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Session {session.sessionId}</p>
                          <p className="text-sm text-muted-foreground">{session.count} evaluations</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{session.averageScore.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
