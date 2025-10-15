/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
'use client';

import dynamic from 'next/dynamic';
const Calendar: any = dynamic(() => import('react-calendar'), { ssr: false });
import 'react-calendar/dist/Calendar.css';
import React, { useState, useEffect, useRef } from 'react';
import SearchableSelect from './SearchableSelect';
import { IoChevronUp, IoChevronDown } from 'react-icons/io5';

export default function HotelSearchForm({ onSearch, defaultDest }: { onSearch: Function, defaultDest: string }) {
  const [destination, setDestination] = useState<{ label: string; sublabel?: string; value: string } | null>(null);
  const today = new Date();
  const [checkInDate, setCheckInDate] = useState<Date>(today);
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(today, 1));
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [calendarOpen, setCalendarOpen] = useState<'checkin' | 'checkout' | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(max-width: 767.98px)');
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener ? m.addEventListener('change', update) : m.addListener(update);
    return () => {
      m.removeEventListener ? m.removeEventListener('change', update) : m.removeListener(update);
    };
  }, []);

  // Destinations for hotels
  const DESTINATION_OPTIONS = [
    { label: 'Nainital', value: 'NAI', sublabel: 'Nainital, Uttarakhand' },
    { label: 'Kasauli', value: 'KAS', sublabel: 'Kasauli, Himachal Pradesh' },
    { label: 'Mukteshwar', value: 'MUK', sublabel: 'Mukteshwar, Uttarakhand' },
    { label: 'Rishikesh', value: 'RIS', sublabel: 'Rishikesh, Uttarakhand' },
    { label: 'Manali', value: 'MAN', sublabel: 'Manali, Himachal Pradesh' },
    { label: 'Dehradun', value: 'DEE', sublabel: 'Dehradun, Uttarakhand' },
    { label: 'Shimla', value: 'SHI', sublabel: 'Shimla, Himachal Pradesh' },
    { label: 'Mussoorie', value: 'MUS', sublabel: 'Mussoorie, Uttarakhand' }
  ];

  useEffect(() => {
    // Set initial destination
    const initialDest = DESTINATION_OPTIONS.find(opt => opt.value === defaultDest || opt.label === defaultDest);
    if (initialDest) setDestination(initialDest);
  }, [defaultDest]);

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setCalendarOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    
    const searchParams = {
      destination: destination.label,
      checkIn: formatDate(checkInDate),
      checkOut: formatDate(checkOutDate),
      rooms,
      adults
    };
    
    onSearch(searchParams);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date: Date) => {
    const shortFormat = date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short',
      weekday: 'short'
    });
    const fullDay = date.toLocaleDateString('en-GB', { 
      weekday: 'long'
    });
    return { shortFormat, fullDay };
  };

  if (isMobile) {
    return (
      <form onSubmit={handleSubmit} className="w-100">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Form Container */}
          <div className="bg-white shadow" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
            {/* DESTINATION */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
              <div className="text-muted mb-1" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                CITY OR LOCATION
              </div>
              <SearchableSelect
                label="CITY OR LOCATION"
                optionsList={DESTINATION_OPTIONS}
                value={destination}
                onChange={setDestination}
              />
            </div>

            {/* CHECK-IN */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
              <div className="text-muted mb-1" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                CHECK-IN
              </div>
              <button
                type="button"
                className="border-0 p-0 fw-bold bg-transparent text-start w-100"
                style={{ fontSize: '16px', color: '#000' }}
                onClick={() => setCalendarOpen(calendarOpen === 'checkin' ? null : 'checkin')}
              >
                <div className="d-flex flex-column">
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {formatDisplayDate(checkInDate).shortFormat}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                    {formatDisplayDate(checkInDate).fullDay}
                  </div>
                </div>
              </button>
            </div>

            {/* CHECK-OUT */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e9ecef' }}>
              <div className="text-muted mb-1" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                CHECK-OUT
              </div>
              <button
                type="button"
                className="border-0 p-0 fw-bold bg-transparent text-start w-100"
                style={{ fontSize: '16px', color: '#000' }}
                onClick={() => setCalendarOpen(calendarOpen === 'checkout' ? null : 'checkout')}
              >
                <div className="d-flex flex-column">
                  <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {formatDisplayDate(checkOutDate).shortFormat}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                    {formatDisplayDate(checkOutDate).fullDay}
                  </div>
                </div>
              </button>
            </div>

            {/* ROOMS & GUESTS */}
            <div style={{ padding: '12px 16px' }}>
              <div className="text-muted mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ROOMS & GUESTS
              </div>
              <div className="d-flex align-items-center gap-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px', padding: 0, border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                    >
                      −
                    </button>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#000', minWidth: '20px', textAlign: 'center' }}>{rooms}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px', padding: 0, border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}
                      onClick={() => setRooms(rooms + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: '14px', color: '#666' }}>{rooms === 1 ? 'Room' : 'Rooms'}</span>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px', padding: 0, border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      −
                    </button>
                    <span style={{ fontSize: '18px', fontWeight: 700, color: '#000', minWidth: '20px', textAlign: 'center' }}>{adults}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px', padding: 0, border: '1px solid #ccc', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', color: '#333' }}
                      onClick={() => setAdults(adults + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ fontSize: '14px', color: '#666' }}>{adults === 1 ? 'Adult' : 'Adults'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div style={{ 
            backgroundColor: '#14A15F', 
            borderRadius: '12px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              type="submit"
              className="fw-bold text-white w-100 border-0"
              style={{ 
                backgroundColor: 'transparent', 
                height: '50px',
                fontSize: '16px'
              }}
            >
              SEARCH
            </button>
          </div>
        </div>

        {/* Calendar Popup */}
        {calendarOpen && (
          <div ref={calendarRef} style={{ position: 'absolute', zIndex: 1000, marginTop: '8px' }}>
            <Calendar
              onChange={(date: Date) => {
                if (calendarOpen === 'checkin') {
                  setCheckInDate(date);
                  if (date >= checkOutDate) {
                    setCheckOutDate(addDays(date, 1));
                  }
                } else {
                  setCheckOutDate(date);
                }
                setCalendarOpen(null);
              }}
              value={calendarOpen === 'checkin' ? checkInDate : checkOutDate}
              minDate={calendarOpen === 'checkin' ? new Date() : checkInDate}
            />
          </div>
        )}
      </form>
    );
  }

  // Desktop layout
  return (
    <form onSubmit={handleSubmit} className="w-100" style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
      <div
        className="bg-white rounded-start-4 shadow d-flex align-items-center gap-3"
        style={{ 
          flexGrow: 1, 
          border: '1px solid #ddd', 
          borderRight: 'none',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          padding: '16px 20px'
        }}
      >
        {/* DESTINATION */}
        <div className="px-3 border-end" style={{ width: '25%', minWidth: '200px' }}>
          <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>CITY OR LOCATION</div>
          <SearchableSelect
            label="CITY OR LOCATION"
            optionsList={DESTINATION_OPTIONS}
            value={destination}
            onChange={setDestination}
          />
        </div>

        {/* CHECK-IN */}
        <div className="px-3 border-end" style={{ width: '20%', minWidth: '140px' }}>
          <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>CHECK-IN</div>
          <button
            type="button"
            className="form-control border-0 p-0 fw-bold bg-transparent text-start"
            style={{ fontSize: '1.2rem', color: '#000' }}
            onClick={() => setCalendarOpen(calendarOpen === 'checkin' ? null : 'checkin')}
          >
            <div className="d-flex flex-column">
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {formatDisplayDate(checkInDate).shortFormat}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'normal' }}>
                {formatDisplayDate(checkInDate).fullDay}
              </div>
            </div>
          </button>
        </div>

        {/* CHECK-OUT */}
        <div className="px-3 border-end" style={{ width: '20%', minWidth: '140px' }}>
          <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>CHECK-OUT</div>
          <button
            type="button"
            className="form-control border-0 p-0 fw-bold bg-transparent text-start"
            style={{ fontSize: '1.2rem', color: '#000' }}
            onClick={() => setCalendarOpen(calendarOpen === 'checkout' ? null : 'checkout')}
          >
            <div className="d-flex flex-column">
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {formatDisplayDate(checkOutDate).shortFormat}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 'normal' }}>
                {formatDisplayDate(checkOutDate).fullDay}
              </div>
            </div>
          </button>
        </div>

        {/* ROOMS & GUESTS */}
        <div className="px-3" style={{ width: '35%', minWidth: '200px' }}>
          <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>ROOMS & GUESTS</div>
          <div className="d-flex align-items-center gap-4">
            <div className="d-flex flex-column align-items-center">
              <div className="d-flex align-items-center gap-2 mb-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                  style={{ width: '22px', height: '22px', padding: 0, border: '1px solid #ccc', borderRadius: '4px' }}
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                >
                  <IoChevronDown size={14} />
                </button>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#000', minWidth: '24px', textAlign: 'center' }}>{rooms}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                  style={{ width: '22px', height: '22px', padding: 0, border: '1px solid #ccc', borderRadius: '4px' }}
                  onClick={() => setRooms(rooms + 1)}
                >
                  <IoChevronUp size={14} />
                </button>
              </div>
              <span style={{ fontSize: '12px', color: '#666' }}>{rooms === 1 ? 'Room' : 'Rooms'}</span>
            </div>
            <div className="d-flex flex-column align-items-center">
              <div className="d-flex align-items-center gap-2 mb-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                  style={{ width: '22px', height: '22px', padding: 0, border: '1px solid #ccc', borderRadius: '4px' }}
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                >
                  <IoChevronDown size={14} />
                </button>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#000', minWidth: '24px', textAlign: 'center' }}>{adults}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                  style={{ width: '22px', height: '22px', padding: 0, border: '1px solid #ccc', borderRadius: '4px' }}
                  onClick={() => setAdults(adults + 1)}
                >
                  <IoChevronUp size={14} />
                </button>
              </div>
              <span style={{ fontSize: '12px', color: '#666' }}>{adults === 1 ? 'Adult' : 'Adults'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BUTTON */}
      <div style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
        <button
          type="submit"
          className="fw-bold text-white border-0"
          style={{ 
            backgroundColor: '#14A15F', 
            borderTopLeftRadius: 0, 
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            height: '100%',
            padding: '0 30px',
            fontSize: '1rem'
          }}
        >
          SEARCH
        </button>
      </div>

      {/* Calendar Popup */}
      {calendarOpen && (
        <div ref={calendarRef} style={{ position: 'absolute', zIndex: 1000, marginTop: '80px' }}>
          <Calendar
            onChange={(date: Date) => {
              if (calendarOpen === 'checkin') {
                setCheckInDate(date);
                if (date >= checkOutDate) {
                  setCheckOutDate(addDays(date, 1));
                }
              } else {
                setCheckOutDate(date);
              }
              setCalendarOpen(null);
            }}
            value={calendarOpen === 'checkin' ? checkInDate : checkOutDate}
            minDate={calendarOpen === 'checkin' ? new Date() : checkInDate}
          />
        </div>
      )}
    </form>
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
