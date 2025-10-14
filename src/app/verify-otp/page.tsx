/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */

// app/login/verify-otp.tsx (or shown conditionally after LoginPage)
'use client';
import Footer from '@/components/Footer';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function OTPVerify() {
  const [otp, setOTP] = useState('');
  // TODO: Replace this with the actual mobile number, possibly via props or context
  const mobile = 'XXXXXXXXXX';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8' }}>
            <Header />
          <div className="container-fluid px-3 px-md-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div className="row w-100 bg-white shadow rounded-3 overflow-hidden" style={{ maxWidth: 'min(1200px, 95vw)', margin: '0 auto' }}>
              {/* Left image section */}
              <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center"
                style={{ background: '#C5F3CFEE', minHeight: '500px' }}>
                <img src="/images/traveller.png" 
                     style={{ 
                       width: '100%', 
                       height: 'auto', 
                       maxWidth: '400px', 
                       objectFit: 'contain',
                       transform: 'translateX(20%)'
                     }} 
                     alt="Traveler" />
              </div>
              {/* Right main section */}
              <div className="col-12 col-md-6 p-3 p-sm-4 p-md-5 d-flex flex-column justify-content-center" style={{ minHeight: '400px' }}>
            <h3 className="fw-bold mb-3 text-center text-md-start" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Verify Your Mobile Number</h3>
            <div className="mb-4 text-center text-md-start" style={{ color: '#494949', fontSize: 'clamp(14px, 3vw, 16px)', lineHeight: 1.5 }}>
              OTP has been sent to your mobile <b>+91 {mobile}</b>
            </div>
            <form>
              <div className="d-flex gap-2 mb-4 justify-content-center justify-content-md-start" style={{ flexWrap: 'wrap' }}>
                {[...Array(6)].map((_, i) =>
                  <input
                    key={i}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    className="form-control text-center fw-bold"
                    style={{ 
                      width: 'clamp(38px, 8vw, 44px)', 
                      height: 'clamp(38px, 8vw, 44px)', 
                      fontSize: 'clamp(16px, 4vw, 20px)',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    value={otp[i] || ''}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/, '');
                      setOTP(prev => prev.slice(0, i) + v + prev.slice(i + 1));
                      // Optionally, auto-focus next input
                      if (v && i < 5) {
                        const next = document.getElementById(`otp-${i + 1}`);
                        next && (next as HTMLElement).focus();
                      }
                    }}
                    id={`otp-${i}`}
                  />
                )}
              </div>
              <Link href="/flight-search">
              
              <button type="submit" className="btn btn-success w-100 fw-bold" style={{ height: 48, fontSize: 18 }}
              
              >
                Submit
              </button>
              </Link>
            </form>
            <div className="d-flex align-items-center my-3" style={{ color: '#bbb' }}>
              <div className="flex-grow-1" style={{ height: 1, background: '#eee' }}></div>
              <div className="mx-2 fs-6 fw-medium">Didn&apos;t receive the code? <span style={{ color: "#0ea473", fontWeight: 500, cursor: "pointer" }}>Send again</span></div>
              <div className="flex-grow-1" style={{ height: 1, background: '#eee' }}></div>
            </div>
            
          </div>
            </div>
            {/* Footer style block */}
            
          </div>
          <Footer />
        </div>
  );
}

// Reuse <FooterLogin /> from above
