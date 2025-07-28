'use client';

import React from 'react';
import styles from './FlightFilterSidebar.module.css';

export default function FlightFilterSidebar({
    filters,
    setFilters,
    airlines
}: {
    filters: any,
    setFilters: any,
    airlines: string[]
}) {
    return (
        <div className="bg-white p-4 border rounded-5 shadow col-3 col-md-3">
            <h5 className="mb-3 fw-bold fs-4">FILTER</h5>
            <hr></hr>
            <text className="fs-5 fw-medium">Popular Airlines</text>
            <div className='mt-3' style={{ height: '20rem', overflow: 'auto', overflowX: 'hidden' }}>
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

            <hr />

            <text className="fs-5 fw-medium">Class</text>
            <div className='mt-3'>
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
