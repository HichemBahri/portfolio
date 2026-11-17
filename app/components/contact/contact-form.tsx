"use client";
import type { KeyboardEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { cn } from "~/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { contactFormSchema } from "./schema";

type ContactValues = z.infer<typeof contactFormSchema>;

type ContactFormProps = {
  form: UseFormReturn<ContactValues>;
  onSubmit: (values: ContactValues) => void;
  isSubmitting: boolean;
  submissionError: string | null;
};

const MESSAGE_MAX = 500;

// Fields sit inside the dialogue box, so they are inset (page background, faint
// cyan edge) and only pick up the box's hard shadow while focused.
const FIELD =
  "rounded-sm border-2 border-cyan-400/20 bg-[#0f172b] px-3 font-mono text-sm text-slate-100 shadow-none transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400 focus-visible:border-cyan-400/70 focus-visible:shadow-[3px_3px_0_0_rgba(33,219,219,0.22)] focus-visible:ring-0 aria-invalid:border-red-400/60 aria-invalid:ring-0 aria-invalid:focus-visible:shadow-[3px_3px_0_0_rgba(248,113,113,0.22)] dark:aria-invalid:ring-0 md:text-sm";

const LABEL = "font-mono text-sm font-normal text-slate-300";
const ERROR = "font-mono text-xs text-red-400";

export function ContactForm({
  form,
  onSubmit,
  isSubmitting,
  submissionError,
}: ContactFormProps) {
  const messageLength = form.watch("message").length;
  const submit = form.handleSubmit(onSubmit);

  // Ctrl/Cmd + Enter sends from the message box
  const onMessageKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !isSubmitting) {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={submit} noValidate className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={LABEL}>name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="name"
                  {...field}
                  className={cn(FIELD, "h-11")}
                />
              </FormControl>
              <FormMessage className={ERROR} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={LABEL}>email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...field}
                  className={cn(FIELD, "h-11")}
                />
              </FormControl>
              <FormMessage className={ERROR} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className={LABEL}>subject</FormLabel>
              <FormControl>
                <Input {...field} className={cn(FIELD, "h-11")} />
              </FormControl>
              <FormMessage className={ERROR} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className={LABEL}>message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  onKeyDown={onMessageKeyDown}
                  className={cn(FIELD, "min-h-40 resize-none py-2.5")}
                />
              </FormControl>
              <div className="flex items-start justify-between gap-4">
                <FormMessage className={ERROR} />
                <p
                  className={cn(
                    "ml-auto font-mono text-xs tabular-nums",
                    messageLength > MESSAGE_MAX
                      ? "text-red-400"
                      : "text-slate-500",
                  )}
                >
                  {messageLength}/{MESSAGE_MAX}
                </p>
              </div>
            </FormItem>
          )}
        />

        {submissionError && (
          <p
            role="alert"
            className="font-mono text-sm text-red-400 sm:col-span-2"
          >
            {`// not sent: ${submissionError}. Try again, or use the email address listed on this page.`}
          </p>
        )}

        <div className="flex items-center justify-between gap-4 sm:col-span-2">
          <p className="hidden font-mono text-xs text-slate-500 sm:block">
            {"// ctrl + enter sends"}
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto flex items-baseline gap-1 rounded-sm border-2 border-cyan-400/50 bg-[#101822] px-4 py-2.5 font-mono text-sm text-cyan-300 shadow-[4px_4px_0_0_rgba(33,219,219,0.22)] transition-[transform,box-shadow,border-color] duration-150 hover:border-cyan-400/80 focus-visible:border-cyan-400 focus-visible:outline-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(33,219,219,0.22)] disabled:cursor-wait disabled:opacity-70"
          >
            <span aria-hidden className="text-cyan-400">
              ❯ [
            </span>
            <span className="px-0.5">
              {isSubmitting ? (
                <>
                  sending
                  <span
                    aria-hidden
                    className="ml-1 inline-block h-[0.9em] w-[0.45em] translate-y-[0.1em] bg-cyan-400/80 motion-safe:animate-[blink_1.2s_step-end_infinite]"
                  />
                </>
              ) : (
                "send message"
              )}
            </span>
            <span aria-hidden className="text-cyan-400">
              ]
            </span>
          </button>
        </div>
      </form>
    </Form>
  );
}
