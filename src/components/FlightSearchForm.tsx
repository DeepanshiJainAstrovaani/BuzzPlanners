'use client';

import React, { useState } from 'react';
import AirportSelect from './AirportSelect';

export default function FlightSearchForm({ onSearch }: { onSearch: Function }) {
    const [from, setFrom] = useState<{ label: string; value: string } | null>(null);
    const [to, setTo] = useState<{ label: string; value: string } | null>(null);
    const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
    const [returnDate] = useState<string>('');
    const [traveller] = useState({ count: 1, class: 'Economy' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!from?.value || !to?.value) return;
        onSearch({ from: from.value, to: to.value, departureDate });
    };

    return (
        <div className='d-flex col-12' style={{ width: '100%' }}>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-4 rounded-start-4 shadow d-flex flex-wrap align-items-end gap-3 col-10"
                style={{
                    flexGrow: 1,
                    border: '1px solid #ddd',
                    borderRight: 'none', // Remove right border to merge with button
                }}
            >
                {/* FROM */}
                <div className="col-3">
                    <div className="text-xs text-secondary fw-semibold mb-1 fs-5">FROM</div>
                    <AirportSelect label="" value={from} onChange={setFrom} />
                </div>

                {/* TO */}
                <div className="col-3">
                    <div className="text-xs text-secondary fw-semibold mb-1 fs-5">TO</div>
                    <AirportSelect label="" value={to} onChange={setTo} />
                </div>

                {/* DEPARTURE DATE */}
                <div className="col-3">
                    <div className="text-xs text-secondary fw-semibold mb-4 fs-5">DEPARTURE DATE</div>
                    <div className="mb-3">
                        <input
                            type="date"
                            value={departureDate}
                            onChange={e => setDepartureDate(e.target.value)}
                            className="form-control"
                            style={{ height: 40 }}
                        />
                    </div>
                </div>

                {/* RETURN DATE */}
                <div className="col-2">
                    <div className="text-xs text-secondary fw-semibold mb-4 fs-5">RETURN DATE</div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control text-muted"
                            placeholder="Book a round trip"
                            disabled
                            style={{ height: 40 }}
                        />
                    </div>
                </div>

                {/* TRAVELLER */}
                {/* <div className="col-2">
                    <div className="text-xs text-secondary fw-semibold mb-4 fs-5">TRAVELLER</div>
                    <div className="mb-3">
                        <div
                            className="form-control bg-light text-dark"
                            style={{
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0 12px',
                            }}
                        >
                            {traveller.count} Traveller{traveller.count > 1 ? 's' : ''} • {traveller.class}
                        </div>
                    </div>
                </div> */}
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