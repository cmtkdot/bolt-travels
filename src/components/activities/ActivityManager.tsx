'use client'

import React, { useState, useEffect } from 'react'
import { Activity } from '../../lib/database.types'
import { getActivities, updateActivity, deleteActivity, addActivity } from '../../app/actions/tripActions.server'
import ActivityForm from './ActivityForm'

interface ActivityManagerProps {
  tripId: string
  activities: Activity[]
  onActivityChange: () => void
}

export default function ActivityManager({ tripId, activities, onActivityChange }: ActivityManagerProps) {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  const handleAddActivity = async (newActivity: Partial<Activity>) => {
    try {
      const addedActivity = await addActivity(tripId, newActivity)
      setActivities(prev => prev ? [...prev, addedActivity] : [addedActivity])
      onActivityChange()
    } catch (err) {
      setError('Failed to add activity')
      console.error(err)
    }
  }

  const handleUpdateActivity = async (updatedActivity: Partial<Activity>) => {
    if (!editingActivity) return
    try {
      const fullUpdatedActivity = await updateActivity({ ...updatedActivity, id: editingActivity.id })
      setActivities(prev => 
        prev ? prev.map(act => act.id === fullUpdatedActivity.id ? fullUpdatedActivity : act) : null
      )
      setEditingActivity(null)
      onActivityChange()
    } catch (err) {
      setError('Failed to update activity')
      console.error(err)
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity(activityId, tripId)
        setActivities(prev => prev ? prev.filter(act => act.id !== activityId) : null)
        onActivityChange()
      } catch (err) {
        setError('Failed to delete activity')
        console.error(err)
      }
    }
  }

  if (activities.length > 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Activities</h2>
        <ul className="mb-6 space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{activity.title}</span>
                <div>
                  <button 
                    onClick={() => setEditingActivity(activity)} 
                    className="mr-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">Date: {new Date(activity.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Time: {activity.start_time} - {activity.end_time}</p>
              {activity.location && <p className="text-sm text-gray-600">Location: {activity.location}</p>}
              {activity.price && <p className="text-sm text-gray-600">Price: ${activity.price.toFixed(2)}</p>}
              {activity.description && <p className="mt-2 text-gray-700">{activity.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    )
  } else {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Activities</h2>
        <p>No activities added yet.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Activities</h2>
      {activities.length > 0 ? (
        <ul className="mb-6 space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{activity.title}</span>
                <div>
                  <button 
                    onClick={() => setEditingActivity(activity)} 
                    className="mr-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">Date: {new Date(activity.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Time: {activity.start_time} - {activity.end_time}</p>
              {activity.location && <p className="text-sm text-gray-600">Location: {activity.location}</p>}
              {activity.price && <p className="text-sm text-gray-600">Price: ${activity.price.toFixed(2)}</p>}
              {activity.description && <p className="mt-2 text-gray-700">{activity.description}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities added yet.</p>
      )}
      <ActivityForm 
        onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity} 
        initialData={editingActivity || undefined}
      />
      {editingActivity && (
        <button 
          onClick={() => setEditingActivity(null)} 
          className="mt-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel Editing
        </button>
      )}
    </div>
  )
}
