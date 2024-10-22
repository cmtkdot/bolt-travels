'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, DollarSign, Umbrella, Plane, Camera, ArrowRight } from 'lucide-react'
import { LoginModal } from "@/components/auth/LoginModal"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { icon: <MapPin className="h-8 w-8" />, title: 'Trip Planning', description: 'Plan and organize your trips together' },
    { icon: <Calendar className="h-8 w-8" />, title: 'Itinerary Management', description: 'Create detailed day-by-day itineraries for your adventures' },
    { icon: <DollarSign className="h-8 w-8" />, title: 'Budget Tracking', description: 'Keep track of your shared expenses and stay on budget' },
    { icon: <Umbrella className="h-8 w-8" />, title: 'Weather Forecasts', description: 'Get real-time weather updates for your destinations' },
    { icon: <Plane className="h-8 w-8" />, title: 'Travel Documents', description: 'Store and organize all your travel documents in one place' },
    { icon: <Camera className="h-8 w-8" />, title: 'Photo Albums', description: 'Create beautiful memories with shared trip photo albums' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="J&S Travel Logo" width={50} height={50} className="mr-2" />
          <div className="text-2xl font-bold text-blue-600">J&S Travel</div>
        </div>
        <nav>
          <LoginModal>
            <Button variant="ghost">Log In</Button>
          </LoginModal>
          <LoginModal>
            <Button>View Trips</Button>
          </LoginModal>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Welcome Back, Jonathon & Stephanie!
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            Your love story continues with every adventure. Ready to plan your next unforgettable journey together?
          </p>
          <LoginModal>
            <Button size="lg">
              View Your Trips <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </LoginModal>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="mb-2 text-blue-500">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollY > 200 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-8 text-gray-600">
            Relive your past trips or start planning your next romantic getaway.
          </p>
          <LoginModal>
            <Button size="lg">View Your Trips</Button>
          </LoginModal>
        </motion.div>
      </main>

      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2023 J&S Travel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
