'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CircleUserRound } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const isLoginPage = pathname === '/login';
    return (
        <header className="border-bottom bg-white py-2 py-md-3 px-3 px-md-5">
            <Container fluid className="container">
                <Row className="align-items-center justify-content-between g-2">
                    {/* Logo */}
                    <Col xs="auto" className="pe-0">
                        <Link href="/" className="d-inline-block">
                            <Image
                                src="/buzzplannersLogo.png"
                                alt="Buzz Planners"
                                width={100}
                                height={80}
                                style={{ objectFit: 'contain', maxWidth: '160px', height: 'auto' }}
                                priority
                            />
                        </Link>
                    </Col>

                    {!isLoginPage && (
                        <Col xs="auto" className="ms-auto text-end">
                            {/* Top line: Enquiry (visible on md+) */}
                            <div
                                className="text-muted d-none d-md-block"
                                style={{
                                    fontWeight: 500,
                                    lineHeight: '100%',
                                    fontSize: 12,
                                }}
                            >
                                Having enquiry?{' '}
                                <Link
                                    href="/#contact"
                                    className="text-success text-decoration-none"
                                    style={{ fontWeight: 500, color: '#14A15F', cursor: 'pointer' }}
                                >
                                    Contact us
                                </Link>
                            </div>

                            {/* Bottom line: Vendor + Contact (xs) + Button */}
                            <div className="header-actions d-flex align-items-center justify-content-end gap-2 mt-1">
                                <div className="header-actions-top d-flex align-items-center gap-1">
                                    <Link
                                        href="#"
                                        className="d-flex align-items-center gap-1 text-decoration-none"
                                        style={{
                                            fontWeight: 500,
                                            color: '#222222',
                                            lineHeight: '100%',
                                            fontSize: 12,
                                        }}
                                        aria-label="Become a vendor"
                                    >
                                        <CircleUserRound size={18} />
                                        <span className="d-none d-sm-inline">Become a vendor</span>
                                        <span className="d-inline d-sm-none" style={{ fontSize: 12 }}>Become a Vendor</span>
                                    </Link>

                                    {/* Compact Contact shown on xs */}
                                    {/* <Link
                                        href="/#contact"
                                        className="text-success text-decoration-none d-inline d-md-none"
                                        style={{ fontSize: 12, fontWeight: 500 }}
                                    >
                                        Contact Us
                                    </Link> */}
                                </div>

                                <div className="header-actions-btn">
                                    <Button
                                        size="sm"
                                        className="rounded-pill"
                                        style={{
                                            backgroundColor: '#C8E8D9',
                                            color: '#147C2B',
                                            fontWeight: 600,
                                            lineHeight: '100%',
                                            border: 'none',
                                            fontSize: 12,
                                            padding: '0.35rem 0.9rem',
                                        }}
                                        onClick={() => router.push('/login')}
                                    >
                                        <span className="d-inline d-sm-none">Login or Signup</span>
                                        <span className="d-none d-sm-inline">Login or Signup</span>
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>

            {/* Mobile-only scoped overrides: vendor + contact above button on small screens */}
            <style jsx>{`
                @media (max-width: 600px) {
                    /* keep header row from wrapping */
                    .border-bottom > .container .row {
                        align-items: center !important;
                        flex-wrap: nowrap !important;
                        gap: 0.35rem !important;
                    }

                    /* stack vendor/contact above the login button on mobile, right aligned */
                    .header-actions {
                        flex-direction: column;
                        align-items: flex-end;
                        gap: 0.25rem;
                    }
                    .header-actions-top {
                        width: 100%;
                        display: flex;
                        justify-content: flex-end;
                        gap: 0.5rem;
                    }
                    .header-actions-btn {
                        width: 100%;
                        display: flex;
                        justify-content: flex-end;
                    }

                    /* ensure compact labels show correctly on xs */
                    .header-actions .d-none.d-sm-inline {
                        display: none !important;
                    }
                    .header-actions .d-inline.d-sm-none {
                        display: inline !important;
                    }
                    .header-actions .d-inline.d-md-none {
                        display: inline !important;
                    }

                    /* tighten login button vertically */
                    .header-actions-btn button.rounded-pill {
                        padding: 0.28rem 0.6rem !important;
                        font-size: 0.95rem !important;
                        line-height: 1 !important;
                    }

                    /* slightly smaller logo to preserve space */
                    .border-bottom img {
                        max-width: 120px !important;
                        height: auto !important;
                        display: inline-block;
                    }
                }
            `}</style>
        </header>
    );
}
