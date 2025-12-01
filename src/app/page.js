export const dynamic = "force-dynamic";

import CategoryList from "@/components/categoryList/CategoryList";
import Feature from "@/components/feature/Feature";
import styles from "./homePage.module.css";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/Menu/Menu";

export default function Home() {
  return (
    <div>
      <Feature />
      <CategoryList />
      <div className={styles.content}>
        <CardList />
        <Menu />
      </div>
      <hr className={styles.hr} />
    </div>
  );
}
