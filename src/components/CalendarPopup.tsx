// CalendarPopup.tsx
import React from 'react';

export default function CalendarPopup({
  selectedDate,
  onSelect,
  close,
}: {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  close: () => void;
}) {
  const [displayMonth, setDisplayMonth] = React.useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }
  function getWeekStart(date: Date) {
    const d = new Date(date);
    d.setDate(1);
    return d.getDay();
  }

  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const days = daysInMonth(year, month);
  const weekStart = getWeekStart(displayMonth);

  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Calendar grid
  const calendarRows: (Date | null)[] = [];
  for (let i = 0; i < weekStart; i++) calendarRows.push(null);
  for (let day = 1; day <= days; day++)
    calendarRows.push(new Date(year, month, day));

  // For simple styling, wrap in a floating "card":
  return (
    <div
      style={{
        position: 'absolute',
        top: '120%', left: 0,
        background: '#fff',
        border: '1px solid #d4d4d4',
        boxShadow: '0 4px 16px rgba(0,0,0,.12)',
        borderRadius: 12,
        zIndex: 9999,
        minWidth: 240,
        padding: '16px 20px 22px 20px',
      }}
      tabIndex={-1}
      onBlur={close}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <button style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}
          onClick={() => setDisplayMonth(new Date(year, month - 1, 1))}>
          ‹
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 16 }}>
          {displayMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </div>
        <button style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#888' }}
          onClick={() => setDisplayMonth(new Date(year, month + 1, 1))}>
          ›
        </button>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 4,
        textAlign: 'center',
        color: '#90a1b5',
        fontSize: 13,
        marginBottom: 2,
      }}>
        {dayLabels.map((d, i) => (
          <div key={i} style={{ fontWeight: 600 }}>{d}</div>
        ))}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 2,
      }}>
        {calendarRows.map((dateObj, i) =>
          dateObj ? (
            <div
              key={i}
              onClick={() => { onSelect(dateObj); close(); }}
              style={{
                cursor: 'pointer',
                padding: '8px 0',
                fontSize: 16,
                borderRadius: 7,
                fontWeight: dateObj.getTime() === selectedDate.getTime() ? 700 : 500,
                color: dateObj.getTime() === selectedDate.getTime() ? '#fff' : '#222',
                background: dateObj.getTime() === selectedDate.getTime() ? '#38b16d' : 'none',
                transition: 'background .18s',
                margin: 1,
              }}
            >
              {dateObj.getDate()}
            </div>
          ) : (
            <div key={i} />
          )
        )}
      </div>
    </div>
  );
}
