"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  School,
  UserPlus,
} from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import Button from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/InputField/Input";

type SignupStage = "student" | "graduate" | "industry";
type SignupStep = "stage" | "profile" | "success";

const stageCards: Array<{
  id: SignupStage;
  title: string;
  description: string;
  icon: typeof GraduationCap;
}> = [
  {
    id: "student",
    title: "Student",
    description: "Currently Enrolled In A University",
    icon: School,
  },
  {
    id: "graduate",
    title: "Graduate",
    description: "Completed Your Degree",
    icon: GraduationCap,
  },
  {
    id: "industry",
    title: "Industry Professional",
    description: "Working In Your Field",
    icon: Building2,
  },
];

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>("stage");
  const [selectedStage, setSelectedStage] = useState<SignupStage>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const signupPayload = useMemo(
    () => ({
      stage: selectedStage,
      fullName,
      email,
      password,
      confirmPassword,
    }),
    [confirmPassword, email, fullName, password, selectedStage],
  );

  const handleCreateAccount = () => {
    if (!fullName.trim()) {
      setFormError("Your Full Name Is Required");
      return;
    }

    if (!email.trim()) {
      setFormError("Your Email Is Required");
      return;
    }

    if (!password.trim()) {
      setFormError("Your Password Is Required");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords Do Not Match");
      return;
    }

    setFormError("");
    setCurrentStep("success");
  };

  return (
    <AuthShell>
      {currentStep === "stage" && (
        <section className="w-full max-w-216 animate-[fadeInUp_500ms_ease-out]">
          <div className="rounded-4xl border border-primary-300/35 bg-[rgba(11,34,54,0.68)] px-6 py-8 shadow-[0_0_0_1px_rgba(90,167,214,0.16),0_0_75px_rgba(11,34,54,0.32)] backdrop-blur-2xl sm:px-8 lg:px-12 lg:py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-300/80 bg-primary-400/10 text-primary-300 shadow-[0_0_24px_rgba(58,144,201,0.24)]">
              <UserPlus className="h-8 w-8" />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-h2-sm font-semibold text-neutral-50 sm:text-h2">
                Let&apos;s Get Started
              </h1>
              <p className="mt-2 text-subtext text-neutral-200">
                Select your current stage
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-5">
              {stageCards.map((card) => {
                const Icon = card.icon;
                const isSelected = selectedStage === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedStage(card.id)}
                    className={`flex min-h-34 flex-col items-center justify-center rounded-3xl border px-5 py-6 text-center transition-all duration-300 ${
                      isSelected
                        ? "border-primary-200 bg-primary-500/20 shadow-[0_0_20px_rgba(112,181,223,0.18)]"
                        : "border-transparent bg-[#1b4660]/75 hover:border-primary-300/40 hover:bg-[#214d68]/80"
                    }`}
                  >
                    <Icon className="h-12 w-12 text-primary-100" />
                    <h2 className="mt-3 text-xl font-medium text-neutral-50">
                      {card.title}
                    </h2>
                    <p className="mt-1 max-w-48 text-sm leading-5 text-neutral-200">
                      {card.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-end">
              <Button
                className="h-11 min-w-23 rounded-[0.7rem] bg-[#2f86c0] px-4 text-base font-semibold text-neutral-50 hover:bg-[#3b92cd]"
                intent="primary"
                onClick={() => setCurrentStep("profile")}
                type="button"
                variant="solid"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Next
              </Button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-neutral-200">
            Already Have Account?{" "}
            <a
              href="/login"
              className="text-accent-200 transition-colors hover:text-accent-100"
            >
              Login Now
            </a>
          </p>
        </section>
      )}

      {currentStep === "profile" && (
        <section className="w-full max-w-md animate-[fadeInUp_500ms_ease-out]">
          <div className="rounded-4xl border border-primary-300/35 bg-[rgba(11,34,54,0.68)] px-6 py-8 shadow-[0_0_0_1px_rgba(90,167,214,0.16),0_0_75px_rgba(11,34,54,0.32)] backdrop-blur-2xl sm:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-300/80 bg-primary-400/10 text-primary-300 shadow-[0_0_24px_rgba(58,144,201,0.24)]">
              <UserPlus className="h-8 w-8" />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-h2-sm font-semibold text-neutral-50 sm:text-h2">
                Let&apos;s Build Your Profile
              </h1>
              <p className="mt-2 text-subtext text-neutral-200">
                Just the essentials to get you started
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="enter your full name"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                error={formError}
              />

              <Input
                label="Email"
                name="email"
                placeholder="enter your email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <Input
                label="Password"
                name="password"
                placeholder="Set a secure password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <p
              className={`mt-4 text-center text-sm ${
                formError ? "text-danger-300" : "text-transparent"
              }`}
              aria-live="polite"
            >
              {formError || "placeholder"}
            </p>

            <div className="mt-5 flex gap-3">
              <Button
                className="h-11 min-w-19 rounded-[0.7rem] border border-primary-300/80 bg-transparent px-4 text-base font-medium text-primary-100 hover:bg-primary-400/10"
                intent="primary"
                onClick={() => setCurrentStep("stage")}
                type="button"
                variant="outlined"
              >
                Back
              </Button>
              <Button
                className="h-11 flex-1 rounded-[0.7rem] bg-[#20a6a1] px-4 text-base font-semibold text-neutral-50 hover:bg-[#28b4af]"
                intent="primary"
                onClick={handleCreateAccount}
                type="button"
                variant="solid"
              >
                Create My Account
              </Button>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-neutral-200">
            Already Have Account?{" "}
            <a
              href="/login"
              className="text-accent-200 transition-colors hover:text-accent-100"
            >
              Login Now
            </a>
          </p>
        </section>
      )}

      {currentStep === "success" && (
        <section className="w-full max-w-88 animate-[fadeInUp_500ms_ease-out]">
          <div className="rounded-4xl border border-primary-300/35 bg-[rgba(11,34,54,0.68)] px-6 py-10 text-center shadow-[0_0_0_1px_rgba(90,167,214,0.16),0_0_75px_rgba(11,34,54,0.32)] backdrop-blur-2xl sm:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-400/80 bg-accent-400/10 text-accent-200 shadow-[0_0_24px_rgba(55,181,170,0.18)]">
              <UserPlus className="h-8 w-8" />
            </div>

            <h1 className="mt-8 text-h2-sm font-semibold text-primary-100 sm:text-h2">
              Your Profile Is Ready !
            </h1>
            <p className="mt-2 text-subtext text-neutral-200">
              Dive In And Discover More
            </p>
          </div>

          <p className="mt-4 text-center text-sm text-neutral-200">
            Already Have Account?{" "}
            <a
              href="/login"
              className="text-accent-200 transition-colors hover:text-accent-100"
            >
              Login Now
            </a>
          </p>
        </section>
      )}
    </AuthShell>
  );
}
