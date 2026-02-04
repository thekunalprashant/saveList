"use client";

import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'var(--font-inter)' }}>
            <LandingNav />
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 80px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '40px' }}>Privacy Policy</h1>
                <div style={{ color: '#cbd5e1', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you create an account, such as your name, email address, and profile picture from authentication providers (Google/GitHub).</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect SaveList and our users.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>3. Data Storage</h2>
                        <p>Your task, goal, and watchlist data is stored securely in our database. We do not share your personal data with third parties for marketing purposes.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>4. Cookies</h2>
                        <p>We use cookies to maintain your login session and preferences. By using our website, you agree to the use of cookies.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
