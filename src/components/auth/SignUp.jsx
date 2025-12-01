"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMdArrowBack } from "react-icons/io";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { newUser } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

import styles from "./signup.module.css"; // <-- CSS Module

// Zod schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignUp = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: newUser,
    onSuccess: (data) => {
      router.push("/sign-in");
      toast.success("User registered successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Error registering user");
    },
  });

  const onSubmit = (values) => {
    registerMutation.mutate(values);
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Sign Up</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className={styles.loginText}>
              If you have an account,{" "}
              <Link href="/sign-in" className={styles.loginLink}>
                Sign-in
              </Link>
              .
            </p>

            <Button type="submit" className={styles.submitButton}>
              {registerMutation.isPending ? "Registering..." : "Sign Up"}
            </Button>
            <Link className={styles.backtohome} href="/">
              <IoMdArrowBack />
              Back to home
            </Link>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default SignUp;
