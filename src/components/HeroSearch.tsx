'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { CalendarDays, Plane, Building2, TreePalm, Car } from 'lucide-react';
import { useRouter } from 'next/navigation';
import FlightSearchForm from './FlightSearchForm';
import TravelPackageSearchForm from './TravelPackageSearchForm';
import HotelSearchForm from './HotelSearchForm';
import { useExperience } from '@/context/ExperienceContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function HeroSearch() {
    const router = useRouter();
    const { active, setActive } = useExperience();
    const [isMobile, setIsMobile] = useState(false);
    const [eventDate, setEventDate] = useState(new Date());

    useEffect(() => {
        const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 576);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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

    const handleHotelSearch = (params: any) => {
        const q = new URLSearchParams(params as Record<string, string>);
        router.push(`/hotels?${q.toString()}`);
    };

    function renderSearchCard() {
        if (active === 'flights') {
            return (
                <div>
                    <FlightSearchForm onSearch={handleFlightSearch} />
                </div>
            );
        }
        if (active === 'hotels') {
            return (
                <div>
                    <HotelSearchForm onSearch={handleHotelSearch} defaultDest="NAI" />
                </div>
            );
        }
        if (active === 'holiday' || active === 'trips') {
            return (
                <div>
                    <TravelPackageSearchForm onSearch={handleTravelSearch} defaultDest="KAS" />
                </div>
            );
        }
        // Events search form - responsive layout
        if (isMobile) {
            // Mobile vertical layout
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Form Container */}
                    <div className="bg-white shadow" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            {/* EVENT TYPE */}
                            <div style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                                <div className="text-muted mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>EVENT TYPE</div>
                                <input 
                                    className="border-0 p-0 fw-bold events-input" 
                                    placeholder="Conference, Wedding"
                                    style={{ fontSize: '16px', boxShadow: 'none', color: '#000', background: 'transparent', padding:'0 !important' }}
                                />
                            </div>

                            {/* CITY */}
                            <div style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                                <div className="text-muted mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CITY</div>
                                <input 
                                    className="border-0 p-0 fw-bold events-input" 
                                    placeholder="Enter city"
                                    style={{ fontSize: '16px', boxShadow: 'none', color: '#000', background: 'transparent', padding:'0px !important' }}
                                />
                            </div>

                            {/* DATE */}
                            <div style={{ padding: '16px', borderBottom: '1px solid #e9ecef' }}>
                                <div className="text-muted mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>EVENT DATE</div>
                                <DatePicker
                                    selected={eventDate}
                                    onChange={(date: Date | null) => setEventDate(date || new Date())}
                                    dateFormat="dd MMMM yyyy"
                                    minDate={new Date()}
                                    className="border-0 p-0 fw-bold events-datepicker"
                                    placeholderText="Select date"
                                />
                            </div>

                            {/* CATEGORY */}
                            <div style={{ padding: '16px' }}>
                                <div className="text-muted mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CATEGORY</div>
                                <select 
                                    className="events-select border-0 fw-bold" 
                                    style={{ 
                                        fontSize: '16px', 
                                        boxShadow: 'none', 
                                        background: 'transparent', 
                                        color: '#000', 
                                        padding: '0',
                                        width: '100%',
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none',
                                        outline: 'none'
                                    }}
                                >
                                    <option>All Events</option>
                                    <option>Conference</option>
                                    <option>Wedding</option>
                                    <option>Concert</option>
                                    <option>Exhibition</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    {/* Search Button - Outside Form */}
                    <div style={{ 
                        backgroundColor: '#14A15F', 
                        borderRadius: '12px', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Button
                            className="fw-bold text-white w-100"
                            style={{ 
                                backgroundColor: 'transparent', 
                                border: 'none',
                                height: '50px',
                                fontSize: '16px',
                                boxShadow: 'none'
                            }}
                            onClick={() => { /* TODO: implement events route */ }}
                        >
                            SEARCH
                        </Button>
                    </div>
                </div>
            );
        }

        // Desktop horizontal layout
        return (
            <div className="w-100" style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
                <form
                    className="bg-white p-4 rounded-start-4 shadow d-flex align-items-center gap-3"
                    style={{ 
                        flexGrow: 1, 
                        border: '1px solid #ddd', 
                        borderRight: 'none',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0
                    }}
                    onSubmit={(e) => e.preventDefault()}
                >
                    {/* EVENT TYPE */}
                    <div className="px-3 border-end" style={{ width: '30%', minWidth: '200px' }}>
                        <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>EVENT TYPE</div>
                        <input 
                            className="form-control border-0 p-0 fw-bold events-input" 
                            placeholder="Conference, Wedding"
                            style={{ fontSize: '1.2rem', boxShadow: 'none', color: '#000' }}
                        />
                    </div>

                    {/* CITY */}
                    <div className="px-3 border-end" style={{ width: '25%', minWidth: '150px' }}>
                        <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>CITY</div>
                        <input 
                            className="form-control border-0 p-0 fw-bold events-input" 
                            placeholder="Enter city"
                            style={{ fontSize: '1.2rem', boxShadow: 'none', color: '#000' }}
                        />
                    </div>

                    {/* DATE */}
                    <div className="px-3 border-end" style={{ width: '25%', minWidth: '150px' }}>
                        <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>EVENT DATE</div>
                        <DatePicker
                            selected={eventDate}
                            onChange={(date: Date | null) => setEventDate(date || new Date())}
                            dateFormat="dd MMMM yyyy"
                            minDate={new Date()}
                            className="form-control border-0 p-0 fw-bold events-datepicker"
                            placeholderText="Select date"
                        />
                    </div>

                    {/* CATEGORY */}
                    <div className="px-3" style={{ width: '20%', minWidth: '120px' }}>
                        <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>CATEGORY</div>
                        <select 
                            className="form-control border-0 p-0 fw-bold" 
                            style={{ fontSize: '1.2rem', boxShadow: 'none' }}
                        >
                            <option>All Events</option>
                            <option>Conference</option>
                            <option>Wedding</option>
                            <option>Concert</option>
                            <option>Exhibition</option>
                        </select>
                    </div>
                </form>

                {/* SEARCH BUTTON */}
                <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                    <Button
                        className="fw-bold text-white"
                        style={{ 
                            backgroundColor: '#14A15F', 
                            border: 'none',
                            borderTopLeftRadius: 0, 
                            borderBottomLeftRadius: 0,
                            borderTopRightRadius: 12,
                            borderBottomRightRadius: 12,
                            height: '100%',
                            padding: '0 30px',
                            fontSize: '1rem'
                        }}
                        onClick={() => { /* TODO: implement events route */ }}
                    >
                        SEARCH
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
        <section style={{ backgroundColor: '#2D3E2E' }}>
            {/* Tabs with Icons */}
            <div style={{ backgroundColor: '#14A15F' }}>
                <div className="px-2 px-md-5 py-2">
                    <Nav className="gap-2 flex-nowrap overflow-auto py-md-1 px-1" style={{ scrollbarWidth: 'none' }}>
                        {tabs.map(({ key, label, Icon }) => (
                            <Nav.Item key={key}>
                                <Button
                                    size="sm"
                                    variant="light"
                                    className={`rounded-pill d-flex align-items-center gap-2 px-3 py-2 ${active === key ? 'opacity-75' : 'opacity-100'}`}
                                    onClick={() => setActive(key)}
                                    aria-pressed={active === key}
                                    style={{ fontWeight: 500, fontSize: 14, color: active === key ? '#147C2B' : 'black' }}
                                >
                                    <Icon size={20} /> {label}
                                </Button>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>
            </div>

            <Container
                className="px-2 px-md-5"
                style={{
                    paddingTop: isMobile ? '2rem' : '7rem',
                    paddingBottom: isMobile ? '2rem' : '7rem',
                }}
            >
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
                            <div className="text-light fw-semibold" style={{ fontSize: '1.8rem' }}>
                                Guaranteed Lowest Prices
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <Row className="mb-3">
                        <Col className="text-center text-md-start">
                            <div className="text-light fw-semibold small fs-3 fs-md-5">
                                Explore {active.charAt(0).toUpperCase() + active.slice(1)} with the best deals
                            </div>
                        </Col>
                    </Row>
                )}

                {/* Dynamic Search Card */}
                {renderSearchCard()}
            </Container>
        </section>
        
        <style jsx>{`
            :global(.events-input::placeholder) {
                color: #000 !important;
                opacity: 0.8 !important;
            }
            
            :global(.events-input::-webkit-input-placeholder) {
                color: #000 !important;
                opacity: 0.8 !important;
            }
            
            :global(.events-input::-moz-placeholder) {
                color: #000 !important;
                opacity: 0.8 !important;
            }
            
            :global(.events-input:-ms-input-placeholder) {
                color: #000 !important;
                opacity: 0.8 !important;
            }

            /* DatePicker Styling */
            :global(.events-datepicker) {
                font-size: 1.2rem !important;
                color: #000 !important;
                background: transparent !important;
                cursor: pointer !important;
                outline: none !important;
                box-shadow: none !important;
            }

            :global(.events-datepicker:focus) {
                outline: none !important;
                box-shadow: none !important;
                border-color: transparent !important;
            }

            :global(.events-datepicker::placeholder) {
                color: #000 !important;
                opacity: 0.8 !important;
            }

            /* React DatePicker popup styling */
            :global(.react-datepicker) {
                border: 1px solid #ddd !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                font-family: inherit !important;
            }

            :global(.react-datepicker__header) {
                background-color: #14A15F !important;
                border-bottom: 1px solid #14A15F !important;
                border-radius: 8px 8px 0 0 !important;
            }

            :global(.react-datepicker__current-month),
            :global(.react-datepicker__day-name) {
                color: white !important;
                font-weight: 600 !important;
            }

            :global(.react-datepicker__day) {
                color: #333 !important;
                border-radius: 4px !important;
            }

            :global(.react-datepicker__day:hover) {
                background-color: #e8f5e8 !important;
                color: #14A15F !important;
            }

            :global(.react-datepicker__day--selected) {
                background-color: #14A15F !important;
                color: white !important;
            }

            :global(.react-datepicker__day--today) {
                background-color: #f0f8f0 !important;
                color: #14A15F !important;
                font-weight: 600 !important;
            }

            :global(.react-datepicker__navigation) {
                top: 8% !important;
                transform: translateY(-50%) !important;
                margin-top: 0 !important;
                width: 0 !important;
                height: 0 !important;
                border: none !important;
            }

            :global(.react-datepicker__navigation--previous) {
                left: 12px !important;
                border-right: 8px solid white !important;
                border-top: 6px solid transparent !important;
                border-bottom: 6px solid transparent !important;
                border-left: none !important;
            }

            :global(.react-datepicker__navigation--next) {
                right: 12px !important;
                border-left: 8px solid white !important;
                border-top: 6px solid transparent !important;
                border-bottom: 6px solid transparent !important;
                border-right: none !important;
            }

            /* Mobile Events Form Styles */
            @media (max-width: 576px) {
                :global(.events-datepicker) {
                    font-size: 16px !important;
                    background: transparent !important;
                }
                
                :global(.events-input) {
                    font-size: 16px !important;
                    background: transparent !important;
                }
                
                :global(.events-input:focus) {
                    background: transparent !important;
                    outline: none !important;
                    box-shadow: none !important;
                }
            }
        `}</style>
        </>
    );
}
