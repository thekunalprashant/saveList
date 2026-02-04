"use client";

import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import styles from "../legal.module.css";

export default function PrivacyPage() {
    return (
        <div className={styles.page}>
            <LandingNav />

            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Privacy Policy</h1>
                    <p className={styles.subtitle}>Last updated: February 4, 2026</p>

                    <div className={styles.content}>
                        <p>
                            Your privacy is important to us. It is SaveList's policy to respect your privacy regarding
                            any information we may collect from you across our website.
                        </p>

                        <h2>1. Information We Collect</h2>
                        <p>
                            We only ask for personal information when we truly need it to provide a service to you.
                            We collect it by fair and lawful means, with your knowledge and consent.
                            Typically, this includes your name and email address when you sign in via GitHub or Google.
                        </p>

                        <h2>2. How We Use It</h2>
                        <p>
                            We use your information to providing you with the SaveList dashboard experience,
                            syncing your tasks and goals across devices, and authenticating your session.
                        </p>

                        <h2>3. Data Storage</h2>
                        <p>
                            We only retain collected information for as long as necessary to provide you with your requested service.
                            What data we store, we'll protect within commercially acceptable means to prevent loss and theft.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
