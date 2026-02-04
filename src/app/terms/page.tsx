"use client";

import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import styles from "../legal.module.css";

export default function TermsPage() {
    return (
        <div className={styles.page}>
            <LandingNav />

            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Terms of Use</h1>
                    <p className={styles.subtitle}>Effective Date: February 4, 2026</p>

                    <div className={styles.content}>
                        <h2>1. Acceptance of Terms</h2>
                        <p>
                            By accessing specific pages of the SaveList website, you agree to be bound by these
                            terms of service, all applicable laws and regulations, and agree that you are responsible
                            for compliance with any applicable local laws.
                        </p>

                        <h2>2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or software)
                            on SaveList's website for personal, non-commercial transitory viewing only.
                        </p>

                        <h2>3. Disclaimer</h2>
                        <p>
                            The materials on SaveList's website are provided on an 'as is' basis. SaveList makes no
                            warranties, expressed or implied, and hereby disclaims and negates all other warranties
                            including, without limitation, implied warranties or conditions of merchantability.
                        </p>

                        <h2>4. Limitations</h2>
                        <p>
                            In no event shall SaveList or its suppliers be liable for any damages (including, without limitation,
                            damages for loss of data or profit, or due to business interruption) arising out of the use
                            or inability to use the materials on SaveList's website.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
