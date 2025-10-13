'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') || localStorage.getItem('adminLoggedIn');
    if (isAdminLoggedIn === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check credentials (admin/admin123)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      // Store login state in sessionStorage (automatically cleared when browser closes)
      sessionStorage.setItem('adminLoggedIn', 'true');
      sessionStorage.setItem('adminLoginTime', Date.now().toString());
      
      // Also set in localStorage as backup for tab refreshes
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-background">
        {/* Mountain/gradient background */}
        <div className="mountain-bg"></div>
        
        {/* Login Form */}
        <div className="login-form-container">
          <div className="login-form-card">
            {/* Logo */}
            <div className="logo-container">
              <Image 
                src="/buzzplannersLogo.png" 
                alt="BuzzPlanners" 
                width={120} 
                height={34}
                className="logo"
              />
            </div>

            {/* Title */}
            <h1 className="login-title">Admin Login</h1>
            <p className="login-subtitle">Access the dashboard</p>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">
                    <span></span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Back to home link */}
            <div className="back-link">
              <Link href="/" className="back-home">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow-y: auto;
          padding: 20px 0;
        }

        .admin-login-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #14A15F 0%, #2D3E2E 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mountain-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(to top, rgba(45, 62, 46, 0.3) 0%, transparent 100%);
          clip-path: polygon(0 100%, 15% 60%, 35% 80%, 50% 40%, 65% 70%, 80% 50%, 100% 80%, 100% 100%);
        }

        .login-form-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          padding: 20px;
          margin: auto 0;
          display: flex;
          align-items: center;
          min-height: calc(100vh - 40px);
        }

        .login-form-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 25px 30px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 100%;
          margin: 20px 0;
        }

        .logo-container {
          text-align: center;
          margin-bottom: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        .login-title {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          color: #333;
          margin-bottom: 6px;
        }

        .login-subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 20px;
          font-size: 15px;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-size: 14px;
        }

        .login-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 15px;
          transition: border-color 0.3s ease;
          background: #fff;
        }

        .form-group input:focus {
          outline: none;
          border-color: #14A15F;
          box-shadow: 0 0 0 3px rgba(20, 161, 95, 0.1);
        }

        .form-group input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .form-group input::placeholder {
          color: #999;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #14A15F 0%, #33A46F 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          margin-bottom: 12px;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(20, 161, 95, 0.3);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .loading-spinner span:first-child {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .back-link {
          text-align: center;
        }

        .back-home {
          color: #14A15F;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .back-home:hover {
          color: #147C2B;
          text-decoration: underline;
        }

        /* Mobile responsiveness */
        @media (max-width: 480px) {
          .admin-login-container {
            padding: 15px 0;
          }

          .login-form-container {
            padding: 15px;
            min-height: calc(100vh - 30px);
          }

          .login-form-card {
            padding: 20px 20px;
            margin: 10px 0;
          }

          .login-title {
            font-size: 20px;
          }

          .login-subtitle {
            font-size: 14px;
          }

          .form-group input {
            padding: 10px 12px;
            font-size: 14px;
          }

          .form-group label {
            font-size: 13px;
          }

          .login-button {
            padding: 11px;
            font-size: 14px;
          }
        }

        /* Small height screens */
        @media (max-height: 600px) {
          .admin-login-container {
            align-items: flex-start;
            padding: 10px 0;
          }

          .login-form-container {
            min-height: auto;
          }

          .login-form-card {
            margin: 10px 0;
            padding: 20px 25px;
          }

          .logo-container {
            margin-bottom: 10px;
          }

          .login-title {
            font-size: 20px;
            margin-bottom: 4px;
          }

          .login-subtitle {
            margin-bottom: 15px;
            font-size: 14px;
          }

          .form-group {
            margin-bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
}
