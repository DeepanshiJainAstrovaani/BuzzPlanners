import React, { useEffect, useRef, useState } from 'react';
import styles from './AirportSelect.module.css'; // use CSS module for styling
import Image from 'next/image';

interface Option {
    label: string;
    value: string;
    sublabel?: string;
}

interface CustomAirportDropdownProps {
    label: string;
    value: Option | null;
    onChange: (selected: Option | null) => void;
}

export default function AirportSelect({ label, value, onChange }: CustomAirportDropdownProps) {
    const [options, setOptions] = useState<Option[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch airports from API
    const fetchOptions = async (query: string) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://aerodatabox.p.rapidapi.com/airports/search/term?q=${encodeURIComponent(query || 'del')}`,
                {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': 'd8044ed75fmshff41b6fef3fb0bdp100fd5jsn8a9d5b0713ae',
                        'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
                    }
                }
            );
            const data = await res.json();
            const formatted = (data.items || []).map((airport: any) => ({
                label: `${airport.municipalityName || airport.name}`,
                sublabel: `${airport.name} (${airport.iata})`,
                value: airport.iata,
            }));
            setOptions(formatted);
        } catch (err) {
            console.error('Failed to fetch airports:', err);
            setOptions([]);
        }
        setLoading(false);
    };

    // Initial fetch
    useEffect(() => {
        fetchOptions('');
    }, []);

    // Fetch on input change (debounced)
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchOptions(inputValue);
        }, 350);
        return () => clearTimeout(handler);
    }, [inputValue]);

    // Hide dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsEditing(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle selection
    function handleSelect(opt: Option) {
        onChange(opt);
    }

    return (
        <div ref={containerRef}>
            <div
                className={styles.displayBox}
                onClick={() => setIsEditing(true)}
            >
                <div className="fw-bold" style={{ fontSize: '1.2rem' }}>{value?.label}</div>
                <div
                    className="text-muted"
                    style={{
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                        display: 'block'
                    }}
                >
                    {value?.sublabel}
                </div>
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
                        marginLeft: '1%',
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
                            placeholder= {label.toUpperCase()}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                        />
                        <div
                            style={{
                                maxHeight: 230,
                                overflowY: 'auto'
                            }}
                        >
                            {loading ? (
                                <div style={{ padding: 16, color: '#888', textAlign: 'center' }}>Loading...</div>
                            ) : options.length === 0 ? (
                                <div style={{ padding: 16, color: '#888', textAlign: 'center' }}>No airports found</div>
                            ) : (
                                options.map(opt => (
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
                                        onMouseDown={e => e.preventDefault()} // Prevent input from losing focus
                                    >
                                        <div style={{ fontWeight: 600, color: '#222', fontSize: 16 }}>
                                            {opt.label}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#838383', marginTop: 2 }}>
                                            {opt.sublabel}
                                        </div>
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
