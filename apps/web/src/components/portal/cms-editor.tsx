"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileStack, Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PageContentRecord {
  id: string;
  pageKey: string;
  title?: string;
  sections: Record<string, unknown>;
  seo?: { title?: string; description?: string } & Record<string, unknown>;
  updatedAt: string;
}

interface ListResponse {
  data: PageContentRecord[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

const KNOWN_PAGE_KEYS = [
  "home",
  "about",
  "services",
  "solutions",
  "technology",
  "careers",
  "contact",
  "faq",
  "testimonials",
  "partners",
  "appointments",
  "blog",
];

interface FormState {
  pageKey: string;
  title: string;
  sectionsJson: string;
  seoTitle: string;
  seoDescription: string;
}

const EMPTY_FORM: FormState = {
  pageKey: "",
  title: "",
  sectionsJson: "{}",
  seoTitle: "",
  seoDescription: "",
};

export function CmsEditor() {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PageContentRecord | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<PageContentRecord | null>(null);

  const { data, isLoading } = useQuery<ListResponse>({
    queryKey: ["pages-editor"],
    queryFn: async () => {
      const response = await fetch("/api/admin/pages?pageSize=100&sort=pageKey&order=asc");
      if (!response.ok) throw new Error("Failed to load pages");
      return response.json();
    },
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["pages-editor"] });
  }

  const createMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create page");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Page content created.");
      setDialogOpen(false);
      invalidate();
    },
    onError: () => toast.error("Unable to create page content."),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch("/api/admin/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update page");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Page content updated.");
      setDialogOpen(false);
      invalidate();
    },
    onError: () => toast.error("Unable to update page content."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/pages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete page");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Page content deleted.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: () => toast.error("Unable to delete page content."),
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(record: PageContentRecord) {
    setEditing(record);
    setForm({
      pageKey: record.pageKey,
      title: record.title ?? "",
      sectionsJson: JSON.stringify(record.sections ?? {}, null, 2),
      seoTitle: record.seo?.title ?? "",
      seoDescription: record.seo?.description ?? "",
    });
    setDialogOpen(true);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!form.pageKey.trim()) {
      toast.error("Page key is required.");
      return;
    }

    let sections: Record<string, unknown>;
    try {
      sections = JSON.parse(form.sectionsJson || "{}");
    } catch {
      toast.error("Sections must be valid JSON.");
      return;
    }

    const payload = {
      pageKey: form.pageKey.trim(),
      title: form.title,
      sections,
      seo: { title: form.seoTitle, description: form.seoDescription },
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const pages = data?.data ?? [];
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">CMS pages</h2>
          <p className="mt-1 text-sm text-slate-500">
            Edit structured content and per-page SEO for key marketing pages.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]">
          <Plus className="size-4" />
          Add page content
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-5 animate-spin text-slate-400" />
        </div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 py-16 text-slate-400">
          <FileStack className="size-8" />
          <p>No CMS page content has been created yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <div key={page.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm font-semibold text-slate-800">{page.pageKey}</p>
                  <p className="text-sm text-slate-500">{page.title || "Untitled page"}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(page)}
                    className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                    aria-label="Edit"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(page)}
                    className="flex size-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              {page.seo?.title && (
                <p className="text-xs text-slate-400">SEO title: {page.seo.title}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit page content" : "Add page content"}</DialogTitle>
            <DialogDescription>
              Sections are stored as structured JSON consumed by the corresponding public page.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Page key</label>
              <Input
                list="page-keys"
                value={form.pageKey}
                onChange={(e) => setForm((prev) => ({ ...prev, pageKey: e.target.value }))}
                placeholder="home"
                disabled={Boolean(editing)}
                required
              />
              <datalist id="page-keys">
                {KNOWN_PAGE_KEYS.map((key) => (
                  <option key={key} value={key} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Page title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Home"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Sections (JSON)</label>
              <Textarea
                rows={8}
                className="font-mono text-xs"
                value={form.sectionsJson}
                onChange={(e) => setForm((prev) => ({ ...prev, sectionsJson: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">SEO title</label>
              <Input
                value={form.seoTitle}
                onChange={(e) => setForm((prev) => ({ ...prev, seoTitle: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">SEO description</label>
              <Textarea
                rows={3}
                value={form.seoDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, seoDescription: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]">
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
                {editing ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete page content</DialogTitle>
            <DialogDescription>
              This will remove the stored content for &ldquo;{deleteTarget?.pageKey}&rdquo;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
