'use client'

import React, { useState } from 'react'
import { Database } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import CurrencyConverter from '@/components/utils/CurrencyConverter'
import { useUser } from '@supabase/auth-helpers-react'

type Trip = Database['public']['Tables']['trips']['Row']

export interface TripsListProps {
  onTripSelect: (tripId: string) => void
  initialTrips: Trip[]
}

const TripsList: React.FC<TripsListProps> = ({ onTripSelect, initialTrips }) => {
  const [trips] = useState<Trip[]>(initialTrips)
  const [sortBy, setSortBy] = useState<keyof Trip>('start_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const tripsPerPage = 5
  const currentUser = useUser()

  const sortedAndFilteredTrips = React.useMemo(() => {
    return trips
      .filter((trip) =>
        trip.destination.toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortBy]
        const bValue = b[sortBy]
        if (aValue == null || bValue == null) return 0
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [trips, sortBy, sortOrder, filter])

  const paginatedTrips = React.useMemo(() => {
    const startIndex = (currentPage - 1) * tripsPerPage
    return sortedAndFilteredTrips.slice(startIndex, startIndex + tripsPerPage)
  }, [sortedAndFilteredTrips, currentPage])

  const totalPages = Math.ceil(sortedAndFilteredTrips.length / tripsPerPage)

  const handleTripClick = (tripId: string) => {
    if (onTripSelect) {
      onTripSelect(tripId)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <Input
          type="text"
          placeholder="Filter by destination"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full"
        />
        <Select onValueChange={(value) => setSortBy(value as keyof Trip)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="start_date">Start Date</SelectItem>
            <SelectItem value="destination">Destination</SelectItem>
            <SelectItem value="total_budget">Budget</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      {paginatedTrips.map((trip) => (
        <div
          key={trip.id}
          onClick={() => handleTripClick(trip.id)}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out cursor-pointer"
        >
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>{trip.destination}</h3>
          <p className='text-gray-600 dark:text-gray-300'>
            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
          </p>
          <p className='text-gray-500 dark:text-gray-400'>Destination: {trip.destination}</p>
          <div className='text-gray-500 dark:text-gray-400 flex items-center space-x-2'>
            <span>Budget:</span>
            <CurrencyConverter 
              initialAmount={trip.total_budget}
              initialFromCurrency={trip.currency}
              initialToCurrency="USD"
              autoConvert={false}
            />
          </div>
          {currentUser && trip.is_public && (
            <p className='text-blue-500'>Public trip</p>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default TripsList
