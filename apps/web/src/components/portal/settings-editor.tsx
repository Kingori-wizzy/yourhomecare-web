"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Save, Settings2, Trash2 } from "lucide-react";

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

interface SettingRecord {
  id: string;
  key: string;
  value: unknown;
  updatedAt: string;
}

interface ListResponse {
  data: SettingRecord[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

function stringifyValue(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function SettingsEditor() {
  const queryClient = useQueryClient();
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<SettingRecord | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState('""');

  const { data, isLoading } = useQuery<ListResponse>({
    queryKey: ["settings-editor"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings?pageSize=200&sort=key&order=asc");
      if (!response.ok) throw new Error("Failed to load settings");
      return response.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: unknown }) => {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, value }),
      });
      if (!response.ok) throw new Error("Failed to save setting");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Setting saved.");
      queryClient.invalidateQueries({ queryKey: ["settings-editor"] });
    },
    onError: () => toast.error("Unable to save setting. Check the JSON is valid."),
  });

  const createMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!response.ok) throw new Error("Failed to create setting");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Setting created.");
      setCreateOpen(false);
      setNewKey("");
      setNewValue('""');
      queryClient.invalidateQueries({ queryKey: ["settings-editor"] });
    },
    onError: () => toast.error("Unable to create setting."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/settings?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete setting");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Setting deleted.");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["settings-editor"] });
    },
    onError: () => toast.error("Unable to delete setting."),
  });

  function handleSave(setting: SettingRecord) {
    const raw = drafts[setting.id] ?? stringifyValue(setting.value);
    try {
      const parsed = JSON.parse(raw);
      saveMutation.mutate({ id: setting.id, value: parsed });
    } catch {
      toast.error("Value must be valid JSON, e.g. \"text\", 123, true, or { }");
    }
  }

  function handleCreate() {
    if (!newKey.trim()) {
      toast.error("Setting key is required.");
      return;
    }
    try {
      const parsed = JSON.parse(newValue);
      createMutation.mutate({ key: newKey.trim(), value: parsed });
    } catch {
      toast.error("Value must be valid JSON, e.g. \"text\", 123, true, or { }");
    }
  }

  const settings = data?.data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Website settings</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage site-wide configuration keys stored as JSON values.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]">
          <Plus className="size-4" />
          Add setting
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-5 animate-spin text-slate-400" />
        </div>
      ) : settings.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 py-16 text-slate-400">
          <Settings2 className="size-8" />
          <p>No settings configured yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {settings.map((setting) => (
            <div key={setting.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-semibold text-slate-800">{setting.key}</p>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(setting)}
                  className="flex size-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                  aria-label="Delete setting"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <Textarea
                rows={4}
                className="font-mono text-xs"
                defaultValue={stringifyValue(setting.value)}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [setting.id]: e.target.value }))}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSave(setting)}
                disabled={saveMutation.isPending}
                className="self-end"
              >
                {saveMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
                Save
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add setting</DialogTitle>
            <DialogDescription>Create a new site configuration key with a JSON value.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Key</label>
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. business_hours"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Value (JSON)</label>
              <Textarea
                rows={5}
                className="font-mono text-xs"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]"
            >
              {createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete setting</DialogTitle>
            <DialogDescription>
              This will permanently remove &ldquo;{deleteTarget?.key}&rdquo;.
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
