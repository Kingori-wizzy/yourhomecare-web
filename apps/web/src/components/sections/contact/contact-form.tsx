"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ContactSchema, ContactFormData } from "@/lib/validations/contact";
import { useSubmit } from "@/lib/hooks/use-submit";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

const fieldClassName = "h-11 rounded-[8px] border-border";
const selectClassName =
  "flex h-11 w-full rounded-[8px] border border-border bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ContactFormSection() {
  const { loading, submit } = useSubmit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    try {
      const response = await submit("/api/contact", data);

      if (response.success) {
        toast.success("Message sent successfully.");
        reset();
      } else {
        toast.error("Unable to send your message.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Contact Us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
              Get In Touch
            </h2>
            <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
              We&rsquo;d love to hear from you. Complete the form below and a member of our care
              coordination team will contact you shortly.
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
                <label className="mb-2 block text-sm font-medium text-primary">Email Address</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className={fieldClassName}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
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
                <label className="mb-2 block text-sm font-medium text-primary">I Am A...</label>
                <select {...register("category")} className={selectClassName}>
                  <option value="">Select One</option>
                  <option>Patient</option>
                  <option>Family Member</option>
                  <option>Hospital</option>
                  <option>Medical Insurer</option>
                  <option>Healthcare Professional</option>
                  <option>Corporate Client</option>
                  <option>General Enquiry</option>
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-primary">Subject</label>
                <Input
                  placeholder="How can we help you?"
                  className={fieldClassName}
                  {...register("subject")}
                />
                {errors.subject && (
                  <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-primary">Message</label>
                <Textarea
                  rows={7}
                  placeholder="Tell us more about your enquiry..."
                  className="rounded-[8px] border-border"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-[1.6] text-muted-foreground">
                By submitting this form you agree to be contacted by YourHomeCare regarding your
                enquiry.
              </p>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-12 min-w-[220px] rounded-[8px] bg-primary px-6 text-base font-semibold text-white hover:bg-primary/90"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </Section>
  );
}
