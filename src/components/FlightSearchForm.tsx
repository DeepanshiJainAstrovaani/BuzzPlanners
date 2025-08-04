'use client';

import React, { useEffect, useRef, useState } from 'react';
import AirportSelect from './AirportSelect'; // assumes custom dropdown component with search
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './FlightSearchForm.module.css';

export default function FlightSearchForm({ onSearch }: { onSearch: Function }) {
    const [from, setFrom] = useState<{ label: string; sublabel?: string; value: string } | null>(null);
    const [to, setTo] = useState<{ label: string; sublabel?: string; value: string } | null>(null);
    const today = new Date();
    const [departureDate, setDepartureDate] = useState<Date>(today);
    const [returnDate, setReturnDate] = useState<Date>(addDays(today, 2));
    const [calendarOpen, setCalendarOpen] = useState<'departure' | 'return' | null>(null);
    const nextDayAfterDeparture = new Date(departureDate.getTime() + 86400000);
    const calendarRef = useRef<HTMLDivElement>(null);

    // Helper for formatting
    function formatDate(d: Date) {
        return d.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    }
    function formatWeekday(d: Date) {
        return d.toLocaleDateString('en-GB', { weekday: 'long' });
    }

    function addDays(date: Date, days: number) {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    }


    // Ensure return date is always after departure
    function handleDepartureSelect(date: Date | undefined) {
        if (!date) return;
        setDepartureDate(date);
        // Auto-fix return date if it became before departure
        if (returnDate <= date) {
            setReturnDate(addDays(date, 1));
        }
        setCalendarOpen(null);
    }
    function handleReturnSelect(date: Date | undefined) {
        if (!date) return;
        setReturnDate(date);
        setCalendarOpen(null);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!from?.value || !to?.value) return;
        onSearch({ from: from.value, to: to.value, departureDate });
    };

    useEffect(() => {
        // Set to whichever default you want
        setFrom({
            label: "New Delhi",
            sublabel: "New Delhi Indira Gandhi (DEL)",
            value: "DEL"
        })
        setTo({
            label: "Del Rio",
            sublabel: "Del Rio Laughlin Air Force Base (DLF)",
            value: "DEL"
        });
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setCalendarOpen(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='d-flex col-12' style={{ width: '100%' }}>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-3 rounded-start-4 shadow d-flex flex-row align-items-center gap-3 col-10"
                style={{
                    flexGrow: 1,
                    border: '1px solid #ddd',
                    borderRight: 'none',
                }}
            >
                {/* FROM */}
                <div className="px-3 border-end" style={{ width: '20%' }}>
                    <div className="text-muted fs-5 mb-1">FROM</div>

                    <AirportSelect label="From" value={from} onChange={setFrom} />
                </div>

                {/* TO */}
                <div className="px-3 border-end" style={{ width: '20%' }}>
                    <div className="text-muted fs-5 mb-1">TO</div>
                    <AirportSelect label="To" value={to} onChange={setTo} />
                </div>

                {/* DEPARTURE DATE */}
                <div className="px-3 border-end" style={{ position: 'relative', width: '20%' }}>
                    <div className="text-muted fs-5 mb-1">DEPARTURE DATE</div>
                    <div
                        className="fs-4 fw-bold"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCalendarOpen('departure')}
                    >
                        {formatDate(departureDate)}
                    </div>
                    <div className="text-muted small">
                        {formatWeekday(departureDate)}
                    </div>
                    {calendarOpen === 'departure' &&
                        <div
                            ref={calendarRef}
                            style={{
                                position: 'absolute',
                                background: '#fff', zIndex: 100,
                                boxShadow: '-5px 0 5px -5px #8e8787'
                            }}
                        >
                            <Calendar
                                value={departureDate}
                                onChange={(date) => handleDepartureSelect(date as Date)}
                                minDate={today}
                                tileDisabled={({ date }) => date < today}
                                locale="en-GB"
                            />
                        </div>
                    }
                </div>

                {/* RETURN DATE */}
                <div className="px-3 border-end" style={{ position: 'relative', width: '20%' }}>
                    <div className="text-muted fs-5 mb-1">RETURN DATE</div>
                    <div
                        className="fs-4 fw-bold displayBox"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setCalendarOpen('return')}
                    >
                        {formatDate(returnDate)}
                    </div>
                    <div className="text-muted small">
                        {formatWeekday(returnDate)}
                    </div>
                    {calendarOpen === 'return' &&
                        <div
                            ref={calendarRef}
                            style={{
                                position: 'absolute',
                                background: '#fff', zIndex: 100,
                                boxShadow: '-5px 0 5px -5px #8e8787'
                            }}
                        >
                            <Calendar
                                value={returnDate}
                                onChange={(date) => handleReturnSelect(date as Date)}
                                minDate={addDays(departureDate, 1)}
                                tileDisabled={({ date }) => date <= departureDate}
                                locale="en-GB"
                            />
                        </div>
                    }
                </div>

                {/* TRAVELLER */}
                <div className="px-3 col-2">
                    <div className="text-muted fs-5 mb-1">TRAVELLER</div>
                    <div className="fs-4 fw-bold">1 Traveller</div>
                    <div className="text-muted small">Economy</div>
                </div>
            </form>

            {/* SEARCH BUTTON */}
            <button
                type="submit"
                className="btn btn-success fw-bold text-white"
                style={{
                    padding: '0 30px',
                    fontSize: '1.5rem',
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: '1rem',
                    borderBottomRightRadius: '1rem',
                    whiteSpace: 'nowrap',
                }}
                onClick={handleSubmit}
            >
                SEARCH
            </button>
        </div>
    );
}
