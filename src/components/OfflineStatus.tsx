"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function OfflineStatus() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Initial check
        setIsOffline(!navigator.onLine);

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (!isOffline) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: '#1a1a1a',
                padding: '40px',
                borderRadius: '16px',
                textAlign: 'center',
                border: '1px solid #333',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: '#333',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                }}>
                    <WifiOff size={32} color="#ff4444" />
                </div>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>No Internet Connection</h2>
                    <p style={{ color: '#aaa', maxWidth: '300px', lineHeight: '1.5' }}>
                        Please check your network settings. We'll reconnect automatically when you're back online.
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '10px 24px',
                        background: 'white',
                        color: 'black',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '10px',
                        transition: 'transform 0.2s'
                    }}
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );
}
