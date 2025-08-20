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
          <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="row w-100 bg-white shadow my-5" style={{ maxWidth: 1200 }}>
              {/* Left image section */}
              <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center"
                style={{ background: '#C5F3CFEE'}}>
                <img src="/images/traveller.png" width={900} height={600} style={{ objectFit: 'contain', marginLeft:'60%' }} alt="Traveler" />
              </div>
              {/* Right main section */}
              <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
            <h3 className="fw-bold mb-3">Verify Your Mobile Number</h3>
            <div className="mb-3" style={{ color: '#494949', fontSize: 16 }}>
              OTP has been sent to your mobile <b>+91 {mobile}</b>
            </div>
            <form>
              <div className="d-flex gap-2 mb-3 justify-content-between">
                {[...Array(6)].map((_, i) =>
                  <input
                    key={i}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    className="form-control text-center fw-bold"
                    style={{ width: 44, height: 44, fontSize: 20 }}
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
              <div className="mx-2 fs-5 fw-medium">Didn&apos;t receive the code? <span style={{ color: "#0ea473", fontWeight: 500, cursor: "pointer" }}>Send again</span></div>
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
