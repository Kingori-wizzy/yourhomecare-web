"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/services?q=${encodeURIComponent(q)}` : "/services");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-[8px] border border-border bg-white p-2 shadow-[var(--shadow-lg)]"
    >
      <div className="flex flex-1 items-center gap-3 px-3">
        <Search className="h-5 w-5 shrink-0 text-secondary" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Directory — nursing, personal care, therapy…"
          className="h-11 w-full bg-transparent text-base text-primary outline-none placeholder:text-muted-foreground"
          aria-label="Search Directory"
        />
      </div>
      <Button
        type="submit"
        className="h-11 shrink-0 rounded-[8px] bg-primary px-5 text-sm font-semibold text-white hover:bg-primary/90"
      >
        Search
      </Button>
    </form>
  );
}
