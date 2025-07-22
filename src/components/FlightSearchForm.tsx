'use client';

import React, { useState } from 'react';
import AirportSelect from './AirportSelect';

export default function FlightSearchForm({ onSearch }: { onSearch: Function }) {
  const [from, setFrom] = useState<{ label: string; value: string } | null>(null);
  const [to, setTo] = useState<{ label: string; value: string } | null>(null);
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);

  // For visual/UX parity with screenshot2
  const [returnDate] = useState<string>(''); // Placeholder, not yet functional
  const [traveller] = useState({ count: 1, class: 'Economy' }); // Static for now

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from?.value || !to?.value) return;
    onSearch({ from: from.value, to: to.value, departureDate });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-100 bg-white p-4 rounded-3 shadow flex items-end gap-3"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderRadius: '0.75rem',
      }}
    >
      {/* FROM */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <div className="text-xs font-semibold text-gray-500 mb-1">FROM</div>
        <AirportSelect label="" value={from} onChange={setFrom} />
      </div>
      {/* TO */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <div className="text-xs font-semibold text-gray-500 mb-1">TO</div>
        <AirportSelect label="" value={to} onChange={setTo} />
      </div>
      {/* DEPARTURE DATE */}
      <div style={{ minWidth: 180 }}>
        <div className="text-xs font-semibold text-gray-500 mb-1">DEPARTURE DATE</div>
        <input
          type="date"
          value={departureDate}
          onChange={e => setDepartureDate(e.target.value)}
          className="form-control border rounded py-2 px-3 w-full"
          style={{height: 40}}
        />
      </div>
      {/* RETURN DATE (placeholder) */}
      <div style={{ minWidth: 180 }}>
        <div className="text-xs font-semibold text-gray-500 mb-1">RETURN DATE</div>
        <input
          type="text"
          className="form-control border rounded py-2 px-3 w-full text-gray-400"
          style={{height: 40}}
          placeholder="Book a round trip"
          disabled
        />
      </div>
      {/* TRAVELLER */}
      <div style={{ minWidth: 120 }}>
        <div className="text-xs font-semibold text-gray-500 mb-1">TRAVELLER</div>
        <div
          className="border rounded px-3 py-2 bg-gray-50 text-gray-600"
          style={{height: 40, display: 'flex', alignItems: 'center'}}
        >
          {traveller.count} Traveller{traveller.count > 1 ? 's' : ''} <span className="mx-1">•</span> {traveller.class}
        </div>
      </div>
      {/* SEARCH BUTTON */}
      <div>
        <button
          type="submit"
          style={{ height: 48, minWidth: 100, borderRadius: 25 }}
          className="btn btn-success px-4 text-white fw-bold"
        >
          SEARCH
        </button>
      </div>
    </form>
  );
}
