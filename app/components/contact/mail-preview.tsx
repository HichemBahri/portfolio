import type { z } from "zod";
import { contacts } from "~/_data/contact-data";
import type { contactFormSchema } from "./schema";

type ContactValues = z.infer<typeof contactFormSchema>;

const TO = contacts.find((c) => c.href.startsWith("mailto:"))?.label ?? "me";

function Value({ value, empty }: { value: string; empty: string }) {
  return value.trim() ? (
    <span className="text-slate-100">{value}</span>
  ) : (
    <span className="text-slate-600">{empty}</span>
  );
}

// The message as it will arrive, rebuilt on every keystroke and drawn as a
// `mail` session in the same scanline panel as the home page cards.
export function MailPreview({ values }: { values: ContactValues }) {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <figure className="font-mono">
      <figcaption className="text-xs text-slate-500">
        {"// preview, updates as you type"}
      </figcaption>
      <div className="relative mt-2 overflow-hidden rounded-sm border-2 border-cyan-400/20 bg-[#101822] p-4 text-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_3px)]"
        />
        <div className="relative space-y-1 break-words">
          <p className="text-slate-400">
            <span className="text-syntax-function">❯</span> mail {TO}
          </p>
          <p>
            <span className="text-syntax-keyword">From:</span>{" "}
            <Value value={values.name} empty="<name>" />{" "}
            <span className="text-slate-500">&lt;</span>
            <Value value={values.email} empty="email" />
            <span className="text-slate-500">&gt;</span>
          </p>
          <p>
            <span className="text-syntax-keyword">Subject:</span>{" "}
            <Value value={values.subject} empty="<subject>" />
          </p>
          <p>
            <span className="text-syntax-keyword">Date:</span>{" "}
            <span className="text-slate-300">{date}</span>
          </p>
          <p className="max-h-56 overflow-y-auto pt-3 whitespace-pre-wrap">
            <Value value={values.message} empty="<message>" />
          </p>
        </div>
      </div>
    </figure>
  );
}
