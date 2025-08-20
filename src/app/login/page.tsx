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
      <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="row w-100 bg-white shadow" style={{ maxWidth: 1200 }}>
          {/* Left image section */}
          <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center"
            style={{ background: '#C5F3CFEE'}}>
            <img src="/images/traveller.png" width={900} height={600} style={{ objectFit: 'contain', marginLeft:'60%' }} alt="Traveler" />
          </div>
          {/* Right main section */}
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
            <h3 className="fw-bold mb-3">Login to your account</h3>
            <form onSubmit={handleSubmit}>
              <label className="form-label fs-5 mb-3">Enter your mobile number</label>
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold fs-3">+91</span>
                <input
                  type="tel"
                  className="form-control"
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/, ''))}
                  maxLength={10}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100 fw-bold" style={{ height: 55, fontSize: 18, backgroundColor: '#1D9337' }}
            >
                Login
              </button>
            </form>
            <div className="d-flex align-items-center my-3" style={{ color: '#bbb' }}>
              <div className="flex-grow-1" style={{ height: 1, background: '#eee' }}></div>
              <div className="mx-2 fs-5 fw-medium">Or Login/Signup With</div>
              <div className="flex-grow-1" style={{ height: 1, background: '#eee' }}></div>
            </div>
            <div className="d-flex gap-4 justify-content-center">
              <img src="/icons/google.png" alt="Google" style={{ width: 40, cursor: "pointer" }} />
              <img src="/images/meta-icon.png" alt="Facebook" style={{ width: 40, cursor: "pointer" }} />
              <img src="/icons/mail.png" alt="Email" style={{ width: 40, cursor: "pointer" }} />
            </div>
          </div>
        </div>
        {/* Footer style block */}
        
      </div>
      <Footer />
    </div>
  );
}
