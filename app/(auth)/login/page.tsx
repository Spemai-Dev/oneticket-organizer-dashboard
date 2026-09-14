"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("amila@confrontevents.com");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail("amila@confrontevents.com");
    setPassword("password123");
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Organizer Login
        </h2>
        <p className="text-xs text-zinc-500">
          Access your event dashboard, live gate scans & sales telemetry
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
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

        {/* Remember me checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            defaultChecked
            className="h-4 w-4 rounded border-zinc-300 text-[#00d07d] focus:ring-[#00d07d]"
          />
          <label htmlFor="remember" className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#043825] hover:bg-[#064d33] text-white font-bold h-11 rounded-xl shadow-lg shadow-[#043825]/20 flex items-center justify-center gap-2 transition-all mt-2"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Developer Demo Login Banner */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
        <p className="text-[11px] font-semibold text-zinc-400 text-center">
          Developer Mode Quick Access
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
        >
          <CheckCircle className="h-3.5 w-3.5 text-[#00d07d]" />
          <span>⚡ Demo Sign In as Amila (Confront Events)</span>
        </button>
      </div>
    </div>
  );
}
