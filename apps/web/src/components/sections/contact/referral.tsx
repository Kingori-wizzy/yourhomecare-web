"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ReferralSchema, type ReferralFormData } from "@/lib/validations/referral";
import { useSubmit } from "@/lib/hooks/use-submit";

const fieldClassName = "h-11 rounded-[8px] border-border";
const selectClassName =
  "flex h-11 w-full rounded-[8px] border border-border bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ReferralSection() {
  const { loading, submit } = useSubmit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReferralFormData>({
    resolver: zodResolver(ReferralSchema),
  });

  async function onSubmit(data: ReferralFormData) {
    try {
      const response = await submit("/api/referral", data);

      if (response.success) {
        toast.success("Referral submitted successfully.");
        reset();
      } else {
        toast.error(response.message || "Unable to submit your referral.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Section id="referral" className="bg-section">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Hospital Referrals
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
              Refer a Patient
            </h2>
            <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
              Consultants, hospitals, case managers and medical insurers can securely refer patients
              for professional home healthcare services.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-14 rounded-[8px] border border-border bg-white p-8 shadow-[var(--shadow-sm)] lg:p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                  Referring Hospital / Organisation
                </label>
                <Input
                  placeholder="Hospital Name"
                  className={fieldClassName}
                  {...register("organisation")}
                />
                {errors.organisation && (
                  <p className="mt-2 text-sm text-red-600">{errors.organisation.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                  Consultant / Doctor
                </label>
                <Input
                  placeholder="Doctor's Name"
                  className={fieldClassName}
                  {...register("referrerName")}
                />
                {errors.referrerName && (
                  <p className="mt-2 text-sm text-red-600">{errors.referrerName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Contact Number</label>
                <Input placeholder="+254..." className={fieldClassName} {...register("phone")} />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">Email Address</label>
                <Input
                  type="email"
                  placeholder="doctor@hospital.com"
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
                <label className="mb-2 block text-sm font-medium text-primary">
                  Patient Location
                </label>
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
                  Primary Diagnosis
                </label>
                <Input
                  placeholder="Diagnosis or Medical Condition"
                  className={fieldClassName}
                  {...register("diagnosis")}
                />
                {errors.diagnosis && (
                  <p className="mt-2 text-sm text-red-600">{errors.diagnosis.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-primary">
                  Required Home Care Service
                </label>
                <select {...register("service")} className={selectClassName}>
                  <option value="">Select Service</option>
                  <option value="Home Nursing">Home Nursing</option>
                  <option value="Palliative Care">Palliative Care</option>
                  <option value="Post Hospital Recovery">Post Hospital Recovery</option>
                  <option value="Elderly Care">Elderly Care</option>
                  <option value="Caregiver Services">Caregiver Services</option>
                  <option value="Rehabilitation Support">Rehabilitation Support</option>
                  <option value="Healthcare Staffing">Healthcare Staffing</option>
                </select>
                {errors.service && (
                  <p className="mt-2 text-sm text-red-600">{errors.service.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                  Preferred Start Date
                </label>
                <Input
                  type="date"
                  className={fieldClassName}
                  {...register("preferredDate")}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-primary">
                  Clinical Notes / Referral Information
                </label>
                <Textarea
                  rows={6}
                  placeholder="Provide any relevant medical information, discharge summary, care instructions or referral notes."
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
              className="mt-8 h-12 rounded-[8px] bg-secondary px-8 text-base font-semibold text-white hover:bg-secondary/90"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Referral"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
