"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy, FileIcon, ImageIcon, Loader2, Search, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  publicId?: string;
  resourceType: string;
  mimeType?: string;
  size?: number;
  folder?: string;
  alt?: string;
  tags?: string[];
  createdAt: string;
}

interface MediaListResponse {
  data: MediaItem[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

function formatBytes(bytes?: number) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function MediaLibrary() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);

  const { data, isLoading, isError } = useQuery<MediaListResponse>({
    queryKey: ["media", search],
    queryFn: async () => {
      const params = new URLSearchParams({ q: search, page: "1", pageSize: "100" });
      const response = await fetch(`/api/admin/media?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to load media");
      return response.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error ?? "Upload failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Unable to upload file.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete media");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Media deleted.");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
    onError: () => toast.error("Unable to delete media."),
  });

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadingCount(files.length);

    try {
      for (const file of Array.from(files)) {
        await uploadMutation.mutateAsync(file);
      }
      toast.success(`Uploaded ${files.length} file(s).`);
    } finally {
      setUploadingCount(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(
      () => toast.success("URL copied to clipboard."),
      () => toast.error("Unable to copy URL.")
    );
  }

  const items = data?.data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Media library</h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload and manage images and files used across the website.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingCount > 0}
            className="bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]"
          >
            {uploadingCount > 0 ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Upload files
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media..."
          className="h-9 pl-8"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-5 animate-spin text-slate-400" />
          </div>
        ) : isError ? (
          <p className="py-16 text-center text-red-500">Unable to load media library.</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
            <ImageIcon className="size-8" />
            <p>No media uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200"
              >
                <div className="flex aspect-square items-center justify-center bg-slate-50">
                  {item.resourceType === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.alt ?? item.name} className="size-full object-cover" />
                  ) : (
                    <FileIcon className="size-10 text-slate-300" />
                  )}
                </div>
                <div className="flex flex-col gap-1 p-2.5">
                  <p className="truncate text-xs font-medium text-slate-700" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[0.7rem] text-slate-400">{formatBytes(item.size)}</p>
                </div>
                <div className="absolute inset-x-0 top-0 flex justify-end gap-1 bg-gradient-to-b from-black/40 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.url)}
                    className="flex size-7 items-center justify-center rounded-md bg-white/90 text-slate-700 hover:bg-white"
                    aria-label="Copy URL"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="flex size-7 items-center justify-center rounded-md bg-white/90 text-red-600 hover:bg-white"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete media</DialogTitle>
            <DialogDescription>
              This will permanently remove &ldquo;{deleteTarget?.name}&rdquo; from the media library.
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
