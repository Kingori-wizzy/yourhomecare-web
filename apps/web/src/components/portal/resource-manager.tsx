"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ResourceFieldType = "text" | "textarea" | "email" | "number" | "boolean" | "select" | "url";

export interface ResourceFieldOption {
  label: string;
  value: string;
}

export interface ResourceField {
  key: string;
  label: string;
  type: ResourceFieldType;
  options?: ResourceFieldOption[];
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  /** Hide this field from the table columns (still editable in the dialog). */
  hideInTable?: boolean;
  /** List field values are edited as comma-separated text and stored as an array. */
  isList?: boolean;
}

export interface ResourceManagerProps {
  resource: string;
  title: string;
  description?: string;
  fields: ResourceField[];
  defaultSort?: string;
  /** When true, disables create/edit/delete (e.g. audit logs). */
  readOnly?: boolean;
  emptyStateLabel?: string;
}

type RecordRow = Record<string, unknown> & { id: string };

interface ListResponse {
  data: RecordRow[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

const PAGE_SIZE = 10;

function formatCellValue(value: unknown, field?: ResourceField): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  if (field?.type === "select" && field.options) {
    const match = field.options.find((o) => o.value === value);
    if (match) return match.label;
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString();
    }
  }
  return String(value);
}

function toFormValue(value: unknown, field: ResourceField): string | boolean {
  if (field.type === "boolean") return Boolean(value);
  if (field.isList && Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined) return "";
  return String(value);
}

function buildInitialFormState(fields: ResourceField[], record?: RecordRow): Record<string, string | boolean> {
  const state: Record<string, string | boolean> = {};
  for (const field of fields) {
    state[field.key] = toFormValue(record?.[field.key], field);
  }
  return state;
}

function serializeFormState(fields: ResourceField[], form: Record<string, string | boolean>) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const value = form[field.key];
    if (field.type === "boolean") {
      payload[field.key] = Boolean(value);
    } else if (field.type === "number") {
      payload[field.key] = value === "" ? undefined : Number(value);
    } else if (field.isList) {
      payload[field.key] = String(value ?? "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } else {
      payload[field.key] = value;
    }
  }
  return payload;
}

