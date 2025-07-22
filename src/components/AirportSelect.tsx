import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  onChange: (selected: Option | null) => void;
  value: Option | null;
}

export default function AirportSelect({ label, onChange, value }: Props) {
  const [defaultOptions, setDefaultOptions] = useState<Option[]>([]);

  // Fetch default airports (e.g., some popular airports)
  useEffect(() => {
    const fetchDefaultAirports = async () => {
      try {
        // Example: Search with "del" (Delhi) or a common letter like "a" 
        const res = await fetch(
          `https://aerodatabox.p.rapidapi.com/airports/search/term?q=del`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': 'd8044ed75fmshff41b6fef3fb0bdp100fd5jsn8a9d5b0713ae',
              'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
            },
          }
        );
        const data = await res.json();
        setDefaultOptions(
          (data.items || []).map((airport: any) => ({
            label: `${airport.name} (${airport.iata})`,
            value: airport.iata,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch default airports:', err);
      }
    };

    fetchDefaultAirports();
  }, []);

  // Async search loader
  const loadOptions = async (inputValue: string) => {
    if (!inputValue) return defaultOptions;
    try {
      const res = await fetch(
        `https://aerodatabox.p.rapidapi.com/airports/search/term?q=${inputValue}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'd8044ed75fmshff41b6fef3fb0bdp100fd5jsn8a9d5b0713ae',
            'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
          },
        }
      );
      const data = await res.json();
      return (data.items || []).map((airport: any) => ({
        label: `${airport.name} (${airport.iata})`,
        value: airport.iata,
      }));
    } catch (err) {
      console.error('Failed to fetch airports:', err);
      return [];
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <AsyncSelect
        value={value}
        onChange={onChange}
        loadOptions={loadOptions}
        placeholder={`Search or select ${label.toLowerCase()}`}
        isClearable
        cacheOptions
        defaultOptions={defaultOptions}
      />
    </div>
  );
}
