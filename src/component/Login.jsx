"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Form,
  TextField,
  Label,
  InputGroup
} from "@heroui/react";
import { Eye, EyeClosed, Envelope, LockFill } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirectTo = (rawRedirect && rawRedirect !== "null") ? rawRedirect : '/';

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data: res, error } = await authClient.signIn.email({
        email: email,
        password: password,
        callbackURL: redirectTo,
      });
      
      if (error) {
        setErrorMessage(error.message || "Invalid email or password configuration.");
      } else {
        setEmail("");
        setPassword("");
        router.push(redirectTo);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: redirectTo
      });
    } catch (err) {
      setErrorMessage("Google authentication communication failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg shadow-amber-500/20">
              <span className="text-white text-xl font-bold">LE</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign in to access your platform portal
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 mb-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <TextField isRequired className="w-full">
              <Label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">
                Email Address
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <Envelope className="text-slate-400 dark:text-slate-500 w-5 h-5 mx-2" />
                </InputGroup.Prefix>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </TextField>

            <TextField isRequired className="w-full">
              <div className="flex justify-between items-center mb-1">
                <Label className="text-sm font-medium block text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                <a href="/auth/forgot-password" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <InputGroup>
                <InputGroup.Prefix>
                  <LockFill className="text-slate-400 dark:text-slate-500 w-5 h-5 mx-2" />
                </InputGroup.Prefix>
                <Input
                  type={isVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroup.Suffix>
                  <button
                    className="focus:outline-none mx-2 flex items-center justify-center"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeClosed className="text-slate-400 dark:text-slate-500 w-5 h-5" />
                    ) : (
                      <Eye className="text-slate-400 dark:text-slate-500 w-5 h-5" />
                    )}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>

            <Button
              type="submit"
              className="w-full mt-2 font-bold rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-500/20"
              isPending={isLoading}
            >
              Sign In
            </Button>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
              or
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 font-semibold border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/google.svg" alt="Google" width="18" height="18" className="shrink-0" />
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            New to the platform?{" "}
            <a href={`/signup?redirect=${redirectTo}`} className="text-amber-600 dark:text-amber-400 hover:underline font-semibold">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
