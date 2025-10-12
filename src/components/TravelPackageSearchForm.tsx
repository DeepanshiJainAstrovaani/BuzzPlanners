/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */

+'use client';
import dynamic from 'next/dynamic';
// react-calendar (or any browser-only calendar) must be loaded without SSR
const Calendar: any = dynamic(() => import('react-calendar'), { ssr: false });
import 'react-calendar/dist/Calendar.css';
import React, { useState, useEffect, useRef } from 'react';
import SearchableSelect from './SearchableSelect';
import styles from './FlightSearchForm.module.css';

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

  function handleDepartureSelect(date: Date | undefined) {
    if (!date) return;
    setDepartureDate(date);
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

  useEffect(() => {
    setDestination(DESTINATION_OPTIONS[0]); // default Kasauli
    setPickFrom(PICKFROM_OPTIONS[0]); // default pickup
  }, []);

  useEffect(() => {
    // guard document access for SSR
    if (typeof window === 'undefined') return;
    
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
      pickFrom: pickFrom.value,
      departureDate,
      returnDate,
      traveller,
      accommodation
    });
  };

  // mobile card style used on small screens
  const mobileCardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    boxShadow: '0 1px 0 rgba(0,0,0,0.06)'
  };

  // compact single-line helper
  const singleLine: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  };

  return (
    <div
      className={`${styles.wrapper} w-100`}
      style={{
        paddingBottom: isMobile ? 2 : undefined,
        display: 'flex',      // ensure form + button are inline
        gap: 0,               // remove extra space between them
        alignItems: 'stretch' // keep same heights
      }}
    >
       <form
         onSubmit={handleSubmit}
         className={`bg-white p-3 rounded-start-4 shadow d-flex align-items-center gap-2 ${styles.flightForm}`}
         style={{
           flexGrow: 1,
           border: '1px solid #ddd',
           borderRight: 'none',
           alignItems: 'stretch',
           marginRight: 0,
           // remove right rounded corners so button can sit flush
           borderTopRightRadius: 0,
           borderBottomRightRadius: 0
         }}
       >
        {/* DESTINATION */}
        <div className={`px-2 border-end ${styles.colItem} ${styles.fieldBox}`} style={{ width: '18%' }}>
          <div className="text-muted mb-1" style={{ fontSize: '0.88rem' }}>DESTINATION</div>
          
            {/* SearchableSelect may render its own selected info — keep the control but show truncated label next to it.
                If SearchableSelect renders its own text, it should inherit the whitespace rule from container. */}
            <SearchableSelect
              label="Destination"
              value={destination}
              onChange={setDestination}
              optionsList={DESTINATION_OPTIONS}
            />
        </div>

        {/* PICK FROM */}
        <div className={`px-2 border-end ${styles.colItem} ${styles.fieldBox}`} style={{ width: '18%'}}>
          <div className="text-muted mb-1" style={{ fontSize: '0.88rem' }}>PICK FROM</div>
            <SearchableSelect
              label="Pick From"
              value={pickFrom}
              onChange={setPickFrom}
              optionsList={PICKFROM_OPTIONS}
            />
        </div>
        {/* DEPARTURE DATE */}
        <div className={`px-2 border-end ${styles.colItem} ${styles.fieldBox}`} style={{ position: 'relative', width: '15%' }}>
          <div className="text-muted mb-1" style={{ fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>DEPARTURE DATE</div>
          <div className={`${styles.dateDisplay} fw-semibold truncate`} style={{ fontSize: '1rem', cursor: 'pointer' }} onClick={() => setCalendarOpen('departure')}>
            {formatDate(departureDate)}
          </div>
          <div className="text-muted small truncate" style={{ marginTop: 6 }}>{formatWeekday(departureDate)}</div>
          {calendarOpen === 'departure' && (
            <div ref={calendarRef} className={styles.calendarPopup}>
              <Calendar value={departureDate} onChange={(d: Date) => handleDepartureSelect(d as Date)} minDate={today} tileDisabled={({ date }: { date: Date }) => date < today} locale="en-GB" />
            </div>
          )}
        </div>

        {/* RETURN DATE */}
        <div className={`px-2 border-end ${styles.colItem} ${styles.fieldBox}`} style={{ position: 'relative', width: '15%'}}>
          <div className="text-muted mb-1" style={{ fontSize: '0.88rem' }}>RETURN DATE</div>
          <div className={`${styles.dateDisplay} fw-semibold truncate`} style={{ fontSize: '1rem', cursor: 'pointer' }} onClick={() => setCalendarOpen('return')}>
            {formatDate(returnDate)}
          </div>
          <div className="text-muted small truncate" style={{ marginTop: 6 }}>{formatWeekday(returnDate)}</div>
          {calendarOpen === 'return' && (
            <div ref={calendarRef} className={styles.calendarPopup}>
              <Calendar value={returnDate} onChange={(d: Date) => handleReturnSelect(d as Date)} minDate={addDays(departureDate, 1)} tileDisabled={({ date }: { date: Date }) => date <= departureDate} locale="en-GB" />
            </div>
          )}
        </div>

        {/* ACCOMMODATION */}
        <div className={`px-2 border-end ${styles.colItem} ${styles.fieldBox}`} style={{ width: '16%' }}>
          <div className="text-muted mb-1" style={{ fontSize: '0.88rem' }}>ACCOMMODATION</div>
          <div className="fw-semibold truncate" style={{ fontSize: '1rem' }}>5 star</div>
          <div className="text-muted small truncate" style={{ marginTop: 6 }}>Hotel Room</div>
        </div>

        {/* TRAVELLER */}
        <div className={`px-2 ${styles.colItem} ${styles.fieldBox}`} style={{ width: '16%'}}>
          <div className="text-muted mb-1" style={{ fontSize: '0.88rem' }}>TRAVELLER</div>
          <div className="fw-semibold truncate" style={{ fontSize: '1rem' }}>1 Traveller</div>
          <div className="text-muted small truncate" style={{ marginTop: 6 }}>Economy</div>
        </div>
       </form>
 
      {/* SEARCH BUTTON */}
      <div
        className={styles.searchWrap}
        style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', marginLeft: 0 }}
      >
         <button
           type="button"
           className={`btn ${styles.searchButton}`}
           onClick={handleSubmit}
           style={{
             borderTopLeftRadius: 0,
             borderBottomLeftRadius: 0,
             height: '100%',
             // ensure button right corners remain rounded
             borderTopRightRadius: 12,
             borderBottomRightRadius: 12
           }}
         >
           SEARCH
         </button>
       </div>
     </div>
   );
 }
