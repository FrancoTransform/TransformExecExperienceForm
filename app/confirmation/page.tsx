'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="Transform" width={200} height={60} className="h-16 w-auto" />
        </div>

        {/* Confirmation Message */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You're Registered
            </h1>
            <p className="text-gray-700 leading-relaxed">
              Thanks for registering for Executive Experiences at Transform 2026. 
              We've received your selections and will send a confirmation email with 
              details for each event you signed up for.
            </p>
          </div>

          {registration && registration.selectedActivities.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Selections:</h2>
              <ul className="space-y-3">
                {registration.selectedActivities.map((activityName, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{activityName}</span>
                  </li>
                ))}
              </ul>

              {registration.stayingAtWynn && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-gray-700">
                    <span className="font-semibold">Hotel:</span> Staying at Wynn Las Vegas
                    {registration.checkInDate && registration.checkOutDate && (
                      <span className="ml-2">
                        (Check-in: {new Date(registration.checkInDate).toLocaleDateString()}, 
                        Check-out: {new Date(registration.checkOutDate).toLocaleDateString()})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {registration.dietaryRestrictions.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Dietary Restrictions:</span>{' '}
                    {registration.dietaryRestrictions.join(', ')}
                    {registration.dietaryOther && `, ${registration.dietaryOther}`}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-gray-700 mb-2">
              Questions? Contact{' '}
              <a href="mailto:exec@transform.us" className="text-blue-600 hover:underline">
                exec@transform.us
              </a>
            </p>
            <p className="text-gray-900 font-semibold">See you in Las Vegas.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
