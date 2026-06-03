import LikeToast from "@/components/likeToast/likeToast";
import MainNav from "@/components/mainNav/mainNav";
import PlayerBar from "@/components/playerBar/playerBar";
import Sidebar from "@/components/sidebar/sidebar";
import styles from "./layout.module.css";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <MainNav />
          {children}
          <Sidebar />
        </main>
        <PlayerBar />
        <LikeToast />
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
