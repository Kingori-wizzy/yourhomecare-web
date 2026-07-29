"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewsletterSchema, type NewsletterFormData } from "@/lib/validations/newsletter";
import { useSubmit } from "@/lib/hooks/use-submit";

export function NewsletterSection() {
  const { loading, submit } = useSubmit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(NewsletterSchema),
  });

  async function onSubmit(data: NewsletterFormData) {
    try {
      const response = await submit("/api/newsletter", data);

      if (response.success) {
        toast.success("You’re on the list.");
        reset();
      } else {
        toast.error(response.message || "Unable to subscribe right now.");
      }
    } catch {
      toast.error("Please try again.");
    }
  }

  return (
    <Section className="bg-section">
      <Container>
        <div className="mx-auto max-w-5xl rounded-3xl border bg-white p-8 shadow-sm lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-semibold uppercase tracking-[0.2em] text-primary">Newsletter</p>
              <h2 className="mt-4 text-3xl font-bold lg:text-4xl">Stay informed about care tips and service updates</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Receive practical articles, home care guidance and relevant healthcare updates from YourHomeCare.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl bg-section p-6">
              <label className="mb-2 block font-medium">Name</label>
              <Input placeholder="Your name" {...register("name")} />
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}

              <label className="mt-4 mb-2 block font-medium">Email Address</label>
              <Input type="email" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}

              <Button size="lg" className="mt-6 w-full" disabled={loading}>
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </Section>
  );
}
