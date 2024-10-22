import React from 'react';
import { Activity } from '@/lib/database.types';

interface ActivityOverviewProps {
  activities: Activity[];
}

const ActivityOverview: React.FC<ActivityOverviewProps> = ({ activities }) => {
  return (
    <div>
      <h3>Recent Activities</h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>{activity.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityOverview;
