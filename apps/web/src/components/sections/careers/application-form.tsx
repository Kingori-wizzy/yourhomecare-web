"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CareerApplicationSchema, type CareerApplicationFormData } from "@/lib/validations/careers";
import { useSubmit } from "@/lib/hooks/use-submit";
import type { JobItem } from "@/server/cms";

interface ApplicationFormProps {
  positions?: JobItem[];
}

export function ApplicationForm({ positions = [] }: ApplicationFormProps) {
  const { loading, submit } = useSubmit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CareerApplicationFormData>({
    resolver: zodResolver(CareerApplicationSchema),
  });

  async function onSubmit(data: CareerApplicationFormData) {
    try {
      const response = await submit("/api/careers", data);

      if (response.success) {
        toast.success("Application received. Our recruitment team will be in touch.");
        reset();
      } else {
        toast.error(response.message || "Unable to submit your application.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Section id="apply" className="bg-section">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Apply Today
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
              Submit Your Application
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-[1.6] text-muted-foreground">
              Share your details below and a member of our recruitment team will get back to you.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-14 rounded-[8px] border border-border bg-white p-8 shadow-[var(--shadow-sm)] lg:p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-primary">Full Name</label>
                <Input placeholder="John Doe" {...register("fullName")} />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-medium text-primary">Email Address</label>
                <Input type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium text-primary">Phone Number</label>
                <Input placeholder="+254..." {...register("phone")} />
                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium text-primary">Position</label>
                <select
                  {...register("position")}
                  className="flex h-11 w-full rounded-[8px] border border-border bg-white px-3 text-sm"
                >
                  <option value="">Select a Position</option>
                  {positions.map((position) => (
                    <option key={position.title} value={position.title}>
                      {position.title}
                    </option>
                  ))}
                  <option value="General Application">General Application</option>
                </select>
                {errors.position && (
                  <p className="mt-2 text-sm text-red-600">{errors.position.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-primary">Relevant Experience</label>
                <Textarea
                  rows={4}
                  placeholder="Briefly describe your relevant qualifications and experience..."
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className="mt-2 text-sm text-red-600">{errors.experience.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium text-primary">Motivation Statement</label>
                <Textarea
                  rows={5}
                  placeholder="Tell us why you would like to join YourHomeCare..."
                  {...register("message")}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>
            </div>

            <Button
              size="lg"
              className="mt-8 h-12 rounded-[8px] bg-secondary px-10 text-base font-semibold text-white hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
