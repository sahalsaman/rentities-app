"use client";

import { ArrowRight, Eye, EyeOff, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter(); const [username, setUsername] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false); const [showPassword, setShowPassword] = useState(false);
  async function signIn() { if (!username || !password) return toast.error("Enter your username and password."); setLoading(true); try { await axios.post("/api/auth/admin-login", { username, password }); toast.success("Welcome back."); router.push("/admin/dashboard"); } catch (error: any) { toast.error(error?.response?.data?.message || "Invalid username or password."); } finally { setLoading(false); } }
  const field = "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";
  return <AuthFrame admin eyebrow="Administrator access" title="Sign in to the control centre" description="Use your administrator credentials to manage Rentities securely."><form className="space-y-5" onSubmit={(event) => { event.preventDefault(); signIn(); }}><div><label htmlFor="username" className="text-sm font-semibold text-slate-700">Username or email</label><div className="relative"><UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input id="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your username" className={`${field} pl-11`} /></div></div><div><label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label><div className="relative"><input id="password" autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className={`${field} pr-12`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div><Button type="submit" variant="blue" loading={loading} className="h-13 w-full rounded-2xl text-base font-semibold shadow-lg shadow-blue-200">Sign in securely <ArrowRight size={18} /></Button></form><p className="mt-7 text-center text-sm text-slate-500">Not an administrator? <a href="/auth/login" className="font-semibold text-blue-700 hover:underline">Return to member sign in</a></p></AuthFrame>;
}