function toCsv(rows: RecordRow[], fields: ResourceField[]) {
  const headers = ["id", ...fields.map((f) => f.key)];
  const escape = (value: unknown) => {
    const str = Array.isArray(value) ? value.join("; ") : String(value ?? "");
    return `"${str.replace(/"/g, '""')}"`;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

export function ResourceManager({
  resource,
  title,
  description,
  fields,
  defaultSort = "createdAt",
  readOnly = false,
  emptyStateLabel,
}: ResourceManagerProps) {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(defaultSort);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordRow | null>(null);
  const [formState, setFormState] = useState<Record<string, string | boolean>>({});
  const [deleteTarget, setDeleteTarget] = useState<RecordRow | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(handle);
  }, [search]);

  const queryKey = [resource, { q: debouncedSearch, page, sort, order }];

  const { data, isLoading, isFetching, isError } = useQuery<ListResponse>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams({
        q: debouncedSearch,
        page: String(page),
        pageSize: String(PAGE_SIZE),
        sort,
        order,
      });
      const response = await fetch(`/api/admin/${resource}?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to load records");
      }
      return response.json();
    },
    placeholderData: (prev) => prev,
  });

  const rows = data?.data ?? [];
  const pagination = data?.pagination;

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: [resource] });
  }

  const createMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch(`/api/admin/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create record");
      return response.json();
    },
    onSuccess: () => {
      toast.success(`${title.replace(/s$/, "")} created successfully.`);
      setDialogOpen(false);
      invalidate();
    },
    onError: () => toast.error("Unable to create record."),
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch(`/api/admin/${resource}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update record");
      return response.json();
    },
    onSuccess: () => {
      toast.success(`${title.replace(/s$/, "")} updated successfully.`);
      setDialogOpen(false);
      invalidate();
    },
    onError: () => toast.error("Unable to update record."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/${resource}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete record");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Record deleted.");
      setDeleteTarget(null);
      invalidate();
    },
    onError: () => toast.error("Unable to delete record."),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await fetch(`/api/admin/${resource}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulkDelete: true, ids }),
      });
      if (!response.ok) throw new Error("Failed to delete records");
      return response.json();
    },
    onSuccess: (result: { deleted?: number }) => {
      toast.success(`Deleted ${result?.deleted ?? selectedIds.length} record(s).`);
      setSelectedIds([]);
      setConfirmBulkDelete(false);
      invalidate();
    },
    onError: () => toast.error("Unable to delete selected records."),
  });

  function openCreateDialog() {
    setEditingRecord(null);
    setFormState(buildInitialFormState(fields));
    setDialogOpen(true);
  }

  function openEditDialog(record: RecordRow) {
    setEditingRecord(record);
    setFormState(buildInitialFormState(fields, record));
    setDialogOpen(true);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload = serializeFormState(fields, formState);

    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function toggleSort(key: string) {
    if (sort === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setOrder("asc");
    }
  }

  async function handleExportCsv() {
    try {
      const params = new URLSearchParams({
        q: debouncedSearch,
        page: "1",
        pageSize: "1000",
        sort,
        order,
      });
      const response = await fetch(`/api/admin/${resource}?${params.toString()}`);
      const result: ListResponse = await response.json();
      const csv = toCsv(result.data ?? [], fields);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resource}-export-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Unable to export data.");
    }
  }

  const tableFields = fields.filter((f) => !f.hideInTable);
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} type="button">
            <Download className="size-4" />
            Export CSV
          </Button>
          {!readOnly && (
            <Button size="sm" onClick={openCreateDialog} className="bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]">
              <Plus className="size-4" />
              Add new
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="h-9 pl-8"
            />
          </div>

          {selectedIds.length > 0 && !readOnly && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{selectedIds.length} selected</span>
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => setConfirmBulkDelete(true)}
              >
                <Trash2 className="size-4" />
                Delete selected
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-section text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                {!readOnly && (
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-slate-300"
                      checked={allSelected}
                      onChange={(e) =>
                        setSelectedIds(e.target.checked ? rows.map((r) => r.id) : [])
                      }
                    />
                  </th>
                )}
                {tableFields.map((field) => (
                  <th key={field.key} className="px-4 py-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleSort(field.key)}
                      className="flex items-center gap-1 hover:text-slate-800"
                    >
                      {field.label}
                      {sort === field.key ? (
                        order === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-40" />
                      )}
                    </button>
                  </th>
                ))}
                {!readOnly && <th className="w-24 px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={tableFields.length + 2} className="px-4 py-12 text-center text-slate-400">
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={tableFields.length + 2} className="px-4 py-12 text-center text-red-500">
                    Unable to load data.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={tableFields.length + 2} className="px-4 py-12 text-center text-slate-400">
                    {emptyStateLabel ?? `No ${title.toLowerCase()} found yet.`}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-section">
                    {!readOnly && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="size-4 rounded border-slate-300"
                          checked={selectedIds.includes(row.id)}
                          onChange={(e) =>
                            setSelectedIds((prev) =>
                              e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id)
                            )
                          }
                        />
                      </td>
                    )}
                    {tableFields.map((field) => (
                      <td key={field.key} className="max-w-xs truncate px-4 py-3 text-slate-700">
                        {field.type === "boolean" ? (
                          <Badge variant={row[field.key] ? "default" : "outline"}>
                            {row[field.key] ? "Yes" : "No"}
                          </Badge>
                        ) : (
                          formatCellValue(row[field.key], field)
                        )}
                      </td>
                    ))}
                    {!readOnly && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditDialog(row)}
                            className="flex size-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                            aria-label="Edit"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(row)}
                            className="flex size-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                            aria-label="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > 0 && (
          <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {(pagination.page - 1) * pagination.pageSize + 1}–
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
              {isFetching && <span className="ml-2 text-slate-400">Refreshing...</span>}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-slate-600">
                Page {pagination.page} of {Math.max(1, pagination.totalPages)}
              </span>
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRecord ? `Edit ${title.replace(/s$/, "")}` : `Add ${title.replace(/s$/, "")}`}</DialogTitle>
            <DialogDescription>
              {editingRecord ? "Update the details below." : "Fill in the details to create a new record."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.key}>
                {field.type !== "boolean" && (
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                )}

                {field.type === "textarea" ? (
                  <Textarea
                    required={field.required}
                    placeholder={field.placeholder}
                    value={String(formState[field.key] ?? "")}
                    onChange={(e) => setFormState((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    rows={4}
                  />
                ) : field.type === "select" ? (
                  <select
                    required={field.required}
                    value={String(formState[field.key] ?? "")}
                    onChange={(e) => setFormState((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "boolean" ? (
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-slate-300 text-[#0F6CBD] focus:ring-[#0F6CBD]"
                      checked={Boolean(formState[field.key])}
                      onChange={(e) => setFormState((prev) => ({ ...prev, [field.key]: e.target.checked }))}
                    />
                    {field.label}
                  </label>
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={String(formState[field.key] ?? "")}
                    onChange={(e) => setFormState((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  />
                )}

                {field.helperText && <p className="mt-1 text-xs text-slate-400">{field.helperText}</p>}
              </div>
            ))}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isMutating} className="bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]">
                {isMutating ? <Loader2 className="size-4 animate-spin" /> : null}
                {editingRecord ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete record</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This record will be permanently removed.
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

      <Dialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.length} record(s)</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmBulkDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={bulkDeleteMutation.isPending}
              onClick={() => bulkDeleteMutation.mutate(selectedIds)}
            >
              {bulkDeleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
