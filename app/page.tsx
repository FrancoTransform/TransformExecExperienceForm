'use client'

import { useState } from 'react'
import { RegistrationFormData } from '@/lib/types'
import { getEligibleActivities, hasExecLoungeAccess } from '@/lib/activities'
import Hero from '@/components/Hero'

const initialFormData: RegistrationFormData = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  title: '',
  isCHRO: null,
  companySize: null,
  isExecMember: null,
  chroTrackCompanySizeDetail: null,
  chroTrackCompanyPresence: null,
  chroTrackCompanyType: null,
  chroTrackBiggestChallenge: '',
  chroTrackWinToShare: '',
  chroTrackSessionGoals: [],
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

type Step = 'welcome' | 'contact' | 'qualification' | 'chroTrack' | 'activities' | 'logistics' | 'review'

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateActivity = (activityId: keyof RegistrationFormData['activities'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      activities: { ...prev.activities, [activityId]: checked }
    }))
  }

  const handleDietaryChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, value]
        : prev.dietaryRestrictions.filter(item => item !== value)
    }))
  }

  const eligibleActivities = getEligibleActivities(formData)
  const hasLoungeAccess = hasExecLoungeAccess(formData)

  // Determine if user should see CHRO Track step
  const shouldShowCHROTrack = formData.isCHRO === true && formData.companySize === 'under_5000'

  // Build steps array dynamically based on qualification
  const steps: Step[] = shouldShowCHROTrack
    ? ['welcome', 'contact', 'qualification', 'chroTrack', 'activities', 'logistics', 'review']
    : ['welcome', 'contact', 'qualification', 'activities', 'logistics', 'review']

  const stepTitles: Record<Step, string> = {
    welcome: 'Welcome',
    contact: 'Contact Information',
    qualification: 'Tell Us More',
    chroTrack: 'Build Your Experience',
    activities: 'Select Activities',
    logistics: 'Logistics',
    review: 'Review & Submit'
  }

  const canProceedFromStep = (step: Step): boolean => {
    switch (step) {
      case 'welcome':
        return true
      case 'contact':
        return !!(formData.firstName && formData.lastName && formData.email && formData.company && formData.title)
      case 'qualification':
        return formData.isCHRO !== null && formData.isExecMember !== null &&
               (formData.isCHRO === false || formData.companySize !== null)
      case 'chroTrack':
        // All CHRO Track questions are required
        return !!(
          formData.chroTrackCompanySizeDetail &&
          formData.chroTrackCompanyPresence &&
          formData.chroTrackCompanyType &&
          formData.chroTrackBiggestChallenge.trim() &&
          formData.chroTrackWinToShare.trim() &&
          formData.chroTrackSessionGoals.length > 0
        )
      case 'activities':
        return true // Optional to select activities
      case 'logistics':
        return formData.stayingAtWynn !== null &&
               (formData.stayingAtWynn === false || !!(formData.checkInDate && formData.checkOutDate))
      case 'review':
        return true
      default:
        return false
    }
  }

  const scrollToStepContent = () => {
    const el = document.getElementById('step-content')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1 && canProceedFromStep(currentStep)) {
      setCurrentStep(steps[currentIndex + 1])
      scrollToStepContent()
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
      scrollToStepContent()
    }
  }

  const goToStep = (step: Step) => {
    setCurrentStep(step)
    scrollToStepContent()
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        window.location.href = `/confirmation?id=${result.id}`
      } else {
        console.error('Registration failed:', result)
        alert(`Registration failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Banner */}
      <Hero />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">
          <div className="flex justify-between mb-3">
            {steps.map((step, index) => (
              <div key={step} className="flex-1 text-center">
                <div className={`text-xs font-semibold transition-colors ${
                  index <= currentStepIndex
                    ? 'text-purple-700'
                    : 'text-gray-400'
                }`}>
                  {stepTitles[step]}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div id="step-content" className="card-transform p-8">
          {currentStep === 'welcome' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-4">
                You&apos;re Invited: Executive Experiences at Transform 2026
              </h1>
              <div className="text-gray-600 space-y-4 mb-8 max-w-2xl mx-auto text-left">
                <p className="leading-relaxed">
                  You&apos;ve been selected to join our curated executive programming at Transform 2026.
                  These sessions, meals, and experiences are designed exclusively for senior HR leaders —
                  no vendors, no pitches, just meaningful conversations with peers navigating the same
                  challenges you are.
                </p>
                <p className="leading-relaxed">
                  Tell us a bit about yourself below, and we&apos;ll show you the experiences available to you.
                  Space is limited, so register for what you&apos;d like to attend and we&apos;ll confirm your spots.
                </p>
              </div>
            </div>
          )}

          {currentStep === 'contact' && (
            <div>
              <h2 className="text-2xl font-bold text-purple-900 mb-6">Contact Information</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="input-transform"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className="input-transform"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="input-transform"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    className="input-transform"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    className="input-transform"
                    required
                  />
                </div>
              </div>
            </div>
          )}


          {currentStep === 'qualification' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell Us More</h2>
              <div className="space-y-6">
                {/* CHRO Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Are you a CHRO, CPO, or equivalent chief-level people/HR leader? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.isCHRO === true}
                        onChange={() => updateField('isCHRO', true)}
                        className="mr-2"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.isCHRO === false}
                        onChange={() => {
                          updateField('isCHRO', false)
                          updateField('companySize', null)
                        }}
                        className="mr-2"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* Company Size Question - Only show if CHRO */}
                {formData.isCHRO === true && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How many employees are at your company? <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={formData.companySize === 'under_5000'}
                          onChange={() => updateField('companySize', 'under_5000')}
                          className="mr-2"
                        />
                        <span>Under 5,000 employees</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={formData.companySize === '5000_plus'}
                          onChange={() => updateField('companySize', '5000_plus')}
                          className="mr-2"
                        />
                        <span>5,000+ employees</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Exec Member Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Are you a current Transform Exec Member? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.isExecMember === true}
                        onChange={() => updateField('isExecMember', true)}
                        className="mr-2"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.isExecMember === false}
                        onChange={() => updateField('isExecMember', false)}
                        className="mr-2"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'chroTrack' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Build Your Experience</h2>
              <p className="text-gray-600 mb-6">
                Help us tailor your experience by sharing more about your company and what you're hoping to get from these sessions.
              </p>

              <div className="space-y-6">
                {/* Company Size Detail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How many employees are at your company? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.chroTrackCompanySizeDetail === 'under_500'}
                        onChange={() => updateField('chroTrackCompanySizeDetail', 'under_500')}
                        className="mr-2"
                      />
                      <span>Under 500</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.chroTrackCompanySizeDetail === '500_1999'}
                        onChange={() => updateField('chroTrackCompanySizeDetail', '500_1999')}
                        className="mr-2"
                      />
                      <span>500–1,999</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.chroTrackCompanySizeDetail === '2000_4999'}
                        onChange={() => updateField('chroTrackCompanySizeDetail', '2000_4999')}
                        className="mr-2"
                      />
                      <span>2,000–4,999</span>
                    </label>
                  </div>
                </div>

                {/* Company Presence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Company Presence <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.chroTrackCompanyPresence === 'global'}
                        onChange={() => updateField('chroTrackCompanyPresence', 'global')}
                        className="mr-2"
                      />
                      <span>Global (operations in multiple countries)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.chroTrackCompanyPresence === 'us_only'}
                        onChange={() => updateField('chroTrackCompanyPresence', 'us_only')}
                        className="mr-2"
                      />
                      <span>US only</span>
                    </label>
                  </div>
                </div>

                {/* Company Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Company Type <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.chroTrackCompanyType === 'public'}
                        onChange={() => updateField('chroTrackCompanyType', 'public')}
                        className="mr-2"
                      />
                      <span>Public</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.chroTrackCompanyType === 'private'}
                        onChange={() => updateField('chroTrackCompanyType', 'private')}
                        className="mr-2"
                      />
                      <span>Private</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.chroTrackCompanyType === 'in_transition'}
                        onChange={() => updateField('chroTrackCompanyType', 'in_transition')}
                        className="mr-2"
                      />
                      <span>In transition (going public, going private, or recently changed)</span>
                    </label>
                  </div>
                </div>

                {/* Biggest Challenge */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What's your biggest challenge right now? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.chroTrackBiggestChallenge}
                    onChange={(e) => updateField('chroTrackBiggestChallenge', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your biggest challenge..."
                  />
                </div>

                {/* Win to Share */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What win would you like to share with peers? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.chroTrackWinToShare}
                    onChange={(e) => updateField('chroTrackWinToShare', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share a recent win or success..."
                  />
                </div>

                {/* Session Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What are you hoping to get out of these sessions? (Select all that apply) <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      'Give and take discussion on shared challenges',
                      'Build deep connections with peers',
                      'Learn from others who\'ve solved problems I\'m facing',
                      'Share what\'s working at my organization',
                      'Explore specific topics in depth'
                    ].map((goal) => (
                      <label key={goal} className="flex items-start">
                        <input
                          type="checkbox"
                          checked={formData.chroTrackSessionGoals.includes(goal)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateField('chroTrackSessionGoals', [...formData.chroTrackSessionGoals, goal])
                            } else {
                              updateField('chroTrackSessionGoals', formData.chroTrackSessionGoals.filter(g => g !== goal))
                            }
                          }}
                          className="mr-2 mt-1"
                        />
                        <span>{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'activities' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select the Experiences You'd Like to Attend</h2>
              <p className="text-gray-600 mb-6">Check all that you plan to attend. We'll confirm your registration via email.</p>

              {hasLoungeAccess && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">✨ Exec Lounge Access</h3>
                  <p className="text-sm text-blue-800">
                    As a {formData.isCHRO ? 'CHRO' : 'Transform Exec Member'}, you automatically have access to the
                    Exec Lounge throughout the conference. This private space is available for relaxing, private meetings,
                    and conference check-in.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {eligibleActivities.map((activity) => (
                  <label key={activity.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activities[activity.id as keyof typeof formData.activities]}
                      onChange={(e) => updateActivity(activity.id as keyof typeof formData.activities, e.target.checked)}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.name}</div>
                      <div className="text-sm text-gray-600">{activity.day} • {activity.time}</div>
                      {activity.description && (
                        <div className="text-sm text-gray-500 mt-1 whitespace-pre-line">{activity.description}</div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {eligibleActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Please complete the qualification questions to see available activities.
                </div>
              )}
            </div>
          )}

          {currentStep === 'logistics' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Logistics Questions</h2>
              <div className="space-y-6">
                {/* Hotel Question */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Will you be staying at the Wynn Las Vegas? <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.stayingAtWynn === true}
                        onChange={() => updateField('stayingAtWynn', true)}
                        className="mr-2"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.stayingAtWynn === false}
                        onChange={() => {
                          updateField('stayingAtWynn', false)
                          updateField('checkInDate', '')
                          updateField('checkOutDate', '')
                        }}
                        className="mr-2"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* Hotel Dates - Only show if staying at Wynn */}
                {formData.stayingAtWynn === true && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => updateField('checkInDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.checkOutDate}
                        onChange={(e) => updateField('checkOutDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Dietary Restrictions */}
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
                          onChange={(e) => handleDietaryChange(option, e.target.checked)}
                          className="mr-2"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                    <div className="mt-2">
                      <label className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={formData.dietaryRestrictions.includes('Other')}
                          onChange={(e) => handleDietaryChange('Other', e.target.checked)}
                          className="mr-2"
                        />
                        <span>Other</span>
                      </label>
                      {formData.dietaryRestrictions.includes('Other') && (
                        <input
                          type="text"
                          value={formData.dietaryOther}
                          onChange={(e) => updateField('dietaryOther', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
              <p className="text-gray-600 mb-6">Please review your information before submitting.</p>

              <div className="space-y-6">
                {/* Contact Information */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">Contact Information</h3>
                    <button
                      onClick={() => goToStep('contact')}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Company:</strong> {formData.company}</p>
                    <p><strong>Title:</strong> {formData.title}</p>
                  </div>
                </div>

                {/* Qualification */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">Qualification</h3>
                    <button
                      onClick={() => goToStep('qualification')}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>CHRO/CPO:</strong> {formData.isCHRO ? 'Yes' : 'No'}</p>
                    {formData.isCHRO && (
                      <p><strong>Company Size:</strong> {formData.companySize === '5000_plus' ? '5,000+ employees' : 'Under 5,000 employees'}</p>
                    )}
                    <p><strong>Exec Member:</strong> {formData.isExecMember ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {/* Selected Activities */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">Selected Activities</h3>
                    <button
                      onClick={() => goToStep('activities')}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {eligibleActivities.filter(a => formData.activities[a.id as keyof typeof formData.activities]).length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {eligibleActivities
                          .filter(a => formData.activities[a.id as keyof typeof formData.activities])
                          .map(a => (
                            <li key={a.id}>{a.name} ({a.day} • {a.time})</li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 italic">No activities selected</p>
                    )}
                  </div>
                </div>

                {/* Logistics */}
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">Logistics</h3>
                    <button
                      onClick={() => goToStep('logistics')}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Staying at Wynn:</strong> {formData.stayingAtWynn ? 'Yes' : 'No'}</p>
                    {formData.stayingAtWynn && (
                      <>
                        <p><strong>Check-in:</strong> {formData.checkInDate}</p>
                        <p><strong>Check-out:</strong> {formData.checkOutDate}</p>
                      </>
                    )}
                    <p><strong>Dietary Restrictions:</strong> {
                      formData.dietaryRestrictions.length > 0
                        ? formData.dietaryRestrictions.join(', ') + (formData.dietaryOther ? ` (${formData.dietaryOther})` : '')
                        : 'None specified'
                    }</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentStepIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'btn-transform-outline'
              }`}
            >
              ← Previous
            </button>

            {currentStep === 'review' ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? 'Submitting...' : '✓ Confirm Your Participation'}
              </button>
            ) : (
              <button
                onClick={goToNextStep}
                disabled={!canProceedFromStep(currentStep)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  canProceedFromStep(currentStep)
                    ? 'btn-transform'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

