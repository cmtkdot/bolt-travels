"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Trip } from '@/lib/database.types';
import { Loader } from '@googlemaps/js-api-loader';
import CurrencyConverter from '@/components/utils/CurrencyConverter';
import SharedForm from '@/components/shared/SharedForm';
import { z } from 'zod';

type TripsFormData = Omit<Trip, 'id' | 'created_at' | 'updated_at'>;

interface TripsFormProps {
  onSubmit: (trips: TripsFormData) => void;
  initialData?: Partial<TripsFormData>;
}

const tripSchema = z.object({
  name: z.string().min(1, 'Trip name is required'),
  destination: z.string().min(1, 'Destination is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  itinerary: z.any().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  location: z.string(),
  total_budget: z.number().min(0, 'Budget must be non-negative'),
  currency: z.string().min(1, 'Currency is required'),
  time_zone: z.string().min(1, 'Time zone is required'),
  is_public: z.boolean(),
});

const TripsForm: React.FC<TripsFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<TripsFormData>>(initialData || {});
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      initAutocomplete();
    }).catch((e) => {
      console.error("Error loading Google Maps API:", e);
    });
  }, []);

  const initAutocomplete = () => {
    if (inputRef.current && window.google && window.google.maps && window.google.maps.places) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
      if (autocompleteRef.current) {
        autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
      }
    }
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place) {
        const latitude = place.geometry?.location?.lat() ?? null;
        const longitude = place.geometry?.location?.lng() ?? null;
        const formattedAddress = place.formatted_address || '';

        setFormData(prev => ({
          ...prev,
          destination: formattedAddress,
          latitude,
          longitude,
          location: formattedAddress,
        }));
      }
    }
  };

  const fields = [
    { name: 'name', label: 'Trip Name', type: 'text' as const, required: true },
    {
      name: 'destination',
      label: 'Destination',
      type: 'custom' as const,
      required: true,
      render: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border rounded"
        />
      ),
    },
    { name: 'start_date', label: 'Start Date', type: 'date' as const, required: true },
    { name: 'end_date', label: 'End Date', type: 'date' as const, required: true },
    { name: 'total_budget', label: 'Total Budget', type: 'number' as const, required: true },
    {
      name: 'currency',
      label: 'Currency',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'USD', label: 'USD (US Dollar)' },
        { value: 'EUR', label: 'EUR (Euro)' },
        { value: 'GBP', label: 'GBP (British Pound)' },
        { value: 'VND', label: 'VND (Vietnamese Dong)' },
        { value: 'THB', label: 'THB (Thai Baht)' },
      ],
    },
    { name: 'time_zone', label: 'Time Zone', type: 'text' as const, required: true },
    { name: 'is_public', label: 'Make trip public', type: 'checkbox' as const },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const validatedData = tripSchema.parse({ ...formData, ...data });
      onSubmit(validatedData as TripsFormData);
    } catch (error) {
      console.error('Error submitting trip:', error);
      throw error;
    }
  };

  return (
    <>
      <SharedForm
        title={initialData ? 'Edit Trip' : 'Add New Trip'}
        fields={fields}
        onSubmit={handleSubmit}
        initialData={formData}
        submitButtonText={initialData ? 'Update Trip' : 'Add Trip'}
      />
      <div className="mt-4">
        <CurrencyConverter
          initialAmount={formData.total_budget || 0}
          initialFromCurrency={formData.currency || 'USD'}
          initialToCurrency="USD"
          autoConvert={true}
        />
      </div>
    </>
  );
};

export default TripsForm;
