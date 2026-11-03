"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const getRedirect = () => {
  const r = new URLSearchParams(window.location.search).get("redirect");
  return r && r.startsWith("/") ? r : "/";
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) {
      const msg = "Incorrect email or password. Please try again.";
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success("Welcome back to StudioSpace");
    router.push(getRedirect());
  };

  const google = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: getRedirect() });
    if (error) toast.error(error.message || "Google sign-in failed. Please try again.");
  };

  return (
    <div className="page-wrap grid min-h-[75vh] place-items-center py-12">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-6 md:p-8">
        <h1 className="section-title mb-2">Log in to StudioSpace</h1>
        <p className="mb-6 text-sm opacity-75">Pick up where you left off.</p>
        <form onSubmit={submit} className="space-y-4">
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input type="email" required className="input w-full" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Password</span>
            <input type="password" required className="input w-full" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          <button type="button" className="link link-primary text-sm" onClick={() => toast.info("Password reset is not available yet. Please contact support.")}>
            Forgot password?
          </button>
          {error && <p role="alert" className="rounded-field bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />} Login
          </button>
        </form>
        <div className="divider text-xs">or</div>
        <button onClick={google} className="btn w-full"><FcGoogle className="text-xl" /> Continue with Google</button>
        <p className="mt-6 text-center text-sm">
          New to StudioSpace? <Link href="/register" className="link link-primary font-medium">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
