"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@intranet.local");
  const [password, setPassword] = useState("admin1234");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        className="w-full max-w-sm space-y-3 rounded-xl bg-white p-6 shadow"
        onSubmit={async (e) => {
          e.preventDefault();
          await signIn("credentials", { email, password, callbackUrl: "/admin" });
        }}
      >
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <input className="w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded bg-brand px-3 py-2 text-white" type="submit">Sign in</button>
      </form>
    </div>
  );
}
