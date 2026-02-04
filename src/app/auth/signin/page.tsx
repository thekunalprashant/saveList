"use client";

import { signIn } from "next-auth/react";
import { Github, KeyRound, ShieldCheck } from "lucide-react";
import styles from "./signin.module.css";

export default function SigninPage() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <ShieldCheck size={32} />
                </div>
                <h1 className={styles.title}>Welcome to SaveList</h1>
                <p className={styles.subtitle}>
                    Your unified space for tasks, goals, and media tracking.
                </p>

                <div className={styles.authButtons}>
                    <button
                        className={styles.authButton}
                        onClick={() => signIn("github", { callbackUrl: "/" })}
                    >
                        <Github />
                        Continue with GitHub
                    </button>

                    <button
                        className={styles.authButton}
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                    >
                        <KeyRound />
                        Continue with Google
                    </button>
                </div>

                <p className={styles.footer}>
                    By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
