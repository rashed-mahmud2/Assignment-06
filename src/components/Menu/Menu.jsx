import React from "react";
import styles from "./menu.module.css";
import Link from "next/link";
import Image from "next/image";
import MenuPosts from "../menuPosts/MenuPosts";
import MenuCategories from "../menuCategories/MenuCategories.jsx";

const Menu = () => {
  return (
    <div className={styles.container}>
      <div>
        <div>
          <h2 className={styles.subtitle}>Chosen by the editor</h2>
          <h1 className={styles.title}>Editors Pick</h1>
          <MenuPosts />
        </div>
        <div>
          <h2 className={styles.subtitle}>Discover by topic</h2>
          <h1 className={styles.title}>Categories</h1>
          <MenuCategories />
        </div>
      </div>
    </div>
  );
};

export default Menu;
