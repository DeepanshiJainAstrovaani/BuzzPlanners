/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from 'react';
import SearchableSelect from './SearchableSelect';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function TravelPackageSearchForm({ onSearch, defaultDest }: { onSearch: Function, defaultDest: string }) {
  const [destination, setDestination] = useState<{ label: string; sublabel?: string; value: string } | null>(null);
  const [pickFrom, setPickFrom] = useState<{ label: string; sublabel?: string; value: string } | null>(null);
  const today = new Date();
  const [departureDate, setDepartureDate] = useState<Date>(today);
  const [returnDate, setReturnDate] = useState<Date>(addDays(today, 2));
  const [accommodation, setAccommodation] = useState(["5 Star"]);
  const [traveller, setTraveller] = useState(1);
  const [calendarOpen, setCalendarOpen] = useState<'departure' | 'return' | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  // Static list of destinations
  const DESTINATION_OPTIONS = [
    { label: 'Kasauli', value: 'KAS', sublabel: 'Kasauli, Himachal Pradesh' },
    { label: 'Nainital', value: 'NAI', sublabel: 'Nainital, Uttarakhand' },
    { label: 'Mukteshwar', value: 'MUK', sublabel: 'Mukteshwar, Uttarakhand' },
    { label: 'Rishikesh', value: 'RIS', sublabel: 'Rishikesh, Uttarakhand' },
    { label: 'Manali', value: 'MAN', sublabel: 'Manali, Himachal Pradesh' },
    { label: 'Dehradun', value: 'DEE', sublabel: 'Dehradun, Uttarakhand' }
  ];
  // Pickup points
  const PICKFROM_OPTIONS = [
    { label: 'Kashmeri Gate', value: 'KGT', sublabel: 'Delhi ISBT Kashmeri Gate' },
    { label: 'RK Ashram', value: 'RKA', sublabel: 'RK Ashram Metro Station' },
    { label: 'Majnu Ka Tila', value: 'MKT', sublabel: 'Majnu Ka Tila Bus Stop' },
    { label: 'Haldwani', value: 'HDW', sublabel: 'Haldwani Bus Stand' }
  ];

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


  useEffect(() => {
    setDestination(DESTINATION_OPTIONS[0]); // default Kasauli
    setPickFrom(PICKFROM_OPTIONS[0]); // default pickup
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !pickFrom) return;
    onSearch({
      destination: destination.value,
      pickFrom: pickFrom.value
    });
  };

  return (
    <div className='d-flex col-12' style={{ width: '100%' }}>
      <form onSubmit={handleSubmit} className="d-flex flex-row align-items-center gap-3 bg-white p-3 rounded-start-4 shadow col-10"
        style={{
          flexGrow: 1,
          border: '1px solid #ddd',
          borderRight: 'none',
        }}>
        {/* Destination */}
        <div className="px-3 border-end" style={{ width: '20%' }}>
          <div className="text-muted fs-5 mb-1">DESTINATION</div>
          <SearchableSelect
            label="Destination"
            value={destination}
            onChange={setDestination}
            optionsList={DESTINATION_OPTIONS}
          />
        </div>
        {/* Pickup */}
        <div className="px-3 border-end" style={{ width: '20%' }}>
          <div className="text-muted fs-5 mb-1">PICK FROM</div>
          <SearchableSelect
            label="Pick From"
            value={pickFrom}
            onChange={setPickFrom}
            optionsList={PICKFROM_OPTIONS}
          />
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
        {/* Accommodation */}
        <div className="px-3 col-2 border-end" style={{ position: 'relative', width: '20%' }}>
          <div className="text-muted fs-5 mb-1">ACCOMODATION</div>
          <div className="fs-4 fw-bold">5 star</div>
          <div className="text-muted small">Hotel Room</div>
        </div>
        {/* TRAVELLER */}
        <div className="px-3 col-2">
          <div className="text-muted fs-5 mb-1">TRAVELLER</div>
          <div className="fs-4 fw-bold">1 Traveller</div>
          <div className="text-muted small">Economy</div>
        </div>

      </form >
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
    </div >
  );
}
