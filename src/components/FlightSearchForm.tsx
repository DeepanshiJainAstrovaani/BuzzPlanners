'use client';

import React, { useState } from 'react';

export default function FlightSearchForm({ onSearch }: { onSearch: Function }) {
    const [from, setFrom] = useState('DEL');
    const [to, setTo] = useState('BOM');
    const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ from, to, departureDate });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-3 border rounded mb-4">
            <div className="row g-3 align-items-center">
                <div className="col-md-3">
                    <label>From</label>
                    <input value={from} onChange={e => setFrom(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-3">
                    <label>To</label>
                    <input value={to} onChange={e => setTo(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-3">
                    <label>Date</label>
                    <input type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} className="form-control" />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary w-100">Search</button>
                </div>
            </div>
        </form>
    );
}
