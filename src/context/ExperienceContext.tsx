"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Experience = 'flights' | 'events' | 'hotels' | 'holiday' | 'trips';

interface ExperienceState {
  active: Experience;
  setActive: (e: Experience) => void;
}

const ExperienceContext = createContext<ExperienceState | undefined>(undefined);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<Experience>('flights');

  // Initialize from localStorage once on mount
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? (localStorage.getItem('bp.experience') as Experience | null) : null;
      if (saved) setActive(saved);
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem('bp.experience', active);
    } catch {}
  }, [active]);

  const value = useMemo(() => ({ active, setActive }), [active]);
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error('useExperience must be used within ExperienceProvider');
  return ctx;
}
