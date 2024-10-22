'use client'

import { ActivityRecommendations } from '@/components/activities/ActivityRecommendations'
import { ActivityRecommendationsProvider } from '@/components/activities/ActivityRecommendationsContext'

export default function ActivityRecommendationsPage() {
  return (
    <ActivityRecommendationsProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Activity Recommendations</h1>
        <ActivityRecommendations />
      </div>
    </ActivityRecommendationsProvider>
  )
}
