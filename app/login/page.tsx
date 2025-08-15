"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [recaptchaError, setRecaptchaError] = useState("");
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setRecaptchaError("");

    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email wajib diisi");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Password wajib diisi");
      hasError = true;
    }

    const token = recaptchaRef.current?.getValue();
    if (!token) {
      setRecaptchaError("Silakan verifikasi reCAPTCHA");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, token }),
      });

      const data = await res
        .json()
        .catch(() => ({ error: "Terjadi kesalahan" }));

      if (res.ok) {
        router.push("/dashboard");
      } else {
        // Tampilkan error dari backend
        if (data.error?.toLowerCase().includes("email")) {
          setEmailError(data.error);
        } else if (data.error?.toLowerCase().includes("password")) {
          setPasswordError(data.error);
        } else {
          setRecaptchaError(data.error);
        }
        recaptchaRef.current?.reset();
      }
    } catch (err) {
      console.error(err);
      setRecaptchaError("Terjadi kesalahan server");
      recaptchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm p-8 rounded-xl shadow-lg bg-white dark:bg-gray-800"
      >
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 rounded-lg border ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          {/* Password input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-3 rounded-lg border ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
          </div>

          {/* reCAPTCHA */}
          <div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            />
            {recaptchaError && (
              <p className="mt-1 text-sm text-red-500">{recaptchaError}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
