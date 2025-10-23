"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Input, Textarea } from "@heroui/react";

export default function ContactPageContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name || !email || !message) {
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }
    const emailPattern = /^([^\s@]+)@([^\s@]+)\.([^\s@]+)$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message. Please try again later.");
      }
      setSuccessMessage("Thanks! Your message has been sent.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setErrorMessage(err?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pt-48">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-theme-text">
            Contact us
          </h1>
          <p className="text-theme-text-secondary mt-3">
            Have a question or feedback? Fill out the form and we'll get back to you.
          </p>
        </div>

        <Card>
          <CardHeader className="bg-theme-primary/10">
            <h2 className="text-xl font-semibold text-theme-text">Send a message</h2>
          </CardHeader>
          <CardBody className="pt-6">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired
              />
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
              />
              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
              />
              <Textarea
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                minRows={6}
                isRequired
              />

              {successMessage && (
                <div className="text-green-500 text-sm" role="status" aria-live="polite">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="text-red-500 text-sm" role="alert" aria-live="assertive">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end">
                <Button color="primary" type="submit" isLoading={isSubmitting}>
                  Send message
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}


