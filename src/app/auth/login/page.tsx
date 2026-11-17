"use client";

import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import IndianFlag from "../../../../public/indian-flag.png";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api";
import { defaultData } from "@/utils/data";

export default function LoginPage() {
  const [phone, setPhone] = useState(""); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false); const router = useRouter();
  async function sendOtp() { setMessage(""); if (!/^\d{10}$/.test(phone)) return setMessage("Enter a valid 10-digit WhatsApp number."); setLoading(true); try { await login(phone, defaultData.countryCodes); toast.success("Your verification code is on its way."); router.push(`/auth/verify-otp?phone=${phone}&countryCode=${encodeURIComponent(defaultData.countryCodes)}`); } catch (error: any) { toast.error(error?.response?.data?.message || "We couldn’t send a code. Please try again."); } finally { setLoading(false); } }
  return <AuthFrame eyebrow="Welcome back" title="Sign in to Rentities" description="Use your WhatsApp number. We’ll send a short verification code—no password to remember."><form className="space-y-6" onSubmit={(event) => { event.preventDefault(); sendOtp(); }}><div><label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">WhatsApp number</label><div className={`flex overflow-hidden rounded-2xl border bg-white transition ${message ? "border-rose-400 ring-4 ring-rose-50" : "border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50"}`}><span className="flex items-center gap-2 border-r border-slate-100 bg-slate-50 px-3.5 text-sm font-semibold text-slate-700"><Image src={IndianFlag} alt="India" width={20} height={14} /> +91</span><input id="phone" autoFocus type="tel" inputMode="numeric" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))} placeholder="Enter 10-digit number" maxLength={10} className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-slate-950 outline-none placeholder:text-slate-400" /></div>{message && <p className="mt-2 text-sm font-medium text-rose-600">{message}</p>}</div><Button type="submit" variant="blue" loading={loading} className="h-13 w-full rounded-2xl text-base font-semibold shadow-lg shadow-blue-200">Continue securely <ArrowRight size={18} /></Button><div className="flex items-center justify-center gap-2 text-sm text-slate-500"><MessageCircle size={16} className="text-emerald-600" /> We’ll send your code through WhatsApp</div></form><div className="my-7 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-100" /> New to Rentities? <span className="h-px flex-1 bg-slate-100" /></div><a href="/auth/signup" className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"><Phone size={16} /> Create your business account</a></AuthFrame>;
}
