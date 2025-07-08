'use client';

import { Container, Row, Col, Button, Form, Nav } from 'react-bootstrap';
import { CalendarDays, Plane, Building2, TreePalm, Car } from 'lucide-react';
import AirportAutocomplete from './AirportAutocomplete';
import { useState } from 'react';
import { Place } from '../../types/types';

export default function HeroSearch() {
    const [from, setFrom] = useState<Place | null>(null);
    const [to, setTo] = useState<Place | null>(null);
    return (
        
        <section style={{ backgroundColor: '#2D3E2E' }}>
            <AirportAutocomplete label="From" onSelect={setFrom} />
    <AirportAutocomplete label="To" onSelect={setTo} />
            {/* Tabs with Icons */}
            <Nav className="mb-4 gap-3" style={{ backgroundColor: '#14A15F', padding: '0.5rem 5rem'}}>
                <Nav.Item>
                    <Button variant="light" className="rounded-pill d-flex align-items-center gap-2 px-3 py-1">
                        <Plane size={16} /> Flights
                    </Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="light" className="rounded-pill d-flex align-items-center gap-2 px-3 py-1">
                        <CalendarDays size={16} /> Events
                    </Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="light" className="rounded-pill d-flex align-items-center gap-2 px-3 py-1">
                        <Building2 size={16} /> Hotels
                    </Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="light" className="rounded-pill d-flex align-items-center gap-2 px-3 py-1">
                        <TreePalm size={16} /> Holiday
                    </Button>
                </Nav.Item>
                <Nav.Item>
                    <Button variant="light" className="rounded-pill d-flex align-items-center gap-2 px-3 py-1">
                        <Car size={16} /> Trips
                    </Button>
                </Nav.Item>
            </Nav>
            <Container className="py-5 my-5">
                {/* Top Row */}
                <Row className="justify-content-between align-items-center mb-3">
                    <Col md="auto">
                        <div className="d-flex gap-2">
                            <Button
                                variant="success"
                                className="badge fw-semibold px-3 py-2"
                                style={{ backgroundColor: '#33A46F' }}
                            >
                                One Way
                            </Button>
                            <Button variant="light" className="badge fw-semibold text-dark px-3 py-2">
                                Round Trip
                            </Button>
                        </div>
                    </Col>
                    <Col md="auto">
                        <div className="text-light fw-semibold small fs-4">
                            Guaranteed Lowest Prices
                        </div>
                    </Col>
                </Row>

                {/* Search Card */}
                <div
                    className="bg-white p-3 shadow-sm d-flex flex-wrap rounded"
                    style={{ borderRadius: '12px' }}
                >
                    {[
                        {
                            label: 'FROM',
                            title: 'Delhi',
                            subtitle: '(DEL) – Indira Gandhi International',
                        },
                        {
                            label: 'TO',
                            title: 'Mumbai',
                            subtitle: '(BOM) – Chhatrapati Shivaji International',
                        },
                        {
                            label: 'DEPARTURE DATE',
                            title: '10 Jul 2025',
                            subtitle: 'Thursday',
                        },
                        {
                            label: 'RETURN DATE',
                            title: 'Book a round trip',
                            subtitle: '',
                        },
                        {
                            label: 'TRAVELLER',
                            title: '1 Traveller',
                            subtitle: 'Economy',
                        },
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="px-3 py-2"
                            style={{
                                borderRight: idx < 4 ? '1px solid #dee2e6' : 'none',
                                flex: '1',
                                minWidth: '160px',
                            }}
                        >
                            <div className="text-muted small mb-1">{item.label}</div>
                            <div className="fw-bold">{item.title}</div>
                            <div className="small text-muted">{item.subtitle}</div>
                        </div>
                    ))}

                    {/* Search Button */}
                    <div className="d-flex align-items-center justify-content-center px-3" style={{ minWidth: '160px' }}>
                        <Button
                            className="w-100 py-3 rounded"
                            style={{
                                backgroundColor: '#14A15F',
                                color: '#fff',
                                fontWeight: 700,
                                border: 'none',
                            }}
                        >
                            SEARCH
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
