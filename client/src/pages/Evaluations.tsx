import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit2, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Evaluations() {
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    sessionId: "",
    groupId: "",
    duringParticipation: "",
    beforeMixedInteractions: "",
    afterMixedInteractions: "",
    beforeStereotypes: "",
    afterStereotypes: "",
    notes: "",
  });

  // Queries
  const groupsQuery = trpc.groups.list.useQuery();
  const sessionsQuery = trpc.sessions.listByGroup.useQuery(
    { groupId: selectedGroupId || 0 },
    { enabled: !!selectedGroupId }
  );
  const evaluationsQuery = trpc.evaluations.listByGroup.useQuery(
    { groupId: selectedGroupId || 0 },
    { enabled: !!selectedGroupId }
  );

  // Mutations
  const createMutation = trpc.evaluations.create.useMutation({
    onSuccess: () => {
      setSuccess("Evaluation created successfully");
      setFormData({
        sessionId: "",
        groupId: "",
        duringParticipation: "",
        beforeMixedInteractions: "",
        afterMixedInteractions: "",
        beforeStereotypes: "",
        afterStereotypes: "",
        notes: "",
      });
      setIsDialogOpen(false);
      evaluationsQuery.refetch();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const updateMutation = trpc.evaluations.update.useMutation({
    onSuccess: () => {
      setSuccess("Evaluation updated successfully");
      setEditingId(null);
      setFormData({
        sessionId: "",
        groupId: "",
        duringParticipation: "",
        beforeMixedInteractions: "",
        afterMixedInteractions: "",
        beforeStereotypes: "",
        afterStereotypes: "",
        notes: "",
      });
      setIsDialogOpen(false);
      evaluationsQuery.refetch();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const deleteMutation = trpc.evaluations.delete.useMutation({
    onSuccess: () => {
      setSuccess("Evaluation deleted successfully");
      evaluationsQuery.refetch();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const sessionId = parseInt(formData.sessionId);
    const groupId = parseInt(formData.groupId);
    const beforeMixed = formData.beforeMixedInteractions ? parseInt(formData.beforeMixedInteractions) : undefined;
    const afterMixed = formData.afterMixedInteractions ? parseInt(formData.afterMixedInteractions) : undefined;

    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        duringParticipation: formData.duringParticipation || undefined,
        beforeMixedInteractions: beforeMixed,
        afterMixedInteractions: afterMixed,
        beforeStereotypes: formData.beforeStereotypes || undefined,
        afterStereotypes: formData.afterStereotypes || undefined,
        notes: formData.notes || undefined,
      });
    } else {
      await createMutation.mutateAsync({
        sessionId,
        groupId,
        duringParticipation: formData.duringParticipation || undefined,
        beforeMixedInteractions: beforeMixed,
        afterMixedInteractions: afterMixed,
        beforeStereotypes: formData.beforeStereotypes || undefined,
        afterStereotypes: formData.afterStereotypes || undefined,
        notes: formData.notes || undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Evaluations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record and track program evaluations
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Group Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Group</CardTitle>
            <CardDescription>Choose a group to view and manage evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select
                value={selectedGroupId?.toString() || ""}
                onValueChange={(value) => setSelectedGroupId(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a group..." />
                </SelectTrigger>
                <SelectContent>
                  {groupsQuery.data?.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedGroupId && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingId(null);
                        setFormData({
                          sessionId: "",
                          groupId: selectedGroupId.toString(),
                          duringParticipation: "",
                          beforeMixedInteractions: "",
                          afterMixedInteractions: "",
                          beforeStereotypes: "",
                          afterStereotypes: "",
                          notes: "",
                        });
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Evaluation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingId ? "Edit Evaluation" : "Create New Evaluation"}
                      </DialogTitle>
                      <DialogDescription>
                        Fill in the evaluation details
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Session</label>
                          <Select
                            value={formData.sessionId}
                            onValueChange={(value) =>
                              setFormData({ ...formData, sessionId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select session..." />
                            </SelectTrigger>
                            <SelectContent>
                              {sessionsQuery.data?.map((session) => (
                                <SelectItem key={session.id} value={session.id.toString()}>
                                  Session {session.sessionNumber}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Participation %</label>
                          <Input
                            type="text"
                            placeholder="e.g., 80%"
                            value={formData.duringParticipation}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                duringParticipation: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Before Mixed Interactions</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={formData.beforeMixedInteractions}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                beforeMixedInteractions: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">After Mixed Interactions</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={formData.afterMixedInteractions}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                afterMixedInteractions: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Before Stereotypes</label>
                          <Select
                            value={formData.beforeStereotypes}
                            onValueChange={(value) =>
                              setFormData({ ...formData, beforeStereotypes: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select level..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">After Stereotypes</label>
                          <Select
                            value={formData.afterStereotypes}
                            onValueChange={(value) =>
                              setFormData({ ...formData, afterStereotypes: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select level..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea
                          placeholder="Additional notes..."
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
                          {createMutation.isPending || updateMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Evaluations List */}
        {selectedGroupId && (
          <Card>
            <CardHeader>
              <CardTitle>Evaluations</CardTitle>
              <CardDescription>
                {evaluationsQuery.data?.length || 0} evaluations recorded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {evaluationsQuery.isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                  <p>Loading evaluations...</p>
                </div>
              ) : evaluationsQuery.data?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No evaluations recorded yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Session</th>
                        <th className="text-left py-3 px-4 font-medium">Participation</th>
                        <th className="text-left py-3 px-4 font-medium">Mixed Interactions</th>
                        <th className="text-left py-3 px-4 font-medium">Stereotypes</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluationsQuery.data?.map((evaluation) => (
                        <tr key={evaluation.id} className="border-b hover:bg-gray-50 dark:hover:bg-slate-800">
                          <td className="py-3 px-4">Session {evaluation.sessionId}</td>
                          <td className="py-3 px-4">{evaluation.duringParticipation || "-"}</td>
                          <td className="py-3 px-4">
                            {evaluation.beforeMixedInteractions} → {evaluation.afterMixedInteractions}
                          </td>
                          <td className="py-3 px-4">
                            {evaluation.beforeStereotypes} → {evaluation.afterStereotypes}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingId(evaluation.id);
                                  setFormData({
                                    sessionId: evaluation.sessionId.toString(),
                                    groupId: selectedGroupId.toString(),
                                    duringParticipation: evaluation.duringParticipation || "",
                                    beforeMixedInteractions: evaluation.beforeMixedInteractions?.toString() || "",
                                    afterMixedInteractions: evaluation.afterMixedInteractions?.toString() || "",
                                    beforeStereotypes: evaluation.beforeStereotypes || "",
                                    afterStereotypes: evaluation.afterStereotypes || "",
                                    notes: evaluation.notes || "",
                                  });
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteMutation.mutate({ id: evaluation.id })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
