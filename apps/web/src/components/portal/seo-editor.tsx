"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SeoValue {
  siteTitle?: string;
  titleTemplate?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  twitterHandle?: string;
}

interface SettingRecord {
  id: string;
  key: string;
  value: SeoValue;
}

interface ListResponse {
  data: SettingRecord[];
}

interface FormState {
  siteTitle: string;
  titleTemplate: string;
  description: string;
  keywords: string;
  ogImage: string;
  twitterHandle: string;
}

const SEO_KEY = "seo_global";

function defaultsFromRecord(record: SettingRecord | undefined): FormState {
  return {
    siteTitle: record?.value?.siteTitle ?? "",
    titleTemplate: record?.value?.titleTemplate ?? "",
    description: record?.value?.description ?? "",
    keywords: (record?.value?.keywords ?? []).join(", "),
    ogImage: record?.value?.ogImage ?? "",
    twitterHandle: record?.value?.twitterHandle ?? "",
  };
}

function SeoForm({ record }: { record: SettingRecord | undefined }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => defaultsFromRecord(record));

  const saveMutation = useMutation({
    mutationFn: async () => {
      const value: SeoValue = {
        siteTitle: form.siteTitle,
        titleTemplate: form.titleTemplate,
        description: form.description,
        keywords: form.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        ogImage: form.ogImage,
        twitterHandle: form.twitterHandle,
      };

      if (record) {
        const response = await fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: record.id, value }),
        });
        if (!response.ok) throw new Error("Failed to save");
        return response.json();
      }

      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: SEO_KEY, value }),
      });
      if (!response.ok) throw new Error("Failed to save");
      return response.json();
    },
    onSuccess: () => {
      toast.success("SEO defaults saved.");
      queryClient.invalidateQueries({ queryKey: ["settings", SEO_KEY] });
    },
    onError: () => toast.error("Unable to save SEO settings."),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveMutation.mutate();
      }}
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Site title</label>
          <Input
            value={form.siteTitle}
            onChange={(e) => setForm((prev) => ({ ...prev, siteTitle: e.target.value }))}
            placeholder="YourHomeCare"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Title template</label>
          <Input
            value={form.titleTemplate}
            onChange={(e) => setForm((prev) => ({ ...prev, titleTemplate: e.target.value }))}
            placeholder="%s | YourHomeCare"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Meta description</label>
        <Textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Bringing UK healthcare standards to Kenyan homes..."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Keywords</label>
        <Input
          value={form.keywords}
          onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))}
          placeholder="home care kenya, home nursing, elderly care"
        />
        <p className="mt-1 text-xs text-slate-400">Comma-separated list of keywords.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Default OG image URL</label>
          <Input
            value={form.ogImage}
            onChange={(e) => setForm((prev) => ({ ...prev, ogImage: e.target.value }))}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Twitter handle</label>
          <Input
            value={form.twitterHandle}
            onChange={(e) => setForm((prev) => ({ ...prev, twitterHandle: e.target.value }))}
            placeholder="@yourhomecareke"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saveMutation.isPending}
          className="bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]"
        >
          {saveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save SEO defaults
        </Button>
      </div>
    </form>
  );
}

export function SeoEditor() {
  const { data, isLoading } = useQuery<ListResponse>({
    queryKey: ["settings", SEO_KEY],
    queryFn: async () => {
      const response = await fetch(`/api/admin/settings?q=${SEO_KEY}&pageSize=50`);
      if (!response.ok) throw new Error("Failed to load SEO settings");
      return response.json();
    },
  });

  const record = data?.data.find((item) => item.key === SEO_KEY);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">SEO defaults</h2>
        <p className="mt-1 text-sm text-slate-500">
          Configure the default metadata used across YourHomeCare pages when a page does not define its own.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-5 animate-spin text-slate-400" />
        </div>
      ) : (
        <SeoForm key={record?.id ?? "new"} record={record} />
      )}

      <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
        <Search className="size-4 shrink-0" />
        Need to customize SEO for a specific page? Use the CMS Pages module to set a page-level title and
        description that will override these defaults.
      </div>
    </div>
  );
}
