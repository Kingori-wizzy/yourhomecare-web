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
    <Section id="assessment" className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-primary">Book an Assessment</p>
            <h2 className="mt-4 text-4xl font-bold">Request a Home Healthcare Assessment</h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
              Tell us about the patient and the care required. Our team will review your request and contact you to arrange an assessment.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-16 rounded-3xl border bg-white p-10 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium">Full Name</label>
                <Input placeholder="John Doe" {...register("fullName")} />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Phone Number</label>
                <Input placeholder="+254..." {...register("phone")} />
                {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Email Address</label>
                <Input type="email" placeholder="example@email.com" {...register("email")} />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Patient Name</label>
                <Input placeholder="Patient Name" {...register("patientName")} />
                {errors.patientName && <p className="mt-2 text-sm text-red-600">{errors.patientName.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Patient Age</label>
                <Input placeholder="Age" {...register("patientAge")} />
                {errors.patientAge && <p className="mt-2 text-sm text-red-600">{errors.patientAge.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Location</label>
                <Input placeholder="Town / County" {...register("location")} />
                {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">Required Service</label>
                <select {...register("service")} className="flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
                  <option value="">Select a Service</option>
                  <option value="Home Nursing">Home Nursing</option>
                  <option value="Palliative Care">Palliative Care</option>
                  <option value="Elderly Care">Elderly Care</option>
                  <option value="Caregiver Services">Caregiver Services</option>
                  <option value="Healthcare Staffing">Healthcare Staffing</option>
                  <option value="Post Hospital Recovery">Post Hospital Recovery</option>
                  <option value="Rehabilitation Support">Rehabilitation Support</option>
                </select>
                {errors.service && <p className="mt-2 text-sm text-red-600">{errors.service.message}</p>}
              </div>

              <div>
                <label className="mb-2 block font-medium">Preferred Visit Date</label>
                <Input type="date" {...register("preferredDate")} />
              </div>

              <div>
                <label className="mb-2 block font-medium">Preferred Time</label>
                <Input type="time" {...register("preferredTime")} />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-medium">Additional Notes</label>
                <Textarea rows={6} placeholder="Tell us about the patient's condition and how we can help..." {...register("notes")} />
                {errors.notes && <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>}
              </div>
            </div>

            <Button size="lg" className="mt-8 bg-black px-10 hover:bg-slate-800" disabled={loading}>
              {loading ? "Submitting..." : "Request Assessment"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}