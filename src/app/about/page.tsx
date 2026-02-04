"use client";

import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import styles from "../legal.module.css";

export default function AboutPage() {
    return (
        <div className={styles.page}>
            <LandingNav />

            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>About SaveList</h1>
                    <p className={styles.subtitle}>
                        We believe productivity tools should be calm, focused, and beautiful.
                    </p>

                    <div className={styles.content}>
                        <h2>Our Mission</h2>
                        <p>
                            In a world of noise and distraction, SaveList is your quiet corner.
                            We designed this platform to help you focus on what actually matters—whether that's
                            completing a task, hitting a life goal, or just remembering what movie to watch next.
                        </p>

                        <h2>Why Neumorphism?</h2>
                        <p>
                            You might notice our unique design style. We chose <strong>Soft Neumorphism</strong> because
                            it feels tactile and real. Digital tools often feel cold and flat. We wanted SaveList
                            to feel like a physical object you interact with—soft, approachable, and human.
                        </p>

                        <h2>Built for Focus</h2>
                        <ul>
                            <li><strong>Tasks:</strong> Manage your daily to-dos with a built-in focus timer.</li>
                            <li><strong>Goals:</strong> Break big dreams into small, actionable steps.</li>
                            <li><strong>Watchlist:</strong> A simple, curated list for your entertainment downtime.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
