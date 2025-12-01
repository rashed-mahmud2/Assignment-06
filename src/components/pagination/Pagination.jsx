"use client";

import React from "react";
import styles from "./pagination.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

const Pagination = ({ currentPage = 1, totalPages = 1 }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${
          currentPage <= 1 ? styles.disabled : ""
        }`}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <FaArrowLeft className={styles.icon} /> Previous
      </button>

      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={`${styles.button} ${
          currentPage >= totalPages ? styles.disabled : ""
        }`}
        onClick={() =>
          currentPage < totalPages && handlePageChange(currentPage + 1)
        }
        disabled={currentPage >= totalPages}
      >
        Next <FaArrowRight className={styles.icon} />
      </button>
    </div>
  );
};

export default Pagination;
