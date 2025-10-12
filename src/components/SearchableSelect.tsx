'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './AirportSelect.module.css'; // reuse same CSS as AirportSelect
import Image from 'next/image';

interface Option {
  label: string;
  value: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  label: string;
  value: Option | null;
  onChange: (selected: Option | null) => void;
  optionsList: Option[]; // pass your destinations here
}

export default function SearchableSelect({ label, value, onChange, optionsList }: SearchableSelectProps) {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(optionsList);
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter as user types
  useEffect(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) {
      setFilteredOptions(optionsList);
    } else {
      setFilteredOptions(
        optionsList.filter(opt =>
          opt.label.toLowerCase().includes(query) ||
          opt.sublabel?.toLowerCase().includes(query)
        )
      );
    }
  }, [inputValue, optionsList]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(opt: Option) {
    onChange(opt);
    setIsEditing(false);
  }

  return (
    <div ref={containerRef}>
      <div
        className={styles.displayBox}
        onClick={() => setIsEditing(true)}
      >
        <div className="fw-bold" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1.2rem', }}>{value?.label || ''}</div>
        <div className="text-muted" style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{value?.sublabel || ''}</div>
      </div>

      {isEditing && (
        <div
          style={{
            width: 'auto',
            background: '#fff',
            border: '1px solid #d4d4d4',
            boxShadow: '0 4px 5px 0 rgb(0 0 0 / 22%)',
            padding: 10,
            position: 'absolute',
            zIndex: 99,
            marginTop: '-1%',
            marginLeft: '1%'
          }}
        >
          <div style={{ position: 'relative', marginBottom: 7 }}>
            <span className={styles.inputIcon}>
              <Image
                src={'/icons/search.png'}
                alt='Search Icon'
                width={20}
                height={20}
              />
            </span>
            <input
              autoFocus
              className={styles.inputWithIcon}
              style={{
                width: '100%',
                padding: '10px 12px',
                marginBottom: 4,
                outline: 'none'
              }}
              placeholder={label.toUpperCase()}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />

            <div style={{ maxHeight: 230, overflowY: 'auto' }}>
              {filteredOptions.length === 0 ? (
                <div style={{ padding: 16, color: '#888', textAlign: 'center' }}>No results</div>
              ) : (
                filteredOptions.map(opt => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt)}
                    style={{
                      padding: '10px 10px 8px 10px',
                      cursor: 'pointer',
                      borderRadius: 7,
                      background: value?.value === opt.value ? '#edf8f2' : 'none',
                      margin: '2px 0',
                      transition: 'background 0.15s'
                    }}
                    onMouseDown={e => e.preventDefault()} // keep focus
                  >
                    <div style={{ fontWeight: 600, color: '#222', fontSize: 16 }}>
                      {opt.label}
                    </div>
                    {opt.sublabel && (
                      <div style={{ fontSize: 13, color: '#838383', marginTop: 2 }}>
                        {opt.sublabel}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
