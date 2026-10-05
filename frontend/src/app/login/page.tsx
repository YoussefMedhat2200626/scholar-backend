"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CircleUserRound, Mail, Lock } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import Button from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/InputField/Input";

const adminEmail = "admin@gmail.com";
const adminPassword = "admin123";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isAdminCredentials = useMemo(
    () =>
      email.trim().toLowerCase() === adminEmail && password === adminPassword,
    [email, password],
  );

  const handleLogin = () => {
    if (isAdminCredentials) {
      setErrorMessage("");
      setShowSuccess(true);
      return;
    }

    setShowSuccess(false);
    setErrorMessage(
      "Use admin@gmail.com and admin123 to preview the success state.",
    );
  };

  return (
    <AuthShell>
      <section className="w-full max-w-md animate-[fadeInUp_500ms_ease-out]">
        <div className="rounded-4xl border border-primary-300/40 bg-[rgba(11,34,54,0.72)] px-6 py-8 shadow-[0_0_0_1px_rgba(90,167,214,0.18),0_0_75px_rgba(11,34,54,0.35)] backdrop-blur-2xl sm:px-8">
          {!showSuccess ? (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-400/90 bg-accent-400/10 text-accent-300 shadow-[0_0_24px_rgba(55,181,170,0.22)]">
                <CircleUserRound className="h-8 w-8" />
              </div>

              <div className="mt-4 text-center">
                <h1 className="text-h2-sm font-semibold text-neutral-50 sm:text-h2">
                  Welcome Back
                </h1>
                <p className="mt-2 text-subtext text-neutral-200">
                  continue your journey in research and innovation
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Input
                  label="Email"
                  name="email"
                  placeholder="enter your email"
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <Input
                  label="Password"
                  name="password"
                  placeholder="enter your password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className="text-sm text-neutral-200 transition-colors hover:text-accent-200"
                >
                  Forgot Password ?
                </button>
              </div>

              {errorMessage ? (
                <p className="mt-4 text-center text-sm text-danger-300">
                  {errorMessage}
                </p>
              ) : null}

              <div className="mt-5">
                <Button
                  className="h-11 w-full rounded-[0.7rem] bg-[#2f86c0] px-4 text-base font-semibold text-neutral-50 hover:bg-[#3b92cd]"
                  intent="primary"
                  onClick={handleLogin}
                  type="button"
                  variant="solid"
                >
                  Login
                </Button>
              </div>

              <div className="my-5 flex items-center gap-3 text-neutral-300">
                <span className="h-px flex-1 bg-neutral-500/60" />
                <span className="text-sm tracking-wide">Or Continue With</span>
                <span className="h-px flex-1 bg-neutral-500/60" />
              </div>

              <button
                type="button"
                className="flex h-11 w-full items-center justify-center rounded-[0.7rem] bg-[#20a6a1] text-base font-semibold text-neutral-50 transition-colors hover:bg-[#28b4af]"
              >
                Google
              </button>

              <p className="mt-5 text-center text-sm text-neutral-200">
                New Here?{" "}
                <Link
                  href="/signup"
                  className="text-accent-200 transition-colors hover:text-accent-100"
                >
                  Create Account
                </Link>
              </p>
            </>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-400/80 bg-accent-400/10 text-accent-200 shadow-[0_0_24px_rgba(55,181,170,0.18)]">
                <CircleUserRound className="h-8 w-8" />
              </div>
              <h1 className="mt-6 text-h2-sm font-semibold text-primary-100 sm:text-h2">
                You&apos;re Back In!
              </h1>
              <p className="mt-2 text-subtext text-neutral-200">
                Good To See You Again
              </p>
            </div>
          )}
        </div>
      </section>
    </AuthShell>
  );
}
