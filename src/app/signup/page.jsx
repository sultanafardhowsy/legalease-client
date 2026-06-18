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
  InputGroup,
  Radio,
  RadioGroup
} from "@heroui/react";
import { Eye, EyeClosed, Envelope, LockFill, Person, CircleCheck } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignUpPage() {
  // Form input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("client"); // 🏛️ Updated default from seeker to client
  const router = useRouter();

  const searchParams = useSearchParams();
  
  // Clean parameter: If it's missing, empty, or the literal string "null", fall back to '/'
  const rawRedirect = searchParams.get("redirect");
  const redirectTo = (rawRedirect && rawRedirect !== "null") ? rawRedirect : '/';

  // UI UX states
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setIsSuccess(false);

    // Client-side password match verification
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // 🏛️ Updated subscription tier labels based on role selection
    const plan = role === 'client' ? 'client-free' : 'lawyer-free';

    try {
      const { data: res, error } = await authClient.signUp.email({
        name: name,
        email: email,
        password: password,
        callbackURL: redirectTo,
        metadata: {
          role,
          plan
        }
      });
      
      console.log(res, error);
      
      if (error) {
        setErrorMessage(error.message || "Something went wrong");
      } else {
        setIsSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        // Redirect ONLY when sign up is 100% successful
        router.push(redirectTo);
      }

    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-content2 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg flex flex-col gap-4">
        <CardHeader className="flex flex-col gap-1 items-center justify-center pt-2">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-small text-default-500">Sign up to get started</p>
        </CardHeader>

        {/* Success Banner */}
        {isSuccess && (
          <div className="p-3 bg-success-50 border border-success-200 rounded-lg flex items-center gap-2 text-success-700 text-sm">
            <CircleCheck className="w-5 h-5 text-success flex-shrink-0" />
            <div>
              <p className="font-semibold">Account created successfully!</p>
              <p className="text-xs text-success-600">You can now proceed to log in.</p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* HeroUI Custom Form */}
        <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

          {/* Name Field */}
          <TextField isRequired className="w-full">
            <Label className="text-sm font-medium mb-1 block">Name</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Person className="text-default-400 w-5 h-5 mx-2" />
              </InputGroup.Prefix>
              <Input
                type="text"
                autoComplete="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
          </TextField>

          {/* Email Field */}
          <TextField isRequired className="w-full">
            <Label className="text-sm font-medium mb-1 block">Email</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <Envelope className="text-default-400 w-5 h-5 mx-2" />
              </InputGroup.Prefix>
              <Input
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </TextField>

          {/* Password Field */}
          <TextField isRequired className="w-full">
            <Label className="text-sm font-medium mb-1 block">Password</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <LockFill className="text-default-400 w-5 h-5 mx-2" />
              </InputGroup.Prefix>
              <Input
                type={isVisible ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password"
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

          {/* Confirm Password Field */}
          <TextField isRequired className="w-full">
            <Label className="text-sm font-medium mb-1 block">Confirm Password</Label>
            <InputGroup>
              <InputGroup.Prefix>
                <LockFill className="text-default-400 w-5 h-5 mx-2" />
              </InputGroup.Prefix>
              <Input
                type={isConfirmVisible ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <InputGroup.Suffix>
                <button
                  className="focus:outline-none mx-2 flex items-center justify-center"
                  type="button"
                  onClick={toggleConfirmVisibility}
                >
                  {isConfirmVisible ? (
                    <EyeClosed className="text-default-400 w-5 h-5" />
                  ) : (
                    <Eye className="text-default-400 w-5 h-5" />
                  )}
                </button>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>

          {/* Role field */}
          <div className="flex flex-col gap-4">
            <Label>Subscription plan</Label>
            <RadioGroup 
              defaultValue="client" 
              name="role" 
              onChange={value => setRole(value)}
              orientation="horizontal"
            >
              {/* 🏛️ Updated from Job Seeker to Client */}
              <Radio value="client">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content>
                  <Label>Client</Label>
                </Radio.Content>
              </Radio>
              {/* 🏛️ Updated from Recruiter to Lawyer */}
              <Radio value="lawyer">
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                <Radio.Content>
                  <Label>Lawyer</Label>
                </Radio.Content>
              </Radio>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isPending={isLoading}
          >
            Sign Up
          </Button>
        </Form>

        <p className="text-center text-small text-default-500 mt-2">
          Already have an account?{" "}
          <a href={`login?redirect=${redirectTo}`} className="text-primary hover:underline">
            Log In
          </a>
        </p>
      </Card>
    </div>
  );
}