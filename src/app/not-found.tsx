import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center',
            background: 'var(--background)',
            color: 'var(--text)'
        }}>
            <h1 style={{ fontSize: '72px', fontWeight: '800', marginBottom: '16px', opacity: 0.2 }}>
                404
            </h1>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Page Not Found</h2>
            <p style={{ color: 'var(--secondary)', marginBottom: '24px' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                href="/"
                style={{
                    padding: '12px 24px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    textDecoration: 'none'
                }}
            >
                Go Home
            </Link>
        </div>
    );
}
