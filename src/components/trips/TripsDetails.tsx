import React from 'react';
import { Trip, Activity } from '@/lib/database.types';
import { BudgetOverview } from '@/components/budget/BudgetOverview';

interface TripDetailsProps {
  trip: Trip;
  activities: Activity[];
}

export const TripDetails: React.FC<TripDetailsProps> = ({ trip, activities }) => {
  return (
    <div>
      <h1>{trip.name}</h1>
      <p>Destination: {trip.destination}</p>
      <p>Dates: {trip.start_date} - {trip.end_date}</p>
      <BudgetOverview trips={[trip]} />
      <h2>Activities</h2>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>{activity.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default TripDetails;
