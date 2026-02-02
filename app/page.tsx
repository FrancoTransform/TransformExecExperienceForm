'use client'

import { useState } from 'react'
import { RegistrationFormData } from '@/lib/types'
import { getEligibleActivities, hasExecLoungeAccess } from '@/lib/activities'
import Image from 'next/image'

const initialFormData: RegistrationFormData = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  title: '',
  isCHRO: null,
  companySize: null,
  isExecMember: null,
  activities: {
    aiAtWorkMon: false,
    execChambersMon: false,
    sponsoredDinnerMon: false,
    execMemberLunchTue: false,
    chroExperienceLunchTue: false,
    chroTrackSessionTue: false,
    execChambersTue: false,
    vipDinnerTue: false,
    chroExperienceBreakfastWed: false,
    executiveBreakfastWed: false,
    execChambersWed: false,
  },
  stayingAtWynn: null,
  checkInDate: '',
  checkOutDate: '',
  dietaryRestrictions: [],
  dietaryOther: '',
}

export default function RegistrationPage() {
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showActivities, setShowActivities] = useState(false)

  const updateField = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateActivity = (activityId: keyof RegistrationFormData['activities'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      activities: { ...prev.activities, [activityId]: checked }
    }))
  }

  const handleQualificationComplete = () => {
    if (formData.isCHRO !== null && formData.companySize !== null && formData.isExecMember !== null) {
      setShowActivities(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        window.location.href = `/confirmation?id=${result.id}`
      } else {
        alert('Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const eligibleActivities = getEligibleActivities(formData)
  const loungeAccess = hasExecLoungeAccess(formData)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="Transform" width={200} height={60} className="h-16 w-auto" />
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You're Invited: Executive Experiences at Transform 2026
          </h1>
          <p className="text-gray-700 leading-relaxed mb-4">
            You've been selected to join our curated executive programming at Transform 2026. 
            These sessions, meals, and experiences are designed exclusively for senior HR leaders — 
            no vendors, no pitches, just meaningful conversations with peers navigating the same 
            challenges you are.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Tell us a bit about yourself below, and we'll show you the experiences available to you. 
            Space is limited, so register for what you'd like to attend and we'll confirm your spots.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Qualification Questions */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Qualification Questions</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Are you a CHRO, CPO, or equivalent chief-level people/HR leader? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      required
                      checked={formData.isCHRO === true}
                      onChange={() => {
                        updateField('isCHRO', true)
                        handleQualificationComplete()
                      }}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      required
                      checked={formData.isCHRO === false}
                      onChange={() => {
                        updateField('isCHRO', false)
                        updateField('companySize', null)
                        handleQualificationComplete()
                      }}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {formData.isCHRO === true && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How many employees are at your company? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        required
                        checked={formData.companySize === 'under_5000'}
                        onChange={() => {
                          updateField('companySize', 'under_5000')
                          handleQualificationComplete()
                        }}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">Under 5,000 employees</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        required
                        checked={formData.companySize === '5000_plus'}
                        onChange={() => {
                          updateField('companySize', '5000_plus')
                          handleQualificationComplete()
                        }}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">5,000+ employees</span>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Are you a current Transform Exec Member? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      required
                      checked={formData.isExecMember === true}
                      onChange={() => {
                        updateField('isExecMember', true)
                        handleQualificationComplete()
                      }}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      required
                      checked={formData.isExecMember === false}
                      onChange={() => {
                        updateField('isExecMember', false)
                        handleQualificationComplete()
                      }}
                      className="mr-3 h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Selection */}
          {showActivities && eligibleActivities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Select the Experiences You'd Like to Attend
              </h2>
              <p className="text-gray-600 mb-6">
                Check all that you plan to attend. We'll confirm your registration via email.
              </p>

              <div className="space-y-4">
                {eligibleActivities.map((activity) => (
                  <label key={activity.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activities[activity.id]}
                      onChange={(e) => updateActivity(activity.id, e.target.checked)}
                      className="mt-1 mr-4 h-5 w-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{activity.day}</span>
                        <span className="text-sm text-gray-600">{activity.time}</span>
                      </div>
                      <div className="font-medium text-gray-900 mb-1">{activity.name}</div>
                      <div className="text-sm text-gray-600">{activity.description}</div>
                    </div>
                  </label>
                ))}
              </div>

              {loungeAccess && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    ✓ Exec Lounge Access (Included)
                  </h3>
                  <p className="text-sm text-blue-800">
                    You automatically have access to the Exec Lounge throughout the conference.
                    This private space is available for relaxing, private meetings, and conference check-in.
                    No registration required.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Logistics Questions */}
          {showActivities && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Logistics</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Will you be staying at the Wynn Las Vegas? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        required
                        checked={formData.stayingAtWynn === true}
                        onChange={() => updateField('stayingAtWynn', true)}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        required
                        checked={formData.stayingAtWynn === false}
                        onChange={() => updateField('stayingAtWynn', false)}
                        className="mr-3 h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {formData.stayingAtWynn === true && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => updateField('checkInDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        value={formData.checkOutDate}
                        onChange={(e) => updateField('checkOutDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Do you have any food allergies or dietary restrictions?
                  </label>
                  <div className="space-y-2">
                    {['None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Kosher', 'Halal'].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.dietaryRestrictions.includes(option)}
                          onChange={(e) => {
                            const newRestrictions = e.target.checked
                              ? [...formData.dietaryRestrictions, option]
                              : formData.dietaryRestrictions.filter(r => r !== option)
                            updateField('dietaryRestrictions', newRestrictions)
                          }}
                          className="mr-3 h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other (please specify)
                      </label>
                      <input
                        type="text"
                        value={formData.dietaryOther}
                        onChange={(e) => updateField('dietaryOther', e.target.value)}
                        placeholder="Please specify any other dietary needs"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {showActivities && (
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Register for Executive Experiences'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
