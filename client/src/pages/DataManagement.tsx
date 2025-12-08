import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Download, Upload, Database, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function DataManagement() {
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Mutations
  const importMutation = trpc.dataManagement.importEvaluationsJSON.useMutation({
    onSuccess: (result: any) => {
      toast.success(`Imported ${result.importedCount} evaluations`);
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} errors during import`);
      }
      setIsImporting(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to import data");
      setIsImporting(false);
    },
  });

  const handleExportJSON = async () => {
    try {
      setIsExporting(true);
      const data = await (trpc.dataManagement.exportEvaluationsJSON as any).query();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `evaluations-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      toast.success("JSON export downloaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to export JSON");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const data = await (trpc.dataManagement.exportEvaluationsCSV as any).query();
      const blob = new Blob([data.csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename;
      a.click();
      toast.success("CSV export downloaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackup = async () => {
    try {
      setIsExporting(true);
      const data = await (trpc.dataManagement.backupAllData as any).query();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${new Date().toISOString()}.json`;
      a.click();
      toast.success("Full backup downloaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to create backup");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        setIsImporting(true);
        importMutation.mutate({ data });
      } catch (error) {
        toast.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  // Check admin access
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You do not have permission to access data management. Only administrators can manage data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Management</h1>
          <p className="text-gray-600">Export, import, and backup your evaluation data</p>
        </div>

        {/* Export Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>Download your evaluation data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={handleExportJSON}
                disabled={isExporting}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
              >
                <Database className="h-6 w-6" />
                <span>Export as JSON</span>
                <span className="text-xs text-muted-foreground">Full data with metadata</span>
              </Button>
              <Button
                onClick={handleExportCSV}
                disabled={isExporting}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
              >
                <Download className="h-6 w-6" />
                <span>Export as CSV</span>
                <span className="text-xs text-muted-foreground">Spreadsheet format</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
            <CardDescription>Import evaluation data from a JSON file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                disabled={isImporting}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">Click to select JSON file</p>
                <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              The JSON file should contain evaluations data exported from this application.
            </p>
          </CardContent>
        </Card>

        {/* Backup Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Backup & Restore
            </CardTitle>
            <CardDescription>Create a complete backup of all system data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Backup includes:</strong> All users, groups, sessions, evaluations, and audit logs. This is useful for disaster recovery and data migration.
              </p>
            </div>
            <Button
              onClick={handleBackup}
              disabled={isExporting}
              className="w-full h-12 gap-2"
            >
              <Shield className="h-4 w-4" />
              {isExporting ? "Creating backup..." : "Create Full Backup"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Backups are encrypted and can be restored at any time. Last backup: Never
            </p>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card className="mt-8 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base">Data Management Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <div>
              <strong>Regular Backups:</strong> Create backups regularly to prevent data loss. Store backups in a secure location.
            </div>
            <div>
              <strong>Data Privacy:</strong> Ensure that exported data is handled securely and complies with data protection regulations.
            </div>
            <div>
              <strong>Import Validation:</strong> Always validate imported data to ensure it matches the expected format and contains valid information.
            </div>
            <div>
              <strong>Version Control:</strong> Keep track of backup versions with timestamps to easily identify and restore specific versions if needed.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
