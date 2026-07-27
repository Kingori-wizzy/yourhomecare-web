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
    <Section className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="font-semibold uppercase tracking-[0.2em] text-primary">
              Contact Us
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              Get In Touch
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
              We&rsquo;d love to hear from you. Complete the form below and a
              member of our care coordination team will contact you shortly.
            </p>

          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-16 rounded-3xl border bg-white p-8 shadow-sm lg:p-10"
          >

            <div className="grid gap-6 md:grid-cols-2">

              <div>

                <label className="mb-2 block font-medium">
                  Full Name
                </label>

                <Input
                  placeholder="John Doe"
                  {...register("fullName")}
                />

                {errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Email Address
                </label>

                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                />

                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Phone Number
                </label>

                <Input
                  placeholder="+254..."
                  {...register("phone")}
                />

                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  I Am A...
                </label>

                <select
                  {...register("category")}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
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
                  <p className="mt-2 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}

              </div>
                            <div className="md:col-span-2">

                <label className="mb-2 block font-medium">
                  Subject
                </label>

                <Input
                  placeholder="How can we help you?"
                  {...register("subject")}
                />

                {errors.subject && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.subject.message}
                  </p>
                )}

              </div>

              <div className="md:col-span-2">

                <label className="mb-2 block font-medium">
                  Message
                </label>

                <Textarea
                  rows={7}
                  placeholder="Tell us more about your enquiry..."
                  {...register("message")}
                />

                {errors.message && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}

              </div>

            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-slate-500">
                By submitting this form you agree to be contacted by
                YourHomeCare regarding your enquiry.
              </p>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="min-w-[220px]"
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