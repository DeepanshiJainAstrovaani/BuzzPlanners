/* eslint-disable @typescript-eslint/no-unsafe-function-type */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import AirportSelect from './AirportSelect';
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
  const calendarRef = useRef<HTMLDivElement>(null);

  function addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }
  function formatDate(d: Date) {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function formatWeekday(d: Date) {
    return d.toLocaleDateString('en-GB', { weekday: 'long' });
  }

  function handleDepartureSelect(date: Date | undefined) {
    if (!date) return;
    setDepartureDate(date);
    if (returnDate <= date) setReturnDate(addDays(date, 1));
    setCalendarOpen(null);
  }
  function handleReturnSelect(date: Date | undefined) {
    if (!date) return;
    setReturnDate(date);
    setCalendarOpen(null);
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!from?.value || !to?.value) return;
    onSearch({ from: from.value, to: to.value, departureDate });
  };

  useEffect(() => {
    setFrom({ label: 'New Delhi', sublabel: 'New Delhi Indira Gandhi (DEL)', value: 'DEL' });
    setTo({ label: 'Del Rio', sublabel: 'Del Rio Laughlin Air Force Base (DLF)', value: 'DLF' });
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`${styles.wrapper} w-100`}>
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-2 rounded-start-4 shadow d-flex align-items-center gap-3 ${styles.flightForm}`}
        style={{ flexGrow: 1, border: '1px solid #ddd', borderRight: 'none' }}
      >
        {/* FROM */}
        <div className={`px-3 border-end ${styles.colItem} ${styles.fieldBox}`} style={{ width: '20%' }}>
          <div className="text-muted mb-1" style={{ fontSize: '1rem' }}>FROM</div>
          <AirportSelect label="From" value={from} onChange={setFrom} />
        </div>

        {/* TO */}
        <div className={`px-3 border-end ${styles.colItem} ${styles.fieldBox}`} style={{ width: '20%' }}>
          <div className="text-muted mb-1" style={{ fontSize: '1rem' }}>TO</div>
          <AirportSelect label="To" value={to} onChange={setTo} />
        </div>

        {/* DEPARTURE DATE */}
        <div className={`px-3 border-end ${styles.colItem} ${styles.fieldBox}`} style={{ position: 'relative', width: '20%' }}>
          <div className="text-muted mb-1" style={{ fontSize: '1rem' }}>DEPARTURE DATE</div>
          <div className={`${styles.dateDisplay} fs-4 fw-bold`} style={{ cursor: 'pointer' }} onClick={() => setCalendarOpen('departure')}>
            {formatDate(departureDate)}
          </div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>{formatWeekday(departureDate)}</div>
          {calendarOpen === 'departure' && (
            <div ref={calendarRef} className={styles.calendarPopup}>
              <Calendar value={departureDate} onChange={(d) => handleDepartureSelect(d as Date)} minDate={today} tileDisabled={({ date }) => date < today} locale="en-GB" />
            </div>
          )}
        </div>

        {/* RETURN DATE */}
        <div className={`px-3 border-end ${styles.colItem} ${styles.fieldBox}`} style={{ position: 'relative', width: '20%' }}>
          <div className="text-muted mb-1" style={{ fontSize: '1rem' }}>RETURN DATE</div>
          <div className={`${styles.dateDisplay} fs-4 fw-bold displayBox`} style={{ cursor: 'pointer' }} onClick={() => setCalendarOpen('return')}>
            {formatDate(returnDate)}
          </div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>{formatWeekday(returnDate)}</div>
          {calendarOpen === 'return' && (
            <div ref={calendarRef} className={styles.calendarPopup}>
              <Calendar value={returnDate} onChange={(d) => handleReturnSelect(d as Date)} minDate={addDays(departureDate, 1)} tileDisabled={({ date }) => date <= departureDate} locale="en-GB" />
            </div>
          )}
        </div>

        {/* TRAVELLER */}
        <div className={`px-3 ${styles.colItem} ${styles.fieldBox}`} style={{ width: '20%' }}>
          <div className="text-muted mb-1" style={{ fontSize: '1rem' }}>TRAVELLER</div>
          <div className="fs-4 fw-bold">1 Traveller</div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Economy</div>
        </div>
      </form>

      {/* SEARCH BUTTON */}
      <div className={styles.searchWrap}>
        <button
          type="button"
          className={`btn ${styles.searchButton}`}
          onClick={handleSubmit}
        >
          SEARCH
        </button>
      </div>
    </div>
  );
}
