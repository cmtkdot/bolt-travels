import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to TravelBuddy</h1>
      <p className="text-xl mb-8">Plan your next adventure with ease!</p>
      <Link to="/trip-planner" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
        Start Planning
      </Link>
    </div>
  );
};

export default Home;