'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check sessionStorage first (cleared on browser close), then localStorage as backup
      const sessionLoggedIn = sessionStorage.getItem('adminLoggedIn');
      const localLoggedIn = localStorage.getItem('adminLoggedIn');
      const sessionLoginTime = sessionStorage.getItem('adminLoginTime');
      const localLoginTime = localStorage.getItem('adminLoginTime');
      
      // If sessionStorage exists, user is definitely logged in
      if (sessionLoggedIn === 'true' && sessionLoginTime) {
        setIsAuthenticated(true);
      } 
      // If no sessionStorage but localStorage exists, restore session
      else if (localLoggedIn === 'true' && localLoginTime) {
        // Restore session storage from localStorage
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminLoginTime', localLoginTime);
        setIsAuthenticated(true);
      } 
      // No valid authentication found
      else {
        // Clear any stale data
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminLoginTime');
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoginTime');
        
        // Redirect to admin login
        router.push('/admin-login');
        return;
      }
      setIsLoading(false);
    };

    checkAuth();

    // Clean up localStorage when tab/browser is closed
    const handleBeforeUnload = () => {
      // Only clear localStorage if it's the last tab with the session
      if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminLoginTime');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router]);

  return { isAuthenticated, isLoading };
}

// Auth wrapper component for dashboard pages
export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px' }}>Loading...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
