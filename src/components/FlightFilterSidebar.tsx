
'use client';


import React from 'react';
import styles from './FlightFilterSidebar.module.css';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const StyledSlider = styled(Slider)({
    color: '#00A859',
    height: 4,
    padding: '13px 0',
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:hover': {
            boxShadow: '0 0 0 8px rgba(0, 168, 89, 0.16)',
        },
        '&.Mui-active': {
            boxShadow: '0 0 0 14px rgba(0, 168, 89, 0.16)',
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


export default function FlightFilterSidebar({
    filters,
    setFilters,
    airlines
}: {
    filters: any,
    setFilters: any,
    airlines: string[]
}) {
    const [priceRange, setPriceRange] = React.useState<number[]>([3000, 18000]);

    const handlePriceChange = (_event: any, newValue: number | number[]) => {
        const updated = newValue as number[];
        setPriceRange(updated);
        setFilters((prev: any) => ({
            ...prev,
            priceRange: updated
        }));
    };
    return (
        <div className="bg-white p-4 border rounded-5 shadow w-100">
            <h5 className="mb-3 fw-bold fs-4">FILTER</h5>
            <hr />

            {/* Airlines Filter */}
            <div>
                <p className="fs-5 fw-medium mb-2">Popular Airlines</p>
                <div className='mt-2 hide-scrollbar' style={{ maxHeight: '50vh', overflowY: 'auto', overflowX: 'hidden' }}>
                    {airlines.length === 0 && <div className="text-muted">No airlines found</div>}
                    {airlines.map((airline) => (
                        <div key={airline} className="form-check">
                            <input
                                className={`form-check-input ${styles.form}`}
                                type="checkbox"
                                id={airline}
                                checked={filters.airlines.includes(airline)}
                                onChange={e => {
                                    const checked = e.target.checked;
                                    setFilters((prev: any) => ({
                                        ...prev,
                                        airlines: checked
                                            ? [...prev.airlines, airline]
                                            : prev.airlines.filter((a: string) => a !== airline)
                                    }));
                                }}
                            />
                            <label className="form-check-label" htmlFor={airline}>
                                {airline}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <hr />

            {/* Price Range Filter */}
            <div>
                <p className="fs-5 fw-medium mb-2">Price Range</p>
                <div className="mt-4 px-2">
                    <StyledSlider
                        value={priceRange}
                        onChange={handlePriceChange}
                        min={1000}
                        max={20000}
                        step={100}
                        disableSwap
                    />
                    <div className="text-center mt-2 fw-semibold">
                        Rs. {priceRange[0]} – Rs. {priceRange[1]}
                    </div>
                </div>

            </div>

            <hr />

            {/* Class Filter */}
            <div>
                <p className="fs-5 fw-medium mb-2">Class</p>
                {['Economy', 'Business', 'First Class'].map(cls => (
                    <div key={cls} className="form-check">
                        <input
                            className={`form-check-input ${styles.form}`}
                            type="radio"
                            name="class"
                            id={cls}
                            checked={filters.class === cls}
                            onChange={() =>
                                setFilters((prev: any) => ({ ...prev, class: cls }))
                            }
                        />
                        <label className="form-check-label" htmlFor={cls}>
                            {cls}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
