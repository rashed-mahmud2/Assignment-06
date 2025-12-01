"use client";

import { IoMdArrowBack } from "react-icons/io";
import React from "react";
import { useForm } from "react-hook-form";
import styles from "./login.module.css"; // CSS Module
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext"; // ✅ import AuthContext

const Login = () => {
  const { login } = useAuth(); // ✅ get login function from context
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation({
    mutationFn: (data) => loginUser(data),
    onSuccess: (data) => {
      const token = data?.data?.access?.token;
      const userId = data?.data?._id;
      const userRole = data?.data?.role;

      if (token && userId) {
        // ✅ Update global auth state
        login(token, userId, userRole);

        // Optional: persist in cookies / localStorage if needed
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        if (userRole) localStorage.setItem("userRole", userRole);

        toast.success("Login successful!");

        // SPA-friendly redirect
        const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Invalid email or password!");
    },
  });

  const onSubmit = (values) => {
    loginMutation.mutate(values);
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.subtitle}>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.subtitle}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>

          <p className={styles.smallText}>
            If you don't have an account,{" "}
            <Link href="/sign-up" className={styles.link}>
              Sign-up
            </Link>
          </p>

          <button
            type="submit"
            className={styles.button}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
          <Link className={styles.backtohome} href="/">
            <IoMdArrowBack />
            Back to home
          </Link>
        </form>
      </div>
    </section>
  );
};

export default Login;
