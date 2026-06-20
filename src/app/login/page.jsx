"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  CardHeader,
  Form,
  TextField,
  Label,
  InputGroup
} from "@heroui/react";
import { Eye, EyeClosed, Envelope, LockFill } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  // Input tracking states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  
  // URL Redirection parameters
  const rawRedirect = searchParams.get("redirect");
  const redirectTo = (rawRedirect && rawRedirect !== "null") ? rawRedirect : '/';

  // UX Interaction states
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  // 1. Credentials Login Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data: res, error } = await authClient.signIn.email({
        email: email,
        password: password,
        callbackURL: redirectTo, // BetterAuth securely returns JWT session here
      });
      
      if (error) {
        setErrorMessage(error.message || "Invalid email or password configuration.");
      } else {
        // Clear forms out upon confirmation
        setEmail("");
        setPassword("");
        
        // Push user to destination (Home, /dashboard, etc.)
        router.push(redirectTo);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Google OAuth Provider Handler
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
    <div className="flex justify-center items-center min-h-screen bg-content2 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg flex flex-col gap-4">
        <CardHeader className="flex flex-col gap-1 items-center justify-center pt-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-small text-default-500">Sign in to access your platform portal</p>
        </CardHeader>

        {/* Error Notification Alert banner */}
        {errorMessage && (
          <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* Credentials Form entry */}
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

          {/* Email */}
          <TextField isRequired className="w-full">
            <Label className="text-sm font-medium mb-1 block">Email Address</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Envelope className="text-default-400 w-5 h-5 mx-2" />
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

          {/* Password */}
          <TextField isRequired className="w-full">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-sm font-medium block">Password</Label>
              <a href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <InputGroup>
              <InputGroup.Prefix>
                <LockFill className="text-default-400 w-5 h-5 mx-2" />
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
                    <EyeClosed className="text-default-400 w-5 h-5" />
                  ) : (
                    <Eye className="text-default-400 w-5 h-5" />
                  )}
                </button>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>

          {/* Submit Credentials Action */}
          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2 font-bold"
            isPending={isLoading}
          >
            Sign In
          </Button>
        </Form>

        {/* Separator UI Breakdown rule */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-divider" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-content1 px-2 text-default-400">Or connect via</span>
          </div>
        </div>

        {/* Dependency-Free Google Login Interface */}
        <Button
          type="button"
          variant="secondary"
          onPress={handleGoogleLogin}
          startContent={
            <span className="font-black text-base tracking-tight font-sans px-0.5">G</span>
          }
          className="w-full font-bold border border-divider"
        >
          Continue with Google
        </Button>

        {/* Onboarding routing fallback linkage */}
        <p className="text-center text-small text-default-500 mt-2">
          New to the platform?{" "}
          <a href={`/signup?redirect=${redirectTo}`} className="text-primary hover:underline font-medium">
            Create an account
          </a>
        </p>
      </Card>
    </div>
  );
}