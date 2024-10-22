'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Activity } from '../../lib/database.types'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'

interface ActivityFormProps {
  onSubmit: (activity: Partial<Activity>) => void
  initialData?: Partial<Activity>
}

declare global {
  interface Window {
    google: any;
  }
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [date, setDate] = useState(initialData?.date || '')
  const [startTime, setStartTime] = useState(initialData?.start_time || '')
  const [endTime, setEndTime] = useState(initialData?.end_time || '')
  const [location, setLocation] = useState(initialData?.location || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '')

  const autocompleteRef = useRef<HTMLInputElement>(null)
  const autocompleteInstance = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && autocompleteRef.current) {
      autocompleteInstance.current = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ['establishment']
      })

      autocompleteInstance.current.addListener('place_changed', handlePlaceSelect)
    }
  }, [])

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setDate(initialData.date || '')
      setStartTime(initialData.start_time || '')
      setEndTime(initialData.end_time || '')
      setLocation(initialData.location || '')
      setPrice(initialData.price?.toString() || '')
    }
  }, [initialData])

  const handlePlaceSelect = () => {
    const place = autocompleteInstance.current.getPlace()
    setLocation(place.formatted_address)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...initialData,
      title,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      location,
      price: price ? parseFloat(price) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Activity Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter activity title"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter activity description"
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="endTime">End Time</Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          type="text"
          ref={autocompleteRef}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter activity location"
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter activity price"
          step="0.01"
        />
      </div>
      <Button type="submit">{initialData ? 'Update Activity' : 'Add Activity'}</Button>
    </form>
  )
}

export default ActivityForm
