import { CenterBlock } from "../components/CenterBlock";
import { MainNav } from "../components/MainNav";
import { PlayerBar } from "../components/PlayerBar";
import { Sidebar } from "../components/Sidebar";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />
          <CenterBlock />
          <Sidebar />
        </main>
        <PlayerBar />
        <footer />
      </div>
    </div>
  );
}
