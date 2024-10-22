'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trip } from '@/lib/database.types'
import { getTrips } from '@/app/actions/tripActions.server'
import { Button } from '../ui/button'

const DashboardOverview: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    async function fetchTrips() {
      try {
        const fetchedTrips = await getTrips()
        setTrips(fetchedTrips)
      } catch (err) {
        setError('Failed to fetch trips')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrips()
  }, [])

  const filteredTrips = trips.filter(trip => 
    trip.destination.toLowerCase().includes(filter.toLowerCase())
  )

  if (isLoading) return <div>Loading trips...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <input
        type="text"
        placeholder="Filter trips..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      {filteredTrips.length > 0 ? (
        <ul className="mb-6">
          {filteredTrips.map((trip) => (
            <li key={trip.id} className="mb-2">
              <Link href={`/trips/${trip.id}`}>
                {trip.destination} - {new Date(trip.start_date).toLocaleDateString()}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No trips found.</p>
      )}
      <Link href="/trips/new" passHref>
        <Button>Create New Trip</Button>
      </Link>
    </div>
  )
}

export default DashboardOverview
