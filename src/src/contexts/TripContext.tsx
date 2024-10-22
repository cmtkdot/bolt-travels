'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase-client';
import { Trip } from '../lib/types';

type TripContextType = {
  trips: Trip[];
  fetchTrips: () => Promise<void>;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    const { data, error } = await supabase.from('trips').select('*');
    if (error) console.error('Error fetching trips:', error);
    else setTrips(data as Trip[]);
  };

  return (
    <TripContext.Provider value={{ trips, fetchTrips }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
