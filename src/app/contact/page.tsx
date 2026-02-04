"use client";

import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";
import styles from "../legal.module.css";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className={styles.page}>
            <LandingNav />

            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Contact Us</h1>
                    <p className={styles.subtitle}>
                        Have a question or just want to say hi? We'd love to hear from you.
                    </p>

                    <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                        {/* Contact Info */}
                        <div className={styles.content}>
                            <h2>Get in Touch</h2>
                            <p>
                                Whether you have a feature request, found a bug, or just want to chat about productivity,
                                our team is here for you.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface)',
                                        boxShadow: 'var(--shadow-neu-flat)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                                    }}>
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', marginTop: 0 }}>Email</h3>
                                        <p style={{ margin: 0, fontSize: '14px' }}>support@savelist.app</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px', background: 'var(--surface)',
                                        boxShadow: 'var(--shadow-neu-flat)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
                                    }}>
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', marginTop: 0 }}>Office</h3>
                                        <p style={{ margin: 0, fontSize: '14px' }}>San Francisco, CA</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Neumorphic Form */}
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--secondary)' }}>Name</label>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    style={{
                                        width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                                        background: 'var(--surface)', boxShadow: 'var(--shadow-neu-pressed)', color: 'var(--foreground)', outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--secondary)' }}>Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    style={{
                                        width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                                        background: 'var(--surface)', boxShadow: 'var(--shadow-neu-pressed)', color: 'var(--foreground)', outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--secondary)' }}>Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="How can we help?"
                                    style={{
                                        width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                                        background: 'var(--surface)', boxShadow: 'var(--shadow-neu-pressed)', color: 'var(--foreground)', outline: 'none', resize: 'vertical'
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                style={{
                                    marginTop: '12px', padding: '16px', borderRadius: '12px', background: 'var(--primary)', color: 'white',
                                    fontWeight: '700', border: 'none', boxShadow: 'var(--shadow-neu-flat)', cursor: 'pointer', transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                Send Message
                            </button>
                        </form>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
