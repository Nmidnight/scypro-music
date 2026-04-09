import styles from "./page.module.css";
import CentralBlock from "@/components/centralBlock/centralBlock";
import MainNav from "@/components/mainNav/mainNav";
import PlayerBar from "@/components/playerBar/playerBar";
import Sidebar from "@/components/sidebar/sidebar";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />
          <CentralBlock />
          <Sidebar />
        </main>
        <PlayerBar />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
