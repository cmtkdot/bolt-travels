import React, { useState, useEffect } from 'react';
import { Trip, Activity } from '../../lib/types';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import ActivityCard from './ActivityCard';
import AddActivityForm from './AddActivityForm';

type ItineraryViewProps = {
  trip: Trip;
  activities: Activity[];
  viewType: 'daily' | 'weekly' | 'full';
  onActivityUpdate: (activity: Activity) => Promise<void>;
  onActivityDelete: (activityId: number) => Promise<void>;
};

const ItineraryView: React.FC<ItineraryViewProps> = ({ trip, activities, viewType, onActivityUpdate, onActivityDelete }) => {
  const [groupedActivities, setGroupedActivities] = useState<Record<string, Activity[]>>({});

  useEffect(() => {
    setGroupedActivities(groupActivitiesByDate(activities));
  }, [activities]);

  const groupActivitiesByDate = (activities: Activity[]): Record<string, Activity[]> => {
    return activities.reduce((acc, activity) => {
      const date = format(parseISO(activity.date), 'yyyy-MM-dd');
      if (!acc[date]) acc[date] = [];
      acc[date].push(activity);
      return acc;
    }, {} as Record<string, Activity[]>);
  };

  const handleActivityAdded = (newActivity: Activity) => {
    setGroupedActivities(prevGrouped => {
      const date = format(parseISO(newActivity.date), 'yyyy-MM-dd');
      return {
        ...prevGrouped,
        [date]: [...(prevGrouped[date] || []), newActivity]
      };
    });
  };

  const renderActivities = (activities: Activity[], date: string) => (
    <>
      <ul className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onUpdate={onActivityUpdate}
            onDelete={onActivityDelete}
          />
        ))}
      </ul>
      <AddActivityForm
        tripId={trip.id}
        date={date}
        onActivityAdded={handleActivityAdded}
      />
    </>
  );

  const renderDailyView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Daily Itinerary for {trip.name}</h2>
      {Object.entries(groupedActivities).map(([date, dayActivities]) => (
        <div key={date} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>
          {renderActivities(dayActivities, date)}
        </div>
      ))}
    </div>
  );

  const renderWeeklyView = () => {
    const startDate = parseISO(trip.start_date);
    const endDate = parseISO(trip.end_date);

    const weeks = eachDayOfInterval({ start: startDate, end: endDate })
      .filter((date) => date.getDay() === 0)
      .map((weekStart) => {
        const weekEnd = endOfWeek(weekStart) > endDate ? endDate : endOfWeek(weekStart);
        return {
          start: weekStart,
          end: weekEnd,
          activities: activities.filter((activity) => {
            const activityDate = parseISO(activity.date);
            return activityDate >= weekStart && activityDate <= weekEnd;
          })
        };
      });

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Weekly Itinerary for {trip.name}</h2>
        {weeks.map((week, index) => (
          <div key={index} className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Week {index + 1}: {format(week.start, 'MMM d')} - {format(week.end, 'MMM d, yyyy')}
              </h3>
            </div>
            {renderActivities(week.activities, format(week.start, 'yyyy-MM-dd'))}
          </div>
        ))}
      </div>
    );
  };

  const renderFullTripView = () => {
    const sortedDates = Object.keys(groupedActivities).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Full Trip View for {trip.name}</h2>
        {sortedDates.map((date) => (
          <div key={date} className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
              </h3>
            </div>
            {renderActivities(groupedActivities[date], date)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {viewType === 'daily' && renderDailyView()}
      {viewType === 'weekly' && renderWeeklyView()}
      {viewType === 'full' && renderFullTripView()}
    </div>
  );
};

export default ItineraryView;
