"use client";

import Link from "next/link";
import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { motion, Variants } from "framer-motion";
import {
    CheckSquare,
    Target,
    Clapperboard,
    Clock,
    ArrowRight
} from "lucide-react";
import styles from "./landing.module.css";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

export default function LandingPage() {
    return (
        <div className={styles.landingContainer}>
            <LandingNav />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={container}
                        className={styles.heroTextContent}
                    >
                        <motion.h1 variants={item} className={styles.heroTitle}>
                            Focus on what<br />
                            <span className={styles.highlight}>Actually Matters.</span>
                        </motion.h1>

                        <motion.p variants={item} className={styles.heroSubtitle}>
                            Stop context switching. Manage your tasks with a real-time focus timer,
                            break down ambitious goals, and curate your watchlist. All in one place.
                        </motion.p>

                        <motion.div variants={item} className={styles.ctaButtons}>
                            <Link href="/auth/signin" className={styles.primaryCta}>
                                Start Dashboard <ArrowRight size={18} />
                            </Link>
                            <Link href="#features" className={styles.secondaryCta}>
                                See How It Works
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features} id="features">
                <div className={styles.sectionTitle}>
                    <h2>Built for the Real World</h2>
                    <p>No fluff. Just the tools you need to get things done.</p>
                </div>

                <div className={styles.featureGrid}>
                    <FeatureCard
                        icon={<Clock size={28} className={styles.iconBlue} />}
                        title="Persistent Timer"
                        description="Start a timer on any task. Close the tab, go to lunch, come back—it keeps running correctly."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Target size={28} className={styles.iconOrange} />}
                        title="Goal Subtasks"
                        description="Don't just set goals. Break them down into actionable steps and track your progress percentage."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Clapperboard size={28} className={styles.iconPurple} />}
                        title="Simple Watchlist"
                        description="A clean, distraction-free list for movies and shows you want to watch. No complex metadata, just your list."
                        delay={0.3}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
    return (
        <motion.div
            className={styles.featureCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
        >
            <div className={styles.featureIcon}>
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </motion.div>
    );
}
