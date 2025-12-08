import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, BookOpen, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const CATEGORIES = [
  "Intercultural Communication",
  "Conflict Resolution",
  "Diversity & Inclusion",
  "Team Building",
  "Leadership",
  "Other",
];

export default function Materials() {
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    url: "",
  });

  // Queries
  const materialsQuery = trpc.materials.list.useQuery();
  const categoryQuery = trpc.materials.listByCategory.useQuery(
    { category: selectedCategory || "" },
    { enabled: !!selectedCategory }
  );

  // Mutations
  const createMutation = trpc.materials.create.useMutation({
    onSuccess: () => {
      setSuccess("Material created successfully");
      setFormData({ title: "", description: "", category: "", url: "" });
      setIsDialogOpen(false);
      materialsQuery.refetch();
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

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    await createMutation.mutateAsync({
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category || undefined,
      url: formData.url || undefined,
      fileKey: undefined,
    });
  };

  const displayMaterials = selectedCategory ? categoryQuery.data : materialsQuery.data;
  const isLoading = selectedCategory ? categoryQuery.isLoading : materialsQuery.isLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Materials Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Educational resources for intercultural programs
            </p>
          </div>

          {user.role === "admin" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Material
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Material</DialogTitle>
                  <DialogDescription>
                    Add an educational resource to the library
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      type="text"
                      placeholder="Material title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Material description..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">URL</label>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        value={formData.url}
                        onChange={(e) =>
                          setFormData({ ...formData, url: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

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
                          Adding...
                        </>
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
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

        {/* Category Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter by Category</CardTitle>
            <CardDescription>Select a category to view materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
              >
                All Materials
              </Button>
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p>Loading materials...</p>
            </div>
          ) : displayMaterials?.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No materials found</p>
            </div>
          ) : (
            displayMaterials?.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2">{material.title}</CardTitle>
                      {material.category && (
                        <CardDescription className="mt-1">
                          {material.category}
                        </CardDescription>
                      )}
                    </div>
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {material.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {material.description}
                    </p>
                  )}

                  <div className="mt-auto">
                    {material.url && (
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => window.open(material.url || "#", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Link
                      </Button>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mt-4">
                    Added {new Date(material.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
