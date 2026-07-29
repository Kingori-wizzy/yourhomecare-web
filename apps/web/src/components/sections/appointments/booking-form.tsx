"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { AppointmentSchema, type AppointmentFormData } from "@/lib/validations/appointment";
import { useSubmit } from "@/lib/hooks/use-submit";

const SERVICE_OPTIONS = [
  "Home Nursing",
  "Elderly Care",
  "Post-Hospital Recovery",
  "Palliative Care",
  "Chronic Disease Management",
  "Assessment Visit",
];

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export function BookingForm() {
  const { loading, submit } = useSubmit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(AppointmentSchema),
  });

  const disabled = loading || isSubmitting;

  async function onSubmit(data: AppointmentFormData) {
    if (disabled) return;

    try {
      const response = await submit("/api/appointment", data);

      if (response.success) {
        toast.success(response.message || "Appointment request received.");
        reset();
      } else {
        toast.error(response.message || "Unable to submit your appointment request.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[8px] border border-border bg-white p-8 shadow-[var(--shadow-sm)] lg:p-10"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium text-primary">Full Name</label>
          <Input placeholder="John Doe" {...register("fullName")} />
          {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="mb-2 block font-medium text-primary">Phone Number</label>
          <Input placeholder="+254..." {...register("phone")} />
          {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="mb-2 block font-medium text-primary">Email Address</label>
          <Input type="email" placeholder="example@email.com" {...register("email")} />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-2 block font-medium text-primary">Patient Name</label>
          <Input placeholder="Patient Name" {...register("patientName")} />
          {errors.patientName && (
            <p className="mt-2 text-sm text-red-600">{errors.patientName.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-primary">Service Required</label>
          <select
            {...register("service")}
            className="flex h-11 w-full rounded-[8px] border border-border bg-white px-3 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Select a Service
            </option>
            {SERVICE_OPTIONS.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {errors.service && <p className="mt-2 text-sm text-red-600">{errors.service.message}</p>}
        </div>

        <div>
          <label className="mb-2 block font-medium text-primary">Preferred Date</label>
          <Input type="date" {...register("preferredDate")} />
          {errors.preferredDate && (
            <p className="mt-2 text-sm text-red-600">{errors.preferredDate.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-primary">Preferred Time</label>
          <select
            {...register("preferredTime")}
            className="flex h-11 w-full rounded-[8px] border border-border bg-white px-3 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Select a Time
            </option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.preferredTime && (
            <p className="mt-2 text-sm text-red-600">{errors.preferredTime.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-primary">Location</label>
          <Input placeholder="Town / County" {...register("location")} />
          {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-primary">Additional Notes</label>
          <Textarea
            rows={6}
            placeholder="Tell us about the patient's condition and how we can help..."
            {...register("notes")}
          />
          {errors.notes && <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>}
        </div>
      </div>

      <Button
        size="lg"
        type="submit"
        className="mt-8 h-12 rounded-[8px] bg-secondary px-10 text-base font-semibold text-white hover:bg-secondary/90"
        disabled={disabled}
      >
        {disabled ? "Submitting..." : "Book Appointment"}
      </Button>
    </form>
  );
}
