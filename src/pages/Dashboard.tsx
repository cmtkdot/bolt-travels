import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h2>
      <p>This is your dashboard. Here you can view and manage your trips.</p>
      {/* TODO: Add trip list and management features */}
    </div>
  );
};

export default Dashboard;