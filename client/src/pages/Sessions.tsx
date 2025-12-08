import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Sessions() {
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    sessionNumber: "",
    groupId: "",
    date: "",
    facilitator: "",
    topic: "",
    notes: "",
  });

  // Queries
  const groupsQuery = trpc.groups.list.useQuery();
  const sessionsQuery = trpc.sessions.listByGroup.useQuery(
    { groupId: selectedGroupId || 0 },
    { enabled: !!selectedGroupId }
  );

  // Mutations
  const createMutation = trpc.sessions.create.useMutation({
    onSuccess: () => {
      setSuccess("Session created successfully");
      setFormData({
        sessionNumber: "",
        groupId: "",
        date: "",
        facilitator: "",
        topic: "",
        notes: "",
      });
      setIsDialogOpen(false);
      sessionsQuery.refetch();
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

    if (!formData.sessionNumber || !formData.groupId || !formData.date) {
      setError("Session number, group, and date are required");
      return;
    }

    await createMutation.mutateAsync({
      sessionNumber: parseInt(formData.sessionNumber),
      groupId: parseInt(formData.groupId),
      date: new Date(formData.date),
      facilitator: formData.facilitator || undefined,
      topic: formData.topic || undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sessions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Schedule and manage program sessions
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
            <CardDescription>Choose a group to view and manage sessions</CardDescription>
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
                        setFormData({
                          sessionNumber: "",
                          groupId: selectedGroupId.toString(),
                          date: "",
                          facilitator: "",
                          topic: "",
                          notes: "",
                        });
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Session</DialogTitle>
                      <DialogDescription>
                        Add a new session for the group
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Session Number *</label>
                          <Input
                            type="number"
                            placeholder="1"
                            value={formData.sessionNumber || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sessionNumber: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Date *</label>
                          <Input
                            type="date"
                            value={formData.date || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, date: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Facilitator</label>
                          <Input
                            type="text"
                            placeholder="Facilitator name"
                            value={formData.facilitator || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                facilitator: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">Topic</label>
                          <Input
                            type="text"
                            placeholder="Session topic"
                            value={formData.topic || ""}
                            onChange={(e) =>
                              setFormData({ ...formData, topic: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea
                          placeholder="Additional notes..."
                          value={formData.notes || ""}
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
                          disabled={createMutation.isPending}
                        >
                          {createMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create"
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

        {/* Sessions List */}
        {selectedGroupId && (
          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>
                {sessionsQuery.data?.length || 0} sessions scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessionsQuery.isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                  <p>Loading sessions...</p>
                </div>
              ) : sessionsQuery.data?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No sessions scheduled yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionsQuery.data?.map((session) => (
                    <Card key={session.id} className="border">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">
                                Session {session.sessionNumber}
                              </h3>
                              {session.topic && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {session.topic}
                                </p>
                              )}
                            </div>
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>

                          <div className="text-sm space-y-1">
                            <p>
                              <span className="text-gray-600 dark:text-gray-400">Date:</span>
                              {" "}
                              {new Date(session.date).toLocaleDateString()}
                            </p>
                            {session.facilitator && (
                              <p>
                                <span className="text-gray-600 dark:text-gray-400">Facilitator:</span>
                                {" "}
                                {session.facilitator}
                              </p>
                            )}
                            {session.notes && (
                              <p className="text-gray-600 dark:text-gray-400">
                                {session.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
