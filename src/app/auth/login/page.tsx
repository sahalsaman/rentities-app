"use client";

import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { defaultData } from "@/utils/data";
import { app_config } from "../../../../app-config";
import { Button } from "@/components/ui/button";
import IndianFlag from "../../../../public/indian-flag.png";
import { ArrowRight, Building2, CheckCircle2, MessageCircleMore, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);
  const [countryCode, setCountryCode] = useState(defaultData.countryCodes); // Default to India
  const [mobileNumberValidationMessage, setMobileNumberValidationMessage] = useState("");
  const router = useRouter();
  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/; // Validates 10-digit phone number
    return phoneRegex.test(phoneNumber);
  };

  const sendOtp = async () => {
    setMobileNumberValidationMessage("");

    if (!phone) {
      setMobileNumberValidationMessage("Phone number is required.");
      return;
    }

    if (!countryCode) {
      setMobileNumberValidationMessage("Country code is required.");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setMobileNumberValidationMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    setButtonLoader(true)
    try {
      const res = await login(phone, countryCode);
      toast.success("OTP sent successfully via Whatsapp!");
      router.push(`/auth/verify-otp?phone=${phone}&countryCode=${encodeURIComponent(countryCode)}`);
      setButtonLoader(false)
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("Login error:", err);
      }
      setButtonLoader(false)
    }
  };

  return <main className="auth-theme min-h-screen bg-slate-50 p-0 lg:p-6">
    <div className="mx-auto min-h-screen max-w-7xl overflow-hidden bg-white lg:grid lg:min-h-[calc(100vh-3rem)] lg:grid-cols-2 lg:rounded-[2rem] lg:shadow-2xl lg:shadow-slate-200">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-sky-950 via-blue-800 to-sky-600 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-sky-300/15 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="relative flex items-center gap-3"><Image src={app_config.LOGO_WITH_NAME} alt="Rentities" height={42} /></div>
        <div className="relative my-auto max-w-md"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm"><Building2 size={16} /> Rental management, made simple</div><h1 className="text-5xl font-bold leading-tight">Everything your rental business needs, in one place.</h1><p className="mt-6 text-lg leading-8 text-sky-50/85">Stay on top of properties, tenants, bookings and payments without the paperwork.</p><div className="mt-10 space-y-4">{['Manage every property from one dashboard', 'Keep bookings and payments organised', 'Secure access with WhatsApp OTP'].map((item) => <div key={item} className="flex items-center gap-3 text-sm text-sky-50"><CheckCircle2 className="text-sky-300" size={20} />{item}</div>)}</div></div>
        <p className="relative text-sm text-sky-100/70">Built for modern property owners</p>
      </section>
      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:min-h-0 lg:px-16 lg:py-12">
        <div className="flex items-center justify-between lg:hidden"><a href="/" className="flex items-center gap-2"><Image src={app_config.LOGO_WITH_NAME} alt="Rentities" height={34}/></a><span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-blue-700">Secure login</span></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 lg:py-0"><div className="mb-9"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-blue-700"><MessageCircleMore size={24} /></div><p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Welcome back</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Sign in to Rentities</h2><p className="mt-3 leading-6 text-slate-500">Enter your WhatsApp number and we’ll send you a one-time code.</p></div>
          <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); sendOtp(); }}><div><label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">WhatsApp number</label><div className={`flex overflow-hidden rounded-xl border bg-white transition ${mobileNumberValidationMessage ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100'}`}><div className="flex items-center gap-2 border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700"><Image src={IndianFlag} alt="India" width={20} height={14} />+91</div><input id="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="Enter 10-digit number" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))} className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-slate-900 outline-none placeholder:text-slate-400" maxLength={10} /></div>{mobileNumberValidationMessage && <p className="mt-2 text-sm text-red-600">{mobileNumberValidationMessage}</p>}</div><Button type="submit" variant="blue" className="h-13 w-full rounded-xl text-base font-semibold shadow-lg shadow-blue-200 transition hover:-translate-y-0.5" loading={buttonLoader}>Continue with OTP <ArrowRight size={18} /></Button></form>
          <div className="my-7 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />No password required<span className="h-px flex-1 bg-slate-200" /></div><p className="text-center text-sm text-slate-600">New to Rentities? <a href="/auth/signup" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline">Create your account</a></p></div>
        <div className="mx-auto flex w-full max-w-md items-center justify-between border-t border-slate-100 pt-5 text-xs text-slate-500"><span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-blue-700" /> Your information is protected</span><span><a href="/privacy" target="_blank" className="hover:text-blue-700">Privacy</a> · <a href="/terms" target="_blank" className="hover:text-blue-700">Terms</a></span></div>
      </section>
    </div>
  </main>;
}
