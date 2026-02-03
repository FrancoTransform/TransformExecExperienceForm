'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { activityToCalendarEvent, downloadICS } from '@/lib/calendar'
import Hero from '@/components/Hero'

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  selectedActivities: string[]
  stayingAtWynn: boolean
  checkInDate?: string
  checkOutDate?: string
  dietaryRestrictions: string[]
  dietaryOther?: string
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('id')
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(true)

  const handleAddToCalendar = (activityString: string) => {
    const event = activityToCalendarEvent(activityString)
    if (event) {
      const filename = `transform-2026-${event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`
      downloadICS(event, filename)
    }
  }

  useEffect(() => {
    const fetchRegistration = async () => {
      if (!registrationId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/registration/${registrationId}`)
        if (response.ok) {
          const data = await response.json()
          setRegistration(data)
        }
      } catch (error) {
        console.error('Error fetching registration:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRegistration()
  }, [registrationId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-purple-600 text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Banner */}
      <Hero />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Confirmation Message */}
        <div className="card-transform p-8 mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-4">
              You&apos;re Registered!
            </h1>
            <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
              Thanks for registering for Executive Experiences at Transform 2026.
              We&apos;ve received your selections and will send a confirmation email with
              details for each event you signed up for.
            </p>
          </div>

          {registration && registration.selectedActivities.length > 0 && (
            <div className="mt-8 border-t border-purple-100 pt-6">
              <h2 className="text-xl font-bold text-purple-900 mb-4">Your Selections:</h2>
              <ul className="space-y-4">
                {registration.selectedActivities.map((activityName, index) => (
                  <li key={index} className="flex items-start justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-start flex-1">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{activityName}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCalendar(activityName)}
                      className="ml-4 flex-shrink-0 inline-flex items-center px-4 py-2 border-2 border-purple-300 text-sm font-medium rounded-lg text-purple-700 bg-white hover:bg-purple-50 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Add to Calendar
                    </button>
                  </li>
                ))}
              </ul>

              {registration.stayingAtWynn && (
                <div className="mt-6 pt-6 border-t border-purple-100">
                  <div className="flex items-center text-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </span>
                    <span className="font-semibold text-purple-900">Hotel:</span>
                    <span className="ml-2">Staying at Wynn Las Vegas</span>
                    {registration.checkInDate && registration.checkOutDate && (
                      <span className="ml-2 text-gray-500">
                        (Check-in: {new Date(registration.checkInDate).toLocaleDateString()},
                        Check-out: {new Date(registration.checkOutDate).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                </div>
              )}

              {registration.dietaryRestrictions.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center text-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-pink-100 rounded-full mr-3">
                      <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </span>
                    <span className="font-semibold text-purple-900">Dietary Restrictions:</span>
                    <span className="ml-2">
                      {registration.dietaryRestrictions.join(', ')}
                      {registration.dietaryOther && `, ${registration.dietaryOther}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-purple-100 text-center">
            <p className="text-gray-600 mb-3">
              Questions? Contact{' '}
              <a href="mailto:exec@transform.us" className="text-purple-600 hover:text-purple-800 font-medium hover:underline transition-colors">
                exec@transform.us
              </a>
            </p>
            <p className="text-lg font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
              See you in Las Vegas! 🎰
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-purple-600 text-lg">Loading...</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
