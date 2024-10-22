import React from 'react'
import { notFound } from 'next/navigation'
import TripDetails from '../../../components/trips/TripDetails'
import { getTrip } from '../../../app/actions/tripActions.server'

export default async function TripPage({ params }: { params: { id: string } }) {
  try {
    const trip = await getTrip(params.id)
    
    if (!trip) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <TripDetails id={params.id} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching trip:', error)
    return <div>Error loading trip details. Please try again later.</div>
  }
}
