'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import TripsList from '@/components/trips/TripsList'
import { Trip } from '@/lib/database.types'
export default function TripsPage() {
  const router = useRouter()

  const handleTripSelect = (tripId: Trip['id']) => {
    router.push(`/trips/${tripId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>
      <Button onClick={() => router.push('/trips/new')} className="mb-6">Create New Trip</Button>
      <TripsList onTripSelect={handleTripSelect} initialTrips={[]} />
    </div>
  )
}
