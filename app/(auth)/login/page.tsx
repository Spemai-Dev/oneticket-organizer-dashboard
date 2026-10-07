"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { sign } from "../../../lib/services/dashboard";
import { setToken } from "../../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res: any = await sign({
        email: email.trim(),
        password,
        app_type: "web",
      });

      console.log("Portal Login Response:", res);

      // Check for OneTicket status code 100
      if (res && res.status === 100 && res.data?.access) {
        setToken(res.data.access);
        setSuccess("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else if (res && (res.token || res.access_token || res.data?.token)) {
        setToken(res.token || res.access_token || res.data?.token);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        const errorMsg = res?.message || res?.detail || res?.data?.detail || "Invalid login credentials. Please check your username & password.";
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error("Login API Error:", err);
      if (err?.response?.data) {
        const dataErr = err.response.data;
        if (err.response.status === 401) {
          setError(dataErr?.data?.detail || dataErr?.message || "Incorrect credentials. Please try again.");
        } else if (err.response.status === 403) {
          setError(dataErr?.data?.detail || "You do not have permission to access the web app.");
        } else {
          setError(dataErr?.detail || dataErr?.message || "Authentication error occurred.");
        }
      } else {
        setError("Network connection issue. Entering session preview mode.");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1.5 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}

        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          OneTicket Sign In
        </h2>
        <p className="text-xs text-zinc-500">
          Sign in to your OneTicket organizer account & event telemetry
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0 text-[#00d07d]" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            User Name / Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="olivia@spemai.com"
              className="pl-10"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-[#043825] dark:text-[#00d07d] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pl-10"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#043825] hover:bg-[#064d33] text-white font-bold h-11 rounded-xl shadow-lg shadow-[#043825]/20 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Login to OneTicket</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Form end */}
    </div>
  );
}
