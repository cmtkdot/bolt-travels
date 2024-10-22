'use client'

import React, { useState, useEffect } from 'react';
import { Trip, Activity } from '../../lib/database.types';
import { getTrips, getActivities } from '../../app/actions/tripActions.server';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import TripsList from '../../components/trips/TripsList';
import BudgetOverview from '../../components/budget/BudgetOverview';
import WeatherWidget from '../../components/weather/WeatherComponent';
import ActivityOverview from '../../components/activities/ActivityOverview';

export default function DashboardClient() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);
      try {
        const [fetchedTrips, fetchedActivities] = await Promise.all([
          getTrips(),
          getActivities('all') // Assuming we want activities for all trips
        ]);
        setTrips(fetchedTrips);
        setActivities(fetchedActivities);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleTripSelect = (tripId: string) => {
    router.push(`/trips/${tripId}`);
  };

  const filteredTrips = trips.filter(trip => 
    trip.destination.toLowerCase().includes(filter.toLowerCase())
  );

  const nextTrip = trips.length > 0 ? trips[0] : null; // Assuming trips are sorted by date

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter trips..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
          {filteredTrips.length > 0 ? (
            <TripsList initialTrips={filteredTrips} onTripSelect={handleTripSelect} />
          ) : (
            <p>No upcoming trips. Why not plan one?</p>
          )}
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
          {nextTrip ? (
            <WeatherWidget location={nextTrip.destination} />
          ) : (
            <p>No upcoming trips available.</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
        {trips.length > 0 ? (
          <BudgetOverview trips={trips} />
        ) : (
          <p>No trips available for budget overview.</p>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ActivityOverview activities={activities} />
      </div>

      <div className="flex space-x-4 justify-center">
        <Link href="/trips/new" passHref>
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create New Trip
          </Button>
        </Link>
        <Link href="/trips" passHref>
          <Button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            View All Trips
          </Button>
        </Link>
      </div>
    </div>
  );
}
