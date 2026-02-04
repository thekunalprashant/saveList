'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

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
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Something went wrong!</h2>
            <p style={{ color: 'var(--secondary)', marginBottom: '24px' }}>
                {error.message || 'An unexpected error occurred'}
            </p>
            <button
                onClick={() => reset()}
                style={{
                    padding: '12px 24px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}
            >
                Try again
            </button>
        </div>
    );
}
