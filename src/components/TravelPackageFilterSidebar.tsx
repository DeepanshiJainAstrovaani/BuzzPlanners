import React from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const StyledSlider = styled(Slider)({
    color: '#24a86b',
    height: 4,
    padding: '13px 0',
    '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:hover': {
            boxShadow: '0 0 0 8px rgba(36, 168, 107, 0.16)',
        },
        '&.Mui-active': {
            boxShadow: '0 0 0 14px rgba(36, 168, 107, 0.16)',
        },
    },
    '& .MuiSlider-track': {
        height: 4,
    },
    '& .MuiSlider-rail': {
        color: '#d8d8d8',
        opacity: 1,
        height: 4,
    },
});

export default function TravelPackageFilterSidebar({ filters, setFilters, destinations }: any) {
  // small helper to reuse
  const sectionStyle: React.CSSProperties = { marginBottom: 20 };

  const [priceRange, setPriceRange] = React.useState<number[]>([filters.priceRange[0], filters.priceRange[1]]);

  // Sync local state with filters when they change
  React.useEffect(() => {
    setPriceRange([filters.priceRange[0], filters.priceRange[1]]);
  }, [filters.priceRange]);

  const handlePriceChange = (_event: any, newValue: number | number[]) => {
    const updated = newValue as number[];
    setPriceRange(updated);
    setFilters((prev: any) => ({
      ...prev,
      priceRange: updated
    }));
  };

  return (
    <aside style={{ width: '100%' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          padding: 'clamp(12px, 3vw, 16px)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <h4 style={{ margin: 0, fontSize: 'clamp(14px, 3vw, 18px)', letterSpacing: 0.2 }}>FILTER</h4>

        <style jsx>{`
          input[type="checkbox"] {
            appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #ddd;
            border-radius: 3px;
            background: white;
            cursor: pointer;
            position: relative;
          }
          input[type="checkbox"]:checked {
            background: #24a86b;
            border-color: #24a86b;
          }
          input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            color: white;
            font-size: 12px;
            top: -2px;
            left: 2px;
            font-weight: bold;
          }
        `}</style>

        <div style={{ height: 12 }} />

        {/* Popular Destinations */}
        <div style={sectionStyle}>
          <div style={{ fontWeight: 700, fontSize: 'clamp(12px, 2.5vw, 14px)', marginBottom: 8 }}>Popular Destination</div>
          <div>
            {destinations.map((d: string) => {
              const checked = filters.destinations.includes(d);
              return (
                <label
                  key={d}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(6px, 1.5vw, 8px)',
                    fontSize: 'clamp(12px, 2.5vw, 13px)',
                    marginBottom: 'clamp(6px, 1.5vw, 8px)'
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

        {/* Price range with slider */}
        <div style={sectionStyle}>
          <div style={{ fontWeight: 700, fontSize: 'clamp(12px, 2.5vw, 14px)', marginBottom: 8 }}>Price Range</div>
          <div style={{ marginTop: 16, paddingLeft: 8, paddingRight: 8 }}>
            <StyledSlider
              value={priceRange}
              onChange={handlePriceChange}
              min={3000}
              max={50000}
              step={1000}
              disableSwap
            />
            <div style={{ 
              textAlign: 'center', 
              marginTop: 8, 
              fontWeight: 600,
              fontSize: 'clamp(11px, 2vw, 13px)',
              color: '#555'
            }}>
              ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
            </div>
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
