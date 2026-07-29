"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AssessmentSchema, type AssessmentFormData } from "@/lib/validations/assessment";
import { useSubmit } from "@/lib/hooks/use-submit";

const fieldClassName = "h-11 rounded-[8px] border-border";
const selectClassName =
  "flex h-11 w-full rounded-[8px] border border-border bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AssessmentSection() {
  const { loading, submit } = useSubmit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(AssessmentSchema),
  });

  async function onSubmit(data: AssessmentFormData) {
    try {
      const response = await submit("/api/assessment", data);

      if (response.success) {
        toast.success("Assessment request received.");
        reset();
      } else {
        toast.error(response.message || "Unable to submit your assessment request.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Section id="assessment" className="bg-white">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Book an Assessment
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
              Request a Home Healthcare Assessment
            </h2>
            <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
              Tell us about the patient and the care required. Our team will review your request and
              contact you to arrange an assessment.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-14 rounded-[8px] border border-border bg-[#f8f9ff] p-8 shadow-[var(--shadow-sm)] lg:p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Full Name</label>
                <Input
                  placeholder="John Doe"
                  className={fieldClassName}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Phone Number</label>
                <Input placeholder="+254..." className={fieldClassName} {...register("phone")} />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Email Address</label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  className={fieldClassName}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Patient Name</label>
                <Input
                  placeholder="Patient Name"
                  className={fieldClassName}
                  {...register("patientName")}
                />
                {errors.patientName && (
                  <p className="mt-2 text-sm text-red-600">{errors.patientName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Patient Age</label>
                <Input placeholder="Age" className={fieldClassName} {...register("patientAge")} />
                {errors.patientAge && (
                  <p className="mt-2 text-sm text-red-600">{errors.patientAge.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Location</label>
                <Input
                  placeholder="Town / County"
                  className={fieldClassName}
                  {...register("location")}
                />
                {errors.location && (
                  <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-primary">
                  Required Service
                </label>
                <select {...register("service")} className={selectClassName}>
                  <option value="">Select a Service</option>
                  <option value="Home Nursing">Home Nursing</option>
                  <option value="Palliative Care">Palliative Care</option>
                  <option value="Elderly Care">Elderly Care</option>
                  <option value="Caregiver Services">Caregiver Services</option>
                  <option value="Healthcare Staffing">Healthcare Staffing</option>
                  <option value="Post Hospital Recovery">Post Hospital Recovery</option>
                  <option value="Rehabilitation Support">Rehabilitation Support</option>
                </select>
                {errors.service && (
                  <p className="mt-2 text-sm text-red-600">{errors.service.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                  Preferred Visit Date
                </label>
                <Input
                  type="date"
                  className={fieldClassName}
                  {...register("preferredDate")}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Preferred Time</label>
                <Input
                  type="time"
                  className={fieldClassName}
                  {...register("preferredTime")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-primary">
                  Additional Notes
                </label>
                <Textarea
                  rows={6}
                  placeholder="Tell us about the patient's condition and how we can help..."
                  className="rounded-[8px] border-border"
                  {...register("notes")}
                />
                {errors.notes && (
                  <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>
                )}
              </div>
            </div>

            <Button
              size="lg"
              className="mt-8 h-12 rounded-[8px] bg-primary px-8 text-base font-semibold text-white hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Request Assessment"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
