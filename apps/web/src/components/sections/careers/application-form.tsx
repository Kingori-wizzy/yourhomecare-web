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
    <Section id="apply" className="bg-white">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-primary">Apply Today</p>
            <h2 className="mt-4 text-4xl font-bold">Submit Your Application</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              Share your details below and a member of our recruitment team will get back to you.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-16 rounded-3xl border bg-slate-50 p-8 shadow-sm lg:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium">Full Name</label>
                <Input placeholder="John Doe" {...register("fullName")} />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Email Address</label>
                <Input type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Phone Number</label>
                <Input placeholder="+254..." {...register("phone")} />
                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Position</label>
                <select {...register("position")} className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
                  <option value="">Select a Position</option>
                  {positions.map((position) => (
                    <option key={position.title} value={position.title}>
                      {position.title}
                    </option>
                  ))}
                  <option value="General Application">General Application</option>
                </select>
                {errors.position && <p className="mt-2 text-sm text-red-600">{errors.position.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">Relevant Experience</label>
                <Textarea rows={4} placeholder="Briefly describe your relevant qualifications and experience..." {...register("experience")} />
                {errors.experience && <p className="mt-2 text-sm text-red-600">{errors.experience.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">Motivation Statement</label>
                <Textarea rows={5} placeholder="Tell us why you would like to join YourHomeCare..." {...register("message")} />
                {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>}
              </div>
            </div>

            <Button size="lg" className="mt-8 px-10" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
