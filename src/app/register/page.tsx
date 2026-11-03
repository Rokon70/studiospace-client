"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function passwordError(p: string) {
  if (p.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(p)) return "Password must include an uppercase letter";
  if (!/[a-z]/.test(p)) return "Password must include a lowercase letter";
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photo: "", password: "" });
  const [pwError, setPwError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (k === "password") setPwError(passwordError(e.target.value));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pe = passwordError(form.password);
    if (pe) {
      setPwError(pe);
      toast.error(pe);
      return;
    }
    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.photo.trim() || undefined,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      return;
    }
    toast.success("Account created. Please log in.");
    router.push("/login");
  };

  const google = async () => {
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    if (error) toast.error(error.message || "Google sign-in failed. Please try again.");
  };

  return (
    <div className="page-wrap grid min-h-[75vh] place-items-center py-12">
      <div className="w-full max-w-md rounded-box border border-base-300 bg-base-100 p-6 md:p-8">
        <h1 className="section-title mb-2">Create your account</h1>
        <p className="mb-6 text-sm opacity-75">Book studios or host your own space.</p>
        <form onSubmit={submit} className="space-y-4">
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Name</span>
            <input required className="input w-full" value={form.name} onChange={set("name")} autoComplete="name" />
          </label>
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input type="email" required className="input w-full" value={form.email} onChange={set("email")} autoComplete="email" />
          </label>
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Photo URL</span>
            <input type="url" className="input w-full" placeholder="https://…" value={form.photo} onChange={set("photo")} />
          </label>
          <label className="form-control">
            <span className="mb-1 block text-sm font-medium">Password</span>
            <input type="password" required className={`input w-full ${pwError ? "input-error" : ""}`} value={form.password} onChange={set("password")} autoComplete="new-password" />
            {pwError && <span role="alert" className="mt-1 block text-sm text-error">{pwError}</span>}
          </label>
          <button className="btn btn-primary w-full" disabled={busy}>
            {busy && <span className="loading loading-spinner loading-sm" />} Register
          </button>
        </form>
        <div className="divider text-xs">or</div>
        <button onClick={google} className="btn w-full"><FcGoogle className="text-xl" /> Continue with Google</button>
        <p className="mt-6 text-center text-sm">
          Already have an account? <Link href="/login" className="link link-primary font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
}
