'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Database } from '../../lib/database.types';
import { Trip, NewHotel, Hotel, Activity } from '../../lib/database.types';

async function getSupabase() {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}

export async function createTrip(tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>): Promise<Trip> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('trips')
    .insert(tripData)
    .select()
    .single();

  if (error) throw new Error(`Failed to create trip: ${error.message}`);
  revalidatePath('/trips');
  return data;
}

export async function getTrip(tripId: string): Promise<Trip> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single();

  if (error) throw new Error(`Failed to get trip: ${error.message}`);
  return data;
}

export async function updateTrip(trip: Trip): Promise<Trip> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('trips')
    .update(trip)
    .eq('id', trip.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update trip: ${error.message}`);
  revalidatePath(`/trips/${trip.id}`);
  return data;
}

export async function getTrips(): Promise<Trip[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('trips')
    .select('*');

  if (error) throw new Error(`Failed to get trips: ${error.message}`);
  return data;
}

export async function getActivities(tripId: string): Promise<Activity[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('trip_id', tripId)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) throw new Error(`Failed to get activities: ${error.message}`);
  return data;
}

export async function addActivity(tripId: string, activityData: Partial<Activity>): Promise<Activity> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('activities')
    .insert({ 
      ...activityData, 
      trip_id: tripId,
      price: activityData.price ? parseFloat(activityData.price.toString()) : null
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to add activity: ${error.message}`);
  revalidatePath(`/trips/${tripId}`);
  return data;
}

export async function updateActivity(activity: Partial<Activity> & { id: string }): Promise<Activity> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('activities')
    .update(activity)
    .eq('id', activity.id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update activity: ${error.message}`);
  revalidatePath(`/trips/${activity.trip_id}`);
  return data;
}

export async function deleteActivity(activityId: string, tripId: string): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', activityId);

  if (error) throw new Error(`Failed to delete activity: ${error.message}`);
  revalidatePath(`/trips/${tripId}`);
}

export async function addHotelToTrip(tripId: string, hotelData: NewHotel): Promise<Hotel> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('hotels')
    .insert({ ...hotelData, trip_id: tripId })
    .select()
    .single();

  if (error) throw new Error(`Failed to add hotel: ${error.message}`);
  revalidatePath(`/trips/${tripId}`);
  return data;
}

export async function getHotelsForTrip(tripId: string): Promise<Hotel[]> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('trip_id', tripId);

  if (error) throw new Error(`Failed to get hotels: ${error.message}`);
  return data;
}

export async function updateHotel(hotelId: string, hotelData: Partial<Hotel>): Promise<Hotel> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('hotels')
    .update(hotelData)
    .eq('id', hotelId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update hotel: ${error.message}`);
  revalidatePath(`/trips/${hotelData.trip_id}`);
  return data;
}

export async function deleteHotel(hotelId: string, tripId: string): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('hotels')
    .delete()
    .eq('id', hotelId);

  if (error) throw new Error(`Failed to delete hotel: ${error.message}`);
  revalidatePath(`/trips/${tripId}`);
}
