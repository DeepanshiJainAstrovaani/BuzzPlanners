import React from 'react';

export default function TravelPackageFilterSidebar({ filters, setFilters, destinations }: any) {
  // small helper to reuse
  const sectionStyle: React.CSSProperties = { marginBottom: 20 };

  return (
    <aside style={{ width: '100%' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 18,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          boxSizing: 'border-box',
          overflow: 'hidden' // prevent the rounded pill bleed you saw
        }}
      >
        <h4 style={{ margin: 0, fontSize: 20, letterSpacing: 0.2 }}>FILTER</h4>

        <div style={{ height: 12 }} />

        {/* Popular Destinations */}
        <div style={sectionStyle}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Popular Destination</div>
          <div>
            {destinations.map((d: string) => {
              const checked = filters.destinations.includes(d);
              return (
                <label
                  key={d}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 14,
                    marginBottom: 8
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? filters.destinations.filter((x: string) => x !== d)
                        : [...filters.destinations, d];
                      setFilters((prev: any) => ({ ...prev, destinations: next }));
                    }}
                  />
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {d}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price range - keep compact */}
        <div style={sectionStyle}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Price Range</div>
          <div style={{ fontSize: 13, color: '#555' }}>
            ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
          </div>
        </div>

        {/* Accommodation compact */}
        <div style={sectionStyle}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Accommodation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['5 Star', '4 Star', '3 Star'].map(a => {
              const checked = filters.accommodation.includes(a);
              return (
                <label
                  key={a}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 14
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? filters.accommodation.filter((x: string) => x !== a)
                        : [...filters.accommodation, a];
                      setFilters((prev: any) => ({ ...prev, accommodation: next }));
                    }}
                  />
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {a}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
