'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MapPin, Plus, Sun, Cloud, CloudRain, DollarSign, Plane } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import WeatherComponent from '@/components/weather/WeatherComponent'

type Trip = Database['public']['Tables']['trips']['Row']
type Activity = Database['public']['Tables']['activities']['Row']

type WeatherData = {
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy'
  location: string
  date: string
}

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [weather, setWeather] = useState<WeatherData[]>([])
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      // Fetch trips
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: true })

      if (tripsError) {
        console.error('Error fetching trips:', tripsError)
      } else {
        setTrips(tripsData)
      }

      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .order('date', { ascending: true })

      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError)
      } else {
        setActivities(activitiesData)
      }

      // For weather, we'll keep the mock data for now
      // In a real application, you'd fetch this from a weather API
      const mockWeather: WeatherData[] = [
        { temperature: 22, condition: 'sunny', location: 'Paris, France', date: '2023-07-15' },
        { temperature: 23, condition: 'cloudy', location: 'Paris, France', date: '2023-07-16' },
        { temperature: 21, condition: 'rainy', location: 'Paris, France', date: '2023-07-17' },
      ]
      setWeather(mockWeather)
    }

    fetchData()
  }, [user, router, supabase])

  if (!user) {
    return null // or a loading spinner
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-500" />
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-500" />
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-blue-500" />
      default:
        return null
    }
  }

  const upcomingTrip = trips.length > 0 ? trips[0] : null
  const upcomingTripActivities = activities.filter(activity => activity.trip_id === upcomingTrip?.id)
  const totalSpentUpcomingTrip = upcomingTripActivities.reduce((sum, activity) => sum + (activity.price || 0), 0)

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/trips/new">
            <Plus className="mr-2 h-4 w-4" /> New Trip
          </Link>
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trip</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTrip?.name || 'No upcoming trips'}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingTrip ? `${upcomingTrip.start_date} - ${upcomingTrip.end_date}` : ''}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trip Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${upcomingTrip?.total_budget || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trip Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSpentUpcomingTrip}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {trips.slice(0, 3).map(trip => (
                <div key={trip.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://source.unsplash.com/100x100/?${trip.destination}`} alt={trip.name} />
                    <AvatarFallback>{trip.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{trip.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {trip.start_date} - {trip.end_date}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    ${activities.filter(a => a.trip_id === trip.id).reduce((sum, a) => sum + (a.price || 0), 0)} / ${trip.total_budget}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/trips">View All Trips</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
            <CardDescription>For your next destination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weather.map((day, index) => (
                <div key={index} className="flex items-center">
                  {getWeatherIcon(day.condition)}
                  <div className="ml-4">
                    <p className="text-sm font-medium">{day.location}</p>
                    <p className="text-xl font-bold">{day.temperature}°C</p>
                    <p className="text-sm text-muted-foreground">{day.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Activities for {upcomingTrip?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {upcomingTripActivities.slice(0, 3).map(activity => (
              <div key={activity.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://source.unsplash.com/100x100/?${activity.location}`} alt={activity.title} />
                  <AvatarFallback>{activity.title[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.date} - {activity.location}
                  </p>
                </div>
                <div className="ml-auto text-sm font-medium">
                  ${activity.price}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/trips/${upcomingTrip?.id}/activities`}>View All Activities</Link>
          </Button>
        </CardFooter>
      </Card>
      <WeatherComponent location="London" />
    </div>
  )
}
