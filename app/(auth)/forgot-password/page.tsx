"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Reset Password
        </h2>
        <p className="text-xs text-zinc-500">
          Enter your registered email address and we will send a password reset link.
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-4 text-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-900 dark:text-emerald-300">
          <CheckCircle className="h-10 w-10 text-[#00d07d]" />
          <div>
            <h4 className="font-bold text-sm">Reset link sent!</h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
              We have dispatched a reset link to <span className="font-semibold">{email}</span>.
            </p>
          </div>
          <Link href="/login" className="w-full">
            <Button className="w-full bg-[#043825] hover:bg-[#064d33] text-white font-bold h-10 rounded-xl text-xs">
              Return to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@confrontevents.com"
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#043825] hover:bg-[#064d33] text-white font-bold h-11 rounded-xl shadow-lg shadow-[#043825]/20 text-xs transition-all mt-2"
          >
            Send Reset Instructions
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mt-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </form>
      )}
    </div>
  );
}
