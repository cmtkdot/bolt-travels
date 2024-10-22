'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Trip, Activity } from '../../lib/database.types';
import { getTrip, getActivities } from '../../app/actions/tripActions.server';
import ActivityManager from '../activities/ActivityManager';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import CurrencyConverter from '../../utils/CurrencyConverter';
import PdfUploadProcessor from '../../utils/PdfUploadProcessor';
import { useToast } from '../../hooks/useToast';
import dynamic from 'next/dynamic';

const WeatherWidget = dynamic(() => import('../weather/WeatherComponent'), { ssr: false });

interface TripDetailsProps {
  id: string;
}

interface TravelTip {
  title: string;
  content: string;
}

const TripDetails: React.FC<TripDetailsProps> = ({ id }) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [travelTips, setTravelTips] = useState<TravelTip[]>([]);
  const [isTipsLoading, setIsTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchTripAndActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTrip = await getTrip(id);
      if (!fetchedTrip) {
        throw new Error('Trip not found');
      }
      setTrip(fetchedTrip);
      
      const fetchedActivities = await getActivities(id);
      setActivities(fetchedActivities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trip details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTripAndActivities();
  }, [fetchTripAndActivities]);

  const generateTravelTips = async () => {
    if (!trip) return;

    setIsTipsLoading(true);
    setTipsError(null);
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: trip.destination,
          tripType: 'general',
          duration: `${Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 3600 * 24))} days`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate travel tips');
      }

      const data = await response.json();
      setTravelTips(data.tips);
    } catch (err) {
      console.error('Error generating travel tips:', err);
      setTipsError('Failed to generate travel tips. Please try again.');
    } finally {
      setIsTipsLoading(false);
    }
  };

  const handlePdfProcessed = (processedData: any) => {
    console.log('Processed PDF data:', processedData);
    toast({
      title: 'PDF Processed',
      description: 'Your PDF has been successfully processed and the data has been added to your trip.',
    });
    fetchTripAndActivities(); // Refetch trip data to update with new information
  };

  if (isLoading) {
    return <div>Loading trip details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!trip) return <div>No trip found</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{trip.destination}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Date: {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
          <p>Budget: {trip.total_budget} {trip.currency}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="travel-tips">Travel Tips</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="pdf-upload">Upload PDF</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityManager tripId={id} activities={activities} onActivityChange={fetchTripAndActivities} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="travel-tips">
          <Card>
            <CardHeader>
              <CardTitle>Travel Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <button
                onClick={generateTravelTips}
                disabled={isTipsLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isTipsLoading ? 'Generating...' : 'Generate Travel Tips'}
              </button>
              {tipsError && <p className="text-red-500 mt-2">{tipsError}</p>}
              {travelTips.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {travelTips.map((tip, index) => (
                    <li key={index} className="border-b pb-2">
                      <h4 className="font-semibold">{tip.title}</h4>
                      <p>{tip.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weather">
          <Card>
            <CardHeader>
              <CardTitle>Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherWidget location={trip.destination} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency">
          <Card>
            <CardHeader>
              <CardTitle>Currency Converter</CardTitle>
            </CardHeader>
            <CardContent>
              <CurrencyConverter
                initialAmount={trip.total_budget}
                initialFromCurrency={trip.currency}
                initialToCurrency="USD"
                autoConvert={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf-upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <PdfUploadProcessor 
                tripId={id}
                onProcessed={handlePdfProcessed}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripDetails;
