// app/login/page.tsx (or similar route)

/* eslint-disable @next/next/no-img-element */


'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
  const [mobile, setMobile] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!mobile.match(/^[6-9]\d{9}$/)) {
      alert('Enter a valid 10-digit mobile number');
      return;
    }

    // Navigate to verify-otp page with mobile in query string
    router.push(`/verify-otp`);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
        <Header />
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center px-3 px-md-5" 
           style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="row w-100 bg-white shadow rounded" 
             style={{ maxWidth: 'clamp(350px, 90vw, 1200px)', overflow: 'hidden' }}>
          {/* Left image section */}
          <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center"
            style={{ background: '#C5F3CFEE', minHeight: '500px' }}>
            <img 
              src="/images/traveller.png" 
              style={{ 
                width: 'clamp(300px, 80%, 900px)', 
                height: 'clamp(200px, 60%, 600px)', 
                objectFit: 'contain', 
                marginLeft: 'clamp(0px, 10%, 60%)' 
              }} 
              alt="Traveler" 
            />
          </div>
          {/* Right main section */}
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center"
               style={{ padding: 'clamp(2rem, 5vw, 3rem)' }}>
            <h3 className="fw-bold mb-3" 
                style={{ fontSize: 'clamp(1.5rem, 4vw, 1.75rem)' }}>
              Login to your account
            </h3>
            <form onSubmit={handleSubmit}>
              <label className="form-label mb-3" 
                     style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 500 }}>
                Enter your mobile number
              </label>
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" 
                      style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                  +91
                </span>
                <input
                  type="tel"
                  className="form-control"
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/, ''))}
                  maxLength={10}
                  required
                  style={{ fontSize: 'clamp(1rem, 3vw, 1.125rem)', height: 'clamp(45px, 8vw, 55px)' }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-success w-100 fw-bold" 
                style={{ 
                  height: 'clamp(45px, 8vw, 55px)', 
                  fontSize: 'clamp(1rem, 3vw, 1.125rem)', 
                  backgroundColor: '#1D9337' 
                }}
              >
                Login
              </button>
            </form>
            <div className="d-flex align-items-center my-3" style={{ color: '#bbb' }}>
              <div className="flex-grow-1" style={{ height: 1, background: '#eee' }}></div>
              <div className="mx-2 fw-medium" 
                   style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}>
                Or Login/Signup With
              </div>
              <div className="flex-grow-1" style={{ height: 1, background: '#eee' }}></div>
            </div>
            <div className="d-flex gap-3 gap-md-4 justify-content-center">
              <img 
                src="/icons/google.png" 
                alt="Google" 
                style={{ 
                  width: 'clamp(35px, 8vw, 40px)', 
                  height: 'clamp(35px, 8vw, 40px)', 
                  cursor: "pointer",
                  objectFit: 'contain'
                }} 
              />
              <img 
                src="/images/meta-icon.png" 
                alt="Facebook" 
                style={{ 
                  width: 'clamp(35px, 8vw, 40px)', 
                  height: 'clamp(35px, 8vw, 40px)', 
                  cursor: "pointer",
                  objectFit: 'contain'
                }} 
              />
              <img 
                src="/icons/mail.png" 
                alt="Email" 
                style={{ 
                  width: 'clamp(35px, 8vw, 40px)', 
                  height: 'clamp(35px, 8vw, 40px)', 
                  cursor: "pointer",
                  objectFit: 'contain'
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
