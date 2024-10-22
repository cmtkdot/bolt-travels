import { TripProvider } from '@/contexts/TripContext';
import NewTripForm from '@/components/trips/NewTripForm';

export default function NewTripPage() {
  return (
    <TripProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Create New Trip</h1>
        <NewTripForm />
      </div>
    </TripProvider>
  );
}
