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
        <header className="border-bottom bg-white py-1 py-md-2">
            <Container>
                <Row className="align-items-center justify-content-between g-2">

                    {/* Logo Only */}
                    <Col xs="auto">
                        <Link href="/">
                            <Image
                                src="/buzzplannersLogo.png"
                                alt="Buzz Planners"
                                width={90}
                                height={40}
                                style={{ objectFit: 'contain' }}
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
                            <div className="d-flex align-items-center justify-content-end gap-2 mt-0 mt-md-1 flex-row flex-wrap">
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
                                    <span>Become a vendor</span>
                                </Link>

                                {/* Compact Contact us on small screens */}
                                <Link
                                    href="/#contact"
                                    className="text-success text-decoration-none d-inline d-md-none"
                                    style={{ fontSize: 12, fontWeight: 500 }}
                                >
                                    Contact us
                                </Link>

                                <Button
                                    size="sm"
                                    className="rounded-pill px-2 py-1 px-md-3 py-md-2"
                                    style={{
                                        backgroundColor: '#C8E8D9',
                                        color: '#147C2B',
                                        fontWeight: 600,
                                        lineHeight: '100%',
                                        border: 'none',
                                        fontSize: 12,
                                    }}
                                    onClick={() => router.push('/login')}
                                >
                                    <span className="d-inline d-sm-none">Login</span>
                                    <span className="d-none d-sm-inline">Login or Signup</span>
                                </Button>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </header>
    );
}
