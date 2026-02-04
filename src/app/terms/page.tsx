"use client";

import LandingNav from "@/components/layout/LandingNav";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'var(--font-inter)' }}>
            <LandingNav />
            <main style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px 80px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '40px' }}>Terms of Service</h1>
                <div style={{ color: '#cbd5e1', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>1. Acceptance of Terms</h2>
                        <p>By accessing and using SaveList, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>2. Use License</h2>
                        <p>Permission is granted to temporarily download one copy of the materials (information or software) on SaveList's website for personal, non-commercial transitory viewing only.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>3. Disclaimer</h2>
                        <p>The materials on SaveList's website are provided on an 'as is' basis. SaveList makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </section>

                    <section>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: 'white' }}>4. Limitations</h2>
                        <p>In no event shall SaveList or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SaveList's website.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
