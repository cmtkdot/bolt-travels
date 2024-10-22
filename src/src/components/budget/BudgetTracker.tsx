import React from "react"
import { Trip } from "../../lib/database.types"
import CurrencyConverter from "../utils/CurrencyConverter"

interface BudgetTrackerProps {
  trip: Trip;
}

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ trip }) => {
  // Component implementation
  return (
    <div>
      <h2>Budget Tracker for {trip.name}</h2>
      <p>Total Budget: {trip.total_budget} {trip.currency}</p>
      <CurrencyConverter
        initialAmount={trip.total_budget}
        initialFromCurrency={trip.currency}
        initialToCurrency="USD"
      />
      {/* Add more budget tracking features here */}
    </div>
  );
};

export default BudgetTracker;
