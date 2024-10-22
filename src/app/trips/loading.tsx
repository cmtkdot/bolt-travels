import React from 'react';

const TripsLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Loading Trips...</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 p-4 rounded-md animate-pulse h-48"></div>
        ))}
      </div>
    </div>
  );
}

export default TripsLoading;
