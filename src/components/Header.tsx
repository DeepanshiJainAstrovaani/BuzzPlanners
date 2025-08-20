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
        <header className="border-bottom bg-white py-2">
            <Container>
                <Row className="align-items-center justify-content-between">

                    {/* Logo Only */}
                    <Col xs="auto">
                        <Link href="/">
                            <Image
                                src="/buzzplannersLogo.png"
                                alt="Buzz Planners"
                                width={150}
                                height={70}
                                style={{ objectFit: 'contain' }}
                            />
                        </Link>
                    </Col>

                    {!isLoginPage && (
                        <Col xs="auto" className="text-end">
                            {/* Top line: Enquiry */}
                            <div
                                className="text-muted fs-7"
                                style={{
                                    fontWeight: 500,
                                    lineHeight: '100%',
                                }}
                            >
                                Having enquiry?{' '}
                                <span
                                    className="text-success"
                                    style={{
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        color: '#14A15F',
                                    }}
                                >
                                    Contact us
                                </span>
                            </div>

                            {/* Bottom line: Vendor + Button */}
                            <div className="d-flex align-items-center justify-content-end gap-3 mt-1">
                                <Link
                                    href="#"
                                    className="d-flex align-items-center gap-1 text-decoration-none"
                                    style={{
                                        fontWeight: 500,
                                        color: '#222222',
                                        lineHeight: '100%',
                                    }}
                                >
                                    <CircleUserRound size={18} />
                                    Become a vendor
                                </Link>

                                <Button
                                    className="rounded-pill px-3 py-2"
                                    style={{
                                        backgroundColor: '#C8E8D9',
                                        color: '#147C2B',
                                        fontWeight: '600',
                                        lineHeight: '100%',
                                        border: 'none',
                                    }}
                                    onClick={() => router.push('/login')}
                                >
                                    Login or Signup
                                </Button>
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </header>
    );
}
