"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { cn } from "~/lib/utils";
import { contactFormSchema } from "./schema";
import { ContactForm } from "./contact-form";
import { ContactDialog } from "./contact-dialog";
import { ContactChannels } from "./contact-channels";
import { MailPreview } from "./mail-preview";
import { ScrambleText } from "~/components/home/scramble-text";

const EMPTY = { name: "", email: "", subject: "", message: "" };

type ContactSectionProps = {
  /** "page" is the /contact route (h1, mascot); "home" is the landing section (h2, no mascot) */
  variant?: "page" | "home";
  className?: string;
};

// Header, dialogue-box form, channels and live preview. Owns the form state.
// Used by /contact and by the home page after the timeline.
export function ContactSection({
  variant = "page",
  className,
}: ContactSectionProps) {
  const isPage = variant === "page";
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: EMPTY,
  });

  const watchedValues = form.watch();

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => ({ error: "An unknown error occurred" }))) as {
          error?: string;
        };
        throw new Error(errorData.error ?? "Failed to send message");
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    form.reset(EMPTY);
    setIsSubmitted(false);
    setSubmissionError(null);
  }

  const Heading = isPage ? "h1" : "h2";

  return (
    <section
      id={isPage ? undefined : "contact"}
      aria-labelledby="contact-title"
      className={cn(
        "mx-auto max-w-7xl scroll-mt-16 px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      <p className="text-muted-foreground font-mono text-sm">
        <span className="text-syntax-function">❯</span> mail hichem
      </p>
      <Heading
        id="contact-title"
        className="text-foreground text-title mt-3 font-semibold tracking-tight"
      >
        <ScrambleText text="Contact" />
      </Heading>
      <p className="text-syntax-comment mt-3 max-w-[65ch] text-sm md:text-base">
        {"// Work, collaborations, or a question about a project."}
      </p>

      <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-16">
        <ContactDialog
          showMascot={isPage}
          isSubmitted={isSubmitted}
          submissionError={submissionError}
          replyTo={watchedValues.email}
          onReset={handleReset}
          form={
            <ContactForm
              form={form}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              submissionError={submissionError}
            />
          }
        />

        {/* Lines up with the dialogue box (below the mascot when it is shown) */}
        <aside
          aria-label="Other ways to reach me"
          className={cn("space-y-10", isPage && "lg:pt-20")}
        >
          <ContactChannels />
          <div className="hidden md:block">
            <MailPreview values={watchedValues} />
          </div>
        </aside>
      </div>
    </section>
  );
}
