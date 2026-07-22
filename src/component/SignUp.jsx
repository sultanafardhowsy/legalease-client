"use client";

import React, { useState } from "react";
import {
  Input,
  Button,
  Form,
  TextField,
  Label,
  InputGroup,
} from "@heroui/react";
import { Eye, EyeClosed, Envelope, LockFill, Person, CircleCheck } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("client");
  const [imageFile, setImageFile] = useState(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirectTo = (rawRedirect && rawRedirect !== "null") ? rawRedirect : '/';

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload profile image to ImgBB.");

    const result = await response.json();
    return result.data.display_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setIsSuccess(false);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const plan = role === 'client' ? 'client-free' : 'lawyer-free';
    let uploadedImageUrl = "";

    try {
      if (imageFile) {
        uploadedImageUrl = await uploadToImgBB(imageFile);
      }

      const { data: res, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: uploadedImageUrl,
        callbackURL: redirectTo,
        role,
        plan
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
        setImageFile(null);
        router.push(redirectTo);
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
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
              Create an Account
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign up to get started
            </p>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 mb-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
              <CircleCheck className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Account created successfully!</p>
                <p className="text-xs opacity-70">You can now proceed to log in.</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 mb-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

            {/* Name */}
            <TextField isRequired className="w-full">
              <Label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">
                Name
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <Person className="text-slate-400 dark:text-slate-500 w-5 h-5 mx-2" />
                </InputGroup.Prefix>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </InputGroup>
            </TextField>

            {/* Email */}
            <TextField isRequired className="w-full">
              <Label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">
                Email
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <Envelope className="text-slate-400 dark:text-slate-500 w-5 h-5 mx-2" />
                </InputGroup.Prefix>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </TextField>

            {/* Password */}
            <TextField isRequired className="w-full">
              <Label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">
                Password
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <LockFill className="text-slate-400 dark:text-slate-500 w-5 h-5 mx-2" />
                </InputGroup.Prefix>
                <Input
                  type={isVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroup.Suffix>
                  <button className="focus:outline-none mx-2 flex items-center justify-center" type="button" onClick={toggleVisibility}>
                    {isVisible ? <EyeClosed className="text-slate-400 dark:text-slate-500 w-5 h-5" /> : <Eye className="text-slate-400 dark:text-slate-500 w-5 h-5" />}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>

            {/* Confirm Password */}
            <TextField isRequired className="w-full">
              <Label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">
                Confirm Password
              </Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <LockFill className="text-slate-400 dark:text-slate-500 w-5 h-5 mx-2" />
                </InputGroup.Prefix>
                <Input
                  type={isConfirmVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputGroup.Suffix>
                  <button className="focus:outline-none mx-2 flex items-center justify-center" type="button" onClick={toggleConfirmVisibility}>
                    {isConfirmVisible ? <EyeClosed className="text-slate-400 dark:text-slate-500 w-5 h-5" /> : <Eye className="text-slate-400 dark:text-slate-500 w-5 h-5" />}
                  </button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>

            {/* Profile Image */}
            <div className="flex flex-col gap-1 w-full">
              <Label className="text-sm font-medium block text-slate-700 dark:text-slate-300">
                Profile Image
              </Label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-100 dark:file:bg-amber-500/10 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-200 dark:hover:file:bg-amber-500/20 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                }}
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2 w-full">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Subscription Plan
              </Label>
              <div className="flex gap-6">
                {["client", "lawyer"].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer text-sm capitalize text-slate-600 dark:text-slate-400">
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={role === r}
                      onChange={() => setRole(r)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 font-bold rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-500/20"
              isPending={isLoading}
            >
              Sign Up
            </Button>
          </Form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <a href={`/login?redirect=${redirectTo}`} className="text-amber-600 dark:text-amber-400 hover:underline font-semibold">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
