import Link from 'next/link'
import { Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  // TODO: Implement actual authentication logic
  const isLoggedIn = false

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
          <Plane size={32} />
          <span>TravelBuddy</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Button variant="ghost" asChild><Link href="/">Home</Link></Button></li>
            {isLoggedIn ? (
              <>
                <li><Button variant="ghost" asChild><Link href="/dashboard">Dashboard</Link></Button></li>
                <li><Button variant="ghost" asChild><Link href="/trip-planner">Plan a Trip</Link></Button></li>
                <li><Button variant="ghost">Logout</Button></li>
              </>
            ) : (
              <li><Button variant="ghost" asChild><Link href="/login">Login</Link></Button></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}