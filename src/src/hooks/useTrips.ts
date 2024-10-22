import { useState, useEffect } from 'react';
import { Trip } from '@/lib/database.types';
import { getTrips } from '@/app/actions/tripActions.server';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const fetchedTrips = await getTrips();
        setTrips(fetchedTrips);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setIsError(true);
        setIsLoading(false);
      }
    }

    fetchTrips();
  }, []);

  return { trips, isLoading, isError };
}

export function useTrip(tripId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchTripAndActivities() {
      try {
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('id', tripId)
          .single();

        if (tripError) throw tripError;

        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .eq('trip_id', tripId);

        if (activitiesError) throw activitiesError;

        setTrip(tripData);
        setActivities(activitiesData || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching trip and activities:', error);
        setIsError(true);
        setIsLoading(false);
      }
    }

    fetchTripAndActivities();
  }, [tripId]);

  return { trip, activities, isLoading, isError };
}
