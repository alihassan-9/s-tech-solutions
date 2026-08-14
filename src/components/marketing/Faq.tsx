"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const FAQS = [
  {
    question: "How do we get started?",
    answer:
      "Share your target market, required fields, approximate volume, and preferred output format. We'll scope a practical workflow around it.",
  },
  {
    question: "What formats do you deliver in?",
    answer:
      "Spreadsheets, CRM-ready imports, shared databases, whatever format your existing workflow already uses.",
  },
  {
    question: "Do you work with international teams?",
    answer:
      "Yes, startups, agencies, SMEs, and international teams across a wide range of industries and time zones.",
  },
  {
    question: "How is confidential data handled?",
    answer:
      "Respectfully, and access is always limited to what's needed for the specific assignment.",
  },
  {
    question: "Can you take on one-time projects, not just ongoing work?",
    answer:
      "Yes, one-time projects, ongoing operations, and custom research are all supported.",
  },
  {
    question: "How do you communicate during a project?",
    answer:
      "Clear updates, organized questions, and transparent handling of anything that can't be verified confidently.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-float">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={faq.question}
            className={i > 0 ? "border-t border-ink/[0.07]" : undefined}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              data-cursor="link"
              className="group flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left transition-colors duration-200 hover:bg-white/60 sm:px-6"
            >
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isOpen ? "text-brand" : "text-ink group-hover:text-brand"
                }`}
              >
                {faq.question}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  isOpen ? "bg-brand text-white" : "bg-brand-soft text-brand"
                }`}
              >
                <Plus
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  strokeWidth={2.5}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-6 text-ink-muted sm:px-6">
                    {faq.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
