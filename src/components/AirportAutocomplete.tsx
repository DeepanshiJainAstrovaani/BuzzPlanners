'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { FormControl, ListGroup, Spinner } from 'react-bootstrap';

type Place = {
  entityId: string;
  iataCode: string;
  name: string;
  countryName: string;
  cityName?: string;
};

export default function AirportAutocomplete({
  label,
  onSelect,
}: {
  label: string;
  onSelect: (place: Place) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (text: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'https://partners.api.skyscanner.net/apiservices/v3/autosuggest/flights',
        {
          query: {
            market: 'IN',
            locale: 'en-IN',
            searchTerm: text,
            includedEntityTypes: ['PLACE_TYPE_CITY', 'PLACE_TYPE_AIRPORT'],
          },
        },
        {
          headers: {
            'x-api-key': process.env.NEXT_PUBLIC_SKY_API_KEY!,
            'Content-Type': 'application/json',
          },
        }
      );
      setResults(res.data.places || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="position-relative">
      <FormControl
        placeholder={label}
        value={query}
        onChange={(e) => {
          const text = e.target.value;
          setQuery(text);
          if (text.length > 2) fetchSuggestions(text);
          else setResults([]);
        }}
        onBlur={() => setTimeout(() => setResults([]), 200)}
      />
      {loading && <Spinner animation="border" size="sm" className="position-absolute end-0 mt-1 me-2" />}
      {results.length > 0 && (
        <ListGroup className="position-absolute w-100 z-3">
          {results.map((p) => (
            <ListGroup.Item
              key={p.entityId}
              action
              onClick={() => {
                setQuery(p.name);
                setResults([]);
                onSelect(p);
              }}
            >
              {p.name} ({p.iataCode}) — {p.countryName}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
