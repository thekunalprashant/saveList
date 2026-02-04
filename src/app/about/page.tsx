"use client";

import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import { Sparkles, Heart, Users, Shield } from "lucide-react";

export default function AboutPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'var(--font-inter)' }}>
            <LandingNav />

            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8',
                        padding: '8px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: '600', marginBottom: '24px'
                    }}>
                        <Sparkles size={16} />
                        <span>Our Mission</span>
                    </div>
                    <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', lineHeight: '1.2' }}>
                        Simplifying Digital <span style={{ color: '#818cf8' }}>Life</span>
                    </h1>
                    <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: '1.6' }}>
                        We believe productivity shouldn't be scattered across a dozen apps.
                        SaveList was born from the desire to have one beautiful, calm space for everything that matters.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '40px' }}>
                    <Section
                        icon={<Heart size={24} />}
                        title="Built for Focus"
                        text="In a world of noise, we value clarity. Our design philosophy centers on minimalism—giving you the tools you need without the clutter you don't."
                    />
                    <Section
                        icon={<Users size={24} />}
                        title="Community First"
                        text="We listen to our users. Every feature—from the persistent timer to the watchlist integration—comes from real feedback and real needs."
                    />
                    <Section
                        icon={<Shield size={24} />}
                        title="Privacy by Design"
                        text="Your data is yours. We don't sell it, share it, or mine it. We build secure, reliable software that respects your digital boundaries."
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}

function Section({ icon, title, text }: { icon: any, title: string, text: string }) {
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '32px', borderRadius: '16px', display: 'flex', gap: '24px', alignItems: 'flex-start'
        }}>
            <div style={{
                minWidth: '48px', height: '48px', background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8'
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{title}</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{text}</p>
            </div>
        </div>
    );
}
