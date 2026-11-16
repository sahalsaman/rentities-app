"use client";

import { signUp } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { countryCodes, defaultData } from "@/utils/data";
import { Button } from "@/components/ui/button";
import IndianFlag from "../../../../public/indian-flag.png";
import { AuthFrame } from "@/components/auth/AuthFrame";

export default function LoginPage() {

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [countryCode, setCountryCode] = useState(defaultData.countryCodes); // Default to India
  const router = useRouter();
  const [mobileNumberValidationMessage, setMobileNumberValidationMessage] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);


  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^[0-9]{10}$/; // Validates 10-digit phone number
    return phoneRegex.test(phoneNumber);
  };
  // In sendOtp:
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
    setButtonLoader(true);
    try {
      const res = await signUp(phone, countryCode, name, lastName, businessName)
      console.log("res..", res);
      toast.success("OTP sent successfully via Whatsapp!");
      router.push(`/auth/verify-otp?phone=${phone}&countryCode=${encodeURIComponent(countryCode)}`);
      setButtonLoader(false);
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("Login error:", err);
      }
      setButtonLoader(false);
    }
  };

  const field = "mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
  return <AuthFrame eyebrow="Create your workspace" title="Start managing smarter" description="Set up your business in a minute. We’ll verify your number with WhatsApp OTP."><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); sendOtp(); }}><div><label className="text-sm font-semibold text-slate-700">Business name</label><input required value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="e.g. Hilite Properties" className={field} /></div><div className="grid grid-cols-2 gap-4"><div><label className="text-sm font-semibold text-slate-700">First name</label><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="John" className={field} /></div><div><label className="text-sm font-semibold text-slate-700">Last name</label><input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Abraham" className={field} /></div></div><div><label className="text-sm font-semibold text-slate-700">WhatsApp number</label><div className="mt-1 flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"><span className="flex items-center gap-2 border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold"><Image src={IndianFlag} alt="India" width={20} height={14} />+91</span><input required type="tel" inputMode="numeric" value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, ''))} placeholder="Enter 10-digit number" maxLength={10} className="min-w-0 flex-1 px-4 py-3 outline-none" /></div>{mobileNumberValidationMessage && <p className="mt-2 text-sm text-red-600">{mobileNumberValidationMessage}</p>}</div><Button type="submit" variant="blue" loading={buttonLoader} className="h-[52px] w-full rounded-xl text-base font-semibold shadow-lg shadow-blue-200">Create account & continue</Button></form><p className="mt-6 text-center text-sm text-slate-600">Already have an account? <a href="/auth/login" className="font-semibold text-blue-700 hover:underline">Sign in</a></p></AuthFrame>;
}
