/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { CalendarDays, Plane, Building2, TreePalm, Car } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FlightSearchForm from './FlightSearchForm';
import TravelPackageSearchForm from './TravelPackageSearchForm';
import { useExperience } from '@/context/ExperienceContext';

export default function HeroSearch() {
    const router = useRouter();
    const { active, setActive } = useExperience();

    type TabKey = 'flights' | 'events' | 'hotels' | 'holiday' | 'trips';

    const tabs: { key: TabKey; label: string; Icon: any }[] = [
        { key: 'flights', label: 'Flights', Icon: Plane },
        { key: 'events', label: 'Events', Icon: CalendarDays },
        { key: 'hotels', label: 'Hotels', Icon: Building2 },
        { key: 'holiday', label: 'Holiday', Icon: TreePalm },
        { key: 'trips', label: 'Trips', Icon: Car },
    ];

    function toYMD(d: Date) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    const handleFlightSearch = (params: { from: string; to: string; departureDate: Date }) => {
        const q = new URLSearchParams({ from: params.from, to: params.to, date: toYMD(params.departureDate) });
        router.push(`/flight-search?${q.toString()}`);
    };

    const handleTravelSearch = (params: any) => {
        const q = new URLSearchParams(params as Record<string, string>);
        router.push(`/travel-packages?${q.toString()}`);
    };

    function renderSearchCard() {
        if (active === 'flights') {
            return (
                <div className="bg-white p-2 p-md-3 shadow-sm rounded" style={{ borderRadius: '12px' }}>
                    <FlightSearchForm onSearch={handleFlightSearch} />
                </div>
            );
        }
        if (active === 'hotels' || active === 'holiday' || active === 'trips') {
            return (
                <div className="bg-white p-2 p-md-3 shadow-sm rounded" style={{ borderRadius: '12px' }}>
                    <TravelPackageSearchForm onSearch={handleTravelSearch} defaultDest="KAS" />
                </div>
            );
        }
        // Events placeholder for now
        return (
            <div className="bg-white p-3 p-md-4 shadow-sm rounded" style={{ borderRadius: '12px' }}>
                <div className="d-flex flex-wrap gap-3">
                    <div className="flex-grow-1" style={{ minWidth: 220 }}>
                        <div className="text-muted small mb-1">Event Type</div>
                        <input className="form-control" placeholder="Conference, Wedding, Concert" />
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 220 }}>
                        <div className="text-muted small mb-1">City</div>
                        <input className="form-control" placeholder="City" />
                    </div>
                    <div className="flex-grow-1" style={{ minWidth: 220 }}>
                        <div className="text-muted small mb-1">Date</div>
                        <input type="date" className="form-control" />
                    </div>
                    <div className="d-flex align-items-end" style={{ minWidth: 160 }}>
                        <Button
                            className="w-100 py-2 py-md-3 rounded"
                            style={{ backgroundColor: '#14A15F', color: '#fff', fontWeight: 700, border: 'none' }}
                            onClick={() => { /* TODO: implement events route */ }}
                        >
                            SEARCH
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section style={{ backgroundColor: '#2D3E2E' }}>
            {/* Tabs with Icons */}
            <div style={{ backgroundColor: '#14A15F' }}>
                <Container className="px-2 px-md-3">
                    <Nav className="gap-2 flex-nowrap overflow-auto py-2 py-md-3 px-1" style={{ scrollbarWidth: 'none' }}>
                        {tabs.map(({ key, label, Icon }) => (
                            <Nav.Item key={key}>
                                <Button
                                    size="sm"
                                    variant="light"
                                    className={`rounded-pill d-flex align-items-center gap-2 px-3 py-1 ${active === key ? 'opacity-100' : 'opacity-75'}`}
                                    onClick={() => setActive(key)}
                                    aria-pressed={active === key}
                                >
                                    <Icon size={16} /> {label}
                                </Button>
                            </Nav.Item>
                        ))}
                    </Nav>
                </Container>
            </div>

            <Container className="py-4 py-md-5">
                {/* Top Row */}
                {active === 'flights' ? (
                    <Row className="justify-content-between align-items-center mb-3 g-2">
                        <Col xs="12" md="auto" className="order-2 order-md-1">
                            <div className="d-flex gap-2 justify-content-center justify-content-md-start">
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
                        <Col xs="12" md="auto" className="order-1 order-md-2 text-center text-md-end">
                            <div className="text-light fw-semibold small fs-6 fs-md-5">
                                Guaranteed Lowest Prices
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Row className="mb-3">
                        <Col className="text-center text-md-start">
                            <div className="text-light fw-semibold small fs-6 fs-md-5">
                                Explore {active.charAt(0).toUpperCase() + active.slice(1)} with the best deals
                            </div>
                        </Col>
                    </Row>
                )}

                {/* Dynamic Search Card */}
                {renderSearchCard()}
            </Container>
        </section>
    );
}
