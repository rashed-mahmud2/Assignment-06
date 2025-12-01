"use client";

import React, { useState } from "react";
import styles from "./createBlog.module.css";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const blogSchema = z.object({
  image: z.string().min(1, "Image is required"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Description must be at least 10 characters"),
});

export default function CreateNewBlog() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      image: "",
      category: "",
      title: "",
      content: "",
    },
  });

  const [preview, setPreview] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1️⃣ Get signature from your server
    const sigRes = await fetch("/api/upload_signature");
    const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

    // 2️⃣ Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    // 3️⃣ Upload to Cloudinary
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    const uploadedImageURL = await res.json();

    const secureUrl = (
      uploadedImageURL.secure_url || uploadedImageURL.url
    ).replace(/^http:\/\//, "https://"); // HTTP → HTTPS
    const optimizedPreview = secureUrl.replace(
      "/upload/",
      "/upload/w_800,h_500,c_fill,f_auto/"
    );

    // 5️⃣ Set for preview and form submission
    setPreview(optimizedPreview); // small, optimized preview
    setValue("image", secureUrl); // original secure image for backend
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Blog creation failed");
      }

      // ✅ নতুন: Cache revalidate করো
      await fetch("/api/revalidate?tag=blogs", {
        method: "POST",
      });

      reset();
      setPreview("");
      toast.success("Blog created successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <a href="/" className={styles.backButton}>
        ← Back to Home
      </a>

      <div className={styles.card}>
        <h1 className={styles.title}>✍️ Create New Blog</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* Image Upload */}
          <div className={styles.field}>
            <label className={styles.label}>Blog Image</label>
            <input
              type="file"
              accept="image/*"
              className={styles.input}
              onChange={handleImageUpload}
            />

            {preview && (
              <img src={preview} alt="Preview" className={styles.preview} />
            )}

            {errors.image && (
              <p className={styles.error}>{errors.image.message}</p>
            )}
          </div>

          {/* Category */}
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} {...register("category")}>
              <option value="" disabled>
                Select Category
              </option>
              <option value="adventure">Adventure</option>
              <option value="travel">Travel</option>
              <option value="fashion">Fashion</option>
              <option value="technology">Technology</option>
              <option value="culture">Culture</option>
              <option value="coding">Coding</option>
            </select>
            {errors.category && (
              <p className={styles.error}>{errors.category.message}</p>
            )}
          </div>

          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              type="text"
              placeholder="Enter blog title"
              className={styles.input}
              {...register("title")}
            />
            {errors.title && (
              <p className={styles.error}>{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              placeholder="Write your blog content..."
              className={styles.textarea}
              {...register("content")}
            />
            {errors.content && (
              <p className={styles.error}>{errors.content.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className={styles.submitArea}>
            <button type="submit" className={styles.submitBtn}>
              Publish Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
