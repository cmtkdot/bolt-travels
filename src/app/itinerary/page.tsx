import React from 'react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Database } from '../../lib/database.types'
import { getTrips } from '../../app/actions/tripActions.server'

export default async function ItineraryPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Please log in to view your itinerary.</p>
        <Link href="/login" className="text-blue-500 hover:underline">
          Go to Login
        </Link>
      </div>
    )
  }

  try {
    const trips = await getTrips()

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Your Itinerary</h1>
        {trips && trips.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Link href={`/trips/${trip.id}`} key={trip.id} className="block">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-semibold">{trip.destination}</h2>
                  <p className="text-gray-600">
                    {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>You haven't created any trips yet.</p>
        )}
        <Link href="/trips/new" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create New Trip
        </Link>
      </div>
    )
  } catch (error) {
    console.error('Error fetching trips:', error)
    return <div>Error loading itinerary. Please try again later.</div>
  }
}
