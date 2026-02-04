"use client";

// Footer Component
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer style={{
            background: '#020617',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            padding: '60px 20px',
            marginTop: 'auto'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '60px' }}>
                    <div>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>SaveList</h3>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
                            Your unified productivity ecosystem.<br />
                            Designed for focus. Built for you.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}>Product</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link href="/landing#features" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">Features</Link>
                            <Link href="/auth/signin" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">Sign In</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}>Company</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link href="/about" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">About Us</Link>
                            <Link href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">Contact</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}>Legal</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">Privacy Policy</Link>
                            <Link href="/terms" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-white">Terms of Use</Link>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>
                        © {new Date().getFullYear()} SaveList Inc. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <a href="#" style={{ color: '#64748b', transition: 'color 0.2s' }}><Github size={20} /></a>
                        <a href="#" style={{ color: '#64748b', transition: 'color 0.2s' }}><Twitter size={20} /></a>
                        <a href="#" style={{ color: '#64748b', transition: 'color 0.2s' }}><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
