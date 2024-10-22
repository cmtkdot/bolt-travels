import React from 'react';
import { Activity } from '@/lib/database.types';
import { Button } from '@/components/ui/button';

interface ActivityCardProps {
  activity: Activity;
  onDelete: (id: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onDelete }) => {
  return (
    <div className="border p-4 mb-4 rounded-lg">
      <h3 className="text-lg font-semibold">{activity.title}</h3>
      <p>{activity.description}</p>
      <p>Date: {activity.date}</p>
      <p>Time: {activity.start_time} - {activity.end_time}</p>
      <p>Location: {activity.location}</p>
      <p>Price: {activity.price}</p>
      <Button variant="destructive" onClick={() => onDelete(activity.id)}>
        Delete
      </Button>
    </div>
  );
};

export default ActivityCard;
