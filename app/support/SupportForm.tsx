"use client";
import { useActionState, useEffect } from "react";
import { submitTicket, type SubmitTicketState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, AlertCircle } from "lucide-react";

const ISSUE_TYPES = [
  { value: "access", label: "Cannot access a paper" },
  { value: "account", label: "Account / login problem" },
  { value: "content", label: "Wrong or missing content" },
  { value: "other", label: "Other" },
];

const initialState: SubmitTicketState = { success: false };

interface Props {
  defaultName?: string;
  defaultEmail?: string;
}

export function SupportForm({ defaultName = "", defaultEmail = "" }: Props) {
  const [state, formAction, pending] = useActionState(
    submitTicket,
    initialState,
  );

  // Scroll to top on success so the success message is visible
  useEffect(() => {
    if (state.success) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state.success]);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-green-200 bg-green-50 px-6 py-10 text-center">
        <CheckCircle2 className="size-10 text-green-600" />
        <div>
          <p className="font-semibold text-green-800 text-lg">
            Ticket submitted!
          </p>
          <p className="mt-1 text-sm text-green-700">
            We&apos;ll get back to you at the email you provided. Usually within
            24 hours.
          </p>
        </div>
        <a
          href="mailto:nehatanti59@gmail.com"
          className="text-xs text-green-600 underline underline-offset-2"
        >
          Or email us directly: nehatanti59@gmail.com
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Rahul Sharma"
            defaultValue={defaultName}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            defaultValue={defaultEmail}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="issue_type">What is the issue about?</Label>
        <Select name="issue_type" required>
          <SelectTrigger id="issue_type">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {ISSUE_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Describe your issue</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Tell us what happened and what you expected to happen…"
          rows={5}
          required
          minLength={20}
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Submitting…" : "Submit ticket"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        You can also email us directly at{" "}
        <a
          href="mailto:nehatanti59@gmail.com"
          className="underline underline-offset-2 hover:text-foreground"
        >
          nehatanti59@gmail.com
        </a>
      </p>
    </form>
  );
}
