import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Welcome to TravelBuddy</h1>
      <p className="text-xl mb-8">Plan your next adventure with ease!</p>
      <Button asChild>
        <Link href="/trip-planner">Start Planning</Link>
      </Button>
    </main>
  )
}