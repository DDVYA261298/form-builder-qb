import styles from "./page.module.css";
import React from "react";
import Builder from "./Builder";

export default function Home() {
  return (
    <main className={styles.App}>
      <Builder />
    </main>
  );
}

// export default App;
