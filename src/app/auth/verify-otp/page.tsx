"use client";

import api, { login } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { UserRoles } from "@/utils/contants";
import { Button } from "@/components/ui/button";
import { AuthFrame } from "@/components/auth/AuthFrame";

export default function VerifyOTPPage() {
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [otp, setOtp] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("phone") || "";
      const c = new URLSearchParams(window.location.search).get("countryCode") || "";
      setPhone(p);
      setCountryCode(c);
    }
  }, []);


  const resendOtp = async () => {
    if (!phone || !countryCode) {
      toast.error("Phone or country code missing from URL");
      return;
    }

    setButtonLoader(true);
    try {
      await login(phone, countryCode);
      toast.success("OTP sent successfully via Whatsapp!");
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

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    setButtonLoader(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, countryCode, otp });
      const role = res.data.role;

      if (role === UserRoles.OWNER || role === UserRoles.MANAGER) location.href = "/owner/dashboard";
      else location.href = "/user/dashboard";

      toast.success("Logged in successfully!");
      setButtonLoader(false);
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error("An error occurred. Please try again.");
        console.error("OTP verify error:", err);
      }
      setButtonLoader(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  return <AuthFrame eyebrow="One more step" title="Verify your number" description={countryCode && phone ? `We sent a 6-digit code to WhatsApp at ${countryCode} ${phone}.` : "We sent a 6-digit code to your WhatsApp number."}><form onSubmit={(event) => { event.preventDefault(); verifyOtp(); }} className="space-y-6"><div className=" p-5"><p className="mb-4 text-center text-sm font-medium text-blue-800">Enter your verification code</p><InputOTP maxLength={6} value={otp} onChange={handleOtpChange} className="w-full"><InputOTPGroup className="flex w-full justify-center gap-1.5"><InputOTPSlot index={0} className="rounded-lg border-slate-300" /><InputOTPSlot index={1} className="rounded-lg border-slate-300" /><InputOTPSlot index={2} className="rounded-lg border-slate-300" /><InputOTPSlot index={3} className="rounded-lg border-slate-300" /><InputOTPSlot index={4} className="rounded-lg border-slate-300" /><InputOTPSlot index={5} className="rounded-lg border-slate-300" /></InputOTPGroup></InputOTP></div><Button type="submit" variant="blue" className="h-[52px] w-full rounded-xl text-base font-semibold shadow-lg shadow-blue-200" loading={buttonLoader}>Verify and sign in</Button></form><p className="mt-6 text-center text-sm text-slate-600">Didn’t receive the code? <button type="button" onClick={resendOtp} className="font-semibold text-blue-700 hover:underline">Resend OTP</button></p><a href="/auth/login" className="mt-4 block text-center text-sm text-slate-500 hover:text-blue-700">Use a different number</a></AuthFrame>;
}
