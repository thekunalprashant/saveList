"use client";

// Footer Component
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brandColumn}>
                        <h3>SaveList</h3>
                        <p>
                            Your unified productivity ecosystem.<br />
                            Designed for focus. Built for you.
                        </p>
                    </div>

                    <div className={styles.column}>
                        <h4>Product</h4>
                        <div className={styles.links}>
                            <Link href="/landing#features" className={styles.link}>Features</Link>
                            <Link href="/auth/signin" className={styles.link}>Sign In</Link>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h4>Company</h4>
                        <div className={styles.links}>
                            <Link href="/about" className={styles.link}>About Us</Link>
                            <Link href="/contact" className={styles.link}>Contact</Link>
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h4>Legal</h4>
                        <div className={styles.links}>
                            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                            <Link href="/terms" className={styles.link}>Terms of Use</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} SaveList Inc. All rights reserved.
                    </p>
                    <div className={styles.social}>
                        <a href="#" className={styles.socialLink}><Github size={18} /></a>
                        <a href="#" className={styles.socialLink}><Twitter size={18} /></a>
                        <a href="#" className={styles.socialLink}><Linkedin size={18} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
