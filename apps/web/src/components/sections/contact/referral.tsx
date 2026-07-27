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
    <Section id="referral" className="bg-white">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-primary">Hospital Referrals</p>
            <h2 className="mt-4 text-4xl font-bold">Refer a Patient</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
              Consultants, hospitals, case managers and medical insurers can securely refer patients for professional home healthcare services.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-16 rounded-3xl border bg-slate-50 p-10 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium">Referring Hospital / Organisation</label>
                <Input placeholder="Hospital Name" {...register("organisation")} />
                {errors.organisation && <p className="mt-2 text-sm text-red-600">{errors.organisation.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Consultant / Doctor</label>
                <Input placeholder="Doctor's Name" {...register("referrerName")} />
                {errors.referrerName && <p className="mt-2 text-sm text-red-600">{errors.referrerName.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Contact Number</label>
                <Input placeholder="+254..." {...register("phone")} />
                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Email Address</label>
                <Input type="email" placeholder="doctor@hospital.com" {...register("email")} />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Patient Name</label>
                <Input placeholder="Patient Name" {...register("patientName")} />
                {errors.patientName && <p className="mt-2 text-sm text-red-600">{errors.patientName.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Patient Location</label>
                <Input placeholder="Town / County" {...register("location")} />
                {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">Primary Diagnosis</label>
                <Input placeholder="Diagnosis or Medical Condition" {...register("diagnosis")} />
                {errors.diagnosis && <p className="mt-2 text-sm text-red-600">{errors.diagnosis.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">Required Home Care Service</label>
                <select {...register("service")} className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
                  <option value="">Select Service</option>
                  <option value="Home Nursing">Home Nursing</option>
                  <option value="Palliative Care">Palliative Care</option>
                  <option value="Post Hospital Recovery">Post Hospital Recovery</option>
                  <option value="Elderly Care">Elderly Care</option>
                  <option value="Caregiver Services">Caregiver Services</option>
                  <option value="Rehabilitation Support">Rehabilitation Support</option>
                  <option value="Healthcare Staffing">Healthcare Staffing</option>
                </select>
                {errors.service && <p className="mt-2 text-sm text-red-600">{errors.service.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Preferred Start Date</label>
                <Input type="date" {...register("preferredDate")} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">Clinical Notes / Referral Information</label>
                <Textarea rows={6} placeholder="Provide any relevant medical information, discharge summary, care instructions or referral notes." {...register("notes")} />
                {errors.notes && <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>}
              </div>
            </div>

            <Button size="lg" className="mt-8 px-10" disabled={loading}>
              {loading ? "Submitting..." : "Submit Referral"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}