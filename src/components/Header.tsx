'use client';

import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { CircleUserRound } from 'lucide-react';

export default function Header() {
    return (
        <header className="border-bottom bg-white py-2">
            <Container>
                <Row className="align-items-center justify-content-between">

                    {/* Logo Only */}
                    <Col xs="auto">
                        <Image
                            src="/buzzplannersLogo.png"
                            alt="Buzz Planners"
                            width={120}
                            height={40}
                            style={{ objectFit: 'contain' }}
                        />
                    </Col>

                    {/* Contact + Actions */}
                    <Col xs="auto" className="text-end">
                        {/* Top line: Enquiry */}
                        <div
                            className="text-muted"
                            style={{
                                fontSize: '10px',
                                fontWeight: 500,
                                lineHeight: '100%',
                            }}
                        >
                            Having enquiry?{' '}
                            <span
                                className="text-success"
                                style={{
                                    fontSize: '10px',
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
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    color: '#222222',
                                    lineHeight: '100%',
                                }}
                            >
                                <CircleUserRound size={14} />
                                Become a vendor
                            </Link>

                            <Button
                                className="rounded-pill px-3 py-2"
                                style={{
                                    backgroundColor: '#C8E8D9',
                                    color: '#147C2B',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    lineHeight: '100%',
                                    border: 'none',
                                }}
                            >
                                Login or Signup
                            </Button>
                        </div>
                    </Col>

                </Row>
            </Container>
        </header>
    );
}
