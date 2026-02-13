'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'

interface Registration {
  id: number
  first_name: string
  last_name: string
  email: string
  company: string
  title: string
  is_chro: boolean
  company_size: string | null
  is_exec_member: boolean
  // CHRO Track fields
  chro_track_company_size_detail: string | null
  chro_track_company_presence: string | null
  chro_track_company_type: string | null
  chro_track_biggest_challenge: string | null
  chro_track_win_to_share: string | null
  chro_track_session_goals: string[] | null
  // Individual activity columns
  ai_at_work_mon: boolean
  exec_chambers_mon: boolean
  sponsored_dinner_mon: boolean
  exec_member_lunch_tue: boolean
  chro_experience_lunch_tue: boolean
  chro_track_session_tue: boolean
  exec_chambers_tue: boolean
  vip_dinner_tue: boolean
  chro_experience_breakfast_wed: boolean
  executive_breakfast_wed: boolean
  exec_chambers_wed: boolean
  // Legacy field (kept for compatibility)
  activities: any
  staying_at_wynn: boolean
  check_in_date: string | null
  check_out_date: string | null
  dietary_restrictions: string[]
  dietary_other: string | null
  created_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(false)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'T@26!') {
      setIsAuthenticated(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations()
    }
  }, [isAuthenticated])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/registrations')
      const data = await response.json()
      setRegistrations(data.registrations)
    } catch (error) {
      console.error('Error fetching registrations:', error)
      alert('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setRegistrations(registrations.filter(r => r.id !== id))
        alert('Registration deleted successfully')
      } else {
        alert('Failed to delete registration')
      }
    } catch (error) {
      console.error('Error deleting registration:', error)
      alert('Failed to delete registration')
    }
  }

  // Helper function to format date for input field (YYYY-MM-DD)
  const formatDateForInput = (dateValue: string | null): string => {
    if (!dateValue) return ''
    try {
      const date = new Date(dateValue)
      return date.toISOString().split('T')[0]
    } catch (e) {
      return ''
    }
  }

  const startEdit = (registration: Registration) => {
    setEditingId(registration.id)

    // Parse dietary restrictions if it's a string
    let dietaryRestrictions = registration.dietary_restrictions
    if (typeof dietaryRestrictions === 'string') {
      try {
        dietaryRestrictions = JSON.parse(dietaryRestrictions)
      } catch (e) {
        dietaryRestrictions = []
      }
    }

    // Parse CHRO Track session goals if it's a string
    let chroTrackSessionGoals = registration.chro_track_session_goals
    if (typeof chroTrackSessionGoals === 'string') {
      try {
        chroTrackSessionGoals = JSON.parse(chroTrackSessionGoals)
      } catch (e) {
        chroTrackSessionGoals = []
      }
    }

    // Build activities object from individual boolean columns
    const activities = {
      aiAtWorkMon: registration.ai_at_work_mon || false,
      execChambersMon: registration.exec_chambers_mon || false,
      sponsoredDinnerMon: registration.sponsored_dinner_mon || false,
      execMemberLunchTue: registration.exec_member_lunch_tue || false,
      chroExperienceLunchTue: registration.chro_experience_lunch_tue || false,
      chroTrackSessionTue: registration.chro_track_session_tue || false,
      execChambersTue: registration.exec_chambers_tue || false,
      vipDinnerTue: registration.vip_dinner_tue || false,
      chroExperienceBreakfastWed: registration.chro_experience_breakfast_wed || false,
      executiveBreakfastWed: registration.executive_breakfast_wed || false,
      execChambersWed: registration.exec_chambers_wed || false,
    }

    setEditForm({
      firstName: registration.first_name,
      lastName: registration.last_name,
      email: registration.email,
      company: registration.company,
      title: registration.title,
      isCHRO: registration.is_chro,
      companySize: registration.company_size,
      isExecMember: registration.is_exec_member,
      // CHRO Track fields
      chroTrackCompanySizeDetail: registration.chro_track_company_size_detail,
      chroTrackCompanyPresence: registration.chro_track_company_presence,
      chroTrackCompanyType: registration.chro_track_company_type,
      chroTrackBiggestChallenge: registration.chro_track_biggest_challenge || '',
      chroTrackWinToShare: registration.chro_track_win_to_share || '',
      chroTrackSessionGoals: Array.isArray(chroTrackSessionGoals) ? chroTrackSessionGoals : [],
      // Activities
      activities: activities,
      // Logistics
      stayingAtWynn: registration.staying_at_wynn,
      checkInDate: formatDateForInput(registration.check_in_date),
      checkOutDate: formatDateForInput(registration.check_out_date),
      dietaryRestrictions: Array.isArray(dietaryRestrictions) ? dietaryRestrictions : [],
      dietaryOther: registration.dietary_other || '',
      // Metadata
      createdAt: registration.created_at,
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const saveEdit = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        await fetchRegistrations()
        setEditingId(null)
        setEditForm(null)
        alert('Registration updated successfully')
      } else {
        alert('Failed to update registration')
      }
    } catch (error) {
      console.error('Error updating registration:', error)
      alert('Failed to update registration')
    }
  }

  const filteredRegistrations = registrations.filter(r =>
    r.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getActivityCount = (registration: Registration) => {
    // Count individual activity boolean columns
    let count = 0
    if (registration.ai_at_work_mon) count++
    if (registration.exec_chambers_mon) count++
    if (registration.sponsored_dinner_mon) count++
    if (registration.exec_member_lunch_tue) count++
    if (registration.chro_experience_lunch_tue) count++
    if (registration.chro_track_session_tue) count++
    if (registration.exec_chambers_tue) count++
    if (registration.vip_dinner_tue) count++
    if (registration.chro_experience_breakfast_wed) count++
    if (registration.executive_breakfast_wed) count++
    if (registration.exec_chambers_wed) count++
    return count
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-xl text-purple-600">Loading registrations...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Hero />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="card-transform p-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setAuthError(false) }}
                  className="input-transform w-full"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              {authError && (
                <p className="text-red-500 text-sm">Incorrect password. Please try again.</p>
              )}
              <button type="submit" className="btn-transform w-full">
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Banner */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage Executive Experience Registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-transform p-6 border-l-4 border-purple-500">
            <div className="text-sm text-gray-600 mb-1">Total Registrations</div>
            <div className="text-3xl font-bold text-purple-900">{registrations.length}</div>
          </div>
          <div className="card-transform p-6 border-l-4 border-pink-500">
            <div className="text-sm text-gray-600 mb-1">CHROs</div>
            <div className="text-3xl font-bold text-pink-600">
              {registrations.filter(r => r.is_chro).length}
            </div>
          </div>
          <div className="card-transform p-6 border-l-4 border-indigo-500">
            <div className="text-sm text-gray-600 mb-1">Exec Members</div>
            <div className="text-3xl font-bold text-indigo-600">
              {registrations.filter(r => r.is_exec_member).length}
            </div>
          </div>
          <div className="card-transform p-6 border-l-4 border-emerald-500">
            <div className="text-sm text-gray-600 mb-1">Staying at Wynn</div>
            <div className="text-3xl font-bold text-emerald-600">
              {registrations.filter(r => r.staying_at_wynn).length}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-transform shadow-sm"
          />
        </div>

        {/* Registrations Table */}
        <div className="card-transform overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-100">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-purple-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No registrations found matching your search.' : 'No registrations yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {registration.first_name} {registration.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{registration.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">{registration.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => startEdit(registration)}
                          className="text-purple-600 hover:text-purple-800 font-semibold mr-4 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(registration.id)}
                          className="text-pink-600 hover:text-pink-800 font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editingId && editForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-5 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white">Edit Registration</h2>
                <button
                  onClick={cancelEdit}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={editForm.company}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Qualification */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualification</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CHRO/CPO</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={editForm.isCHRO === true}
                            onChange={() => setEditForm({ ...editForm, isCHRO: true })}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={editForm.isCHRO === false}
                            onChange={() => setEditForm({ ...editForm, isCHRO: false, companySize: null })}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {editForm.isCHRO && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={editForm.companySize === 'under_5000'}
                              onChange={() => setEditForm({ ...editForm, companySize: 'under_5000' })}
                              className="mr-2"
                            />
                            Under 5,000
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={editForm.companySize === '5000_plus'}
                              onChange={() => setEditForm({ ...editForm, companySize: '5000_plus' })}
                              className="mr-2"
                            />
                            5,000+
                          </label>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Exec Member</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={editForm.isExecMember === true}
                            onChange={() => setEditForm({ ...editForm, isExecMember: true })}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={editForm.isExecMember === false}
                            onChange={() => setEditForm({ ...editForm, isExecMember: false })}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CHRO Track (only show if CHRO with growth company) */}
                {editForm.isCHRO && editForm.companySize === 'under_5000' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Let&apos;s narrow it further</h3>
                    <div className="space-y-4 bg-purple-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Size Detail</label>
                        <p className="text-sm text-gray-900">
                          {editForm.chroTrackCompanySizeDetail === 'under_500' && 'Under 500 employees'}
                          {editForm.chroTrackCompanySizeDetail === '500_1999' && '500-1,999 employees'}
                          {editForm.chroTrackCompanySizeDetail === '2000_4999' && '2,000-4,999 employees'}
                          {!editForm.chroTrackCompanySizeDetail && <span className="italic text-gray-500">Not specified</span>}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Presence</label>
                        <p className="text-sm text-gray-900">
                          {editForm.chroTrackCompanyPresence === 'global' && 'Global (offices/employees outside the US)'}
                          {editForm.chroTrackCompanyPresence === 'us_only' && 'US Only'}
                          {!editForm.chroTrackCompanyPresence && <span className="italic text-gray-500">Not specified</span>}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                        <p className="text-sm text-gray-900">
                          {editForm.chroTrackCompanyType === 'public' && 'Publicly traded'}
                          {editForm.chroTrackCompanyType === 'private' && 'Privately held'}
                          {editForm.chroTrackCompanyType === 'in_transition' && 'In transition (going public, private equity, acquisition, etc.)'}
                          {!editForm.chroTrackCompanyType && <span className="italic text-gray-500">Not specified</span>}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Biggest Challenge</label>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {editForm.chroTrackBiggestChallenge || <span className="italic text-gray-500">Not specified</span>}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Win to Share</label>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {editForm.chroTrackWinToShare || <span className="italic text-gray-500">Not specified</span>}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Session Goals</label>
                        {Array.isArray(editForm.chroTrackSessionGoals) && editForm.chroTrackSessionGoals.length > 0 ? (
                          <ul className="text-sm text-gray-900 list-disc list-inside">
                            {editForm.chroTrackSessionGoals.map((goal: string, idx: number) => (
                              <li key={idx}>{goal}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm italic text-gray-500">Not specified</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Logistics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logistics</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Staying at Wynn</label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={editForm.stayingAtWynn === true}
                            onChange={() => setEditForm({ ...editForm, stayingAtWynn: true })}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={editForm.stayingAtWynn === false}
                            onChange={() => setEditForm({ ...editForm, stayingAtWynn: false, checkInDate: '', checkOutDate: '' })}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>


                    {editForm.stayingAtWynn && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                          <input
                            type="date"
                            value={editForm.checkInDate}
                            onChange={(e) => setEditForm({ ...editForm, checkInDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                          <input
                            type="date"
                            value={editForm.checkOutDate}
                            onChange={(e) => setEditForm({ ...editForm, checkOutDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                      <div className="text-sm text-gray-600">
                        {Array.isArray(editForm.dietaryRestrictions) && editForm.dietaryRestrictions.length > 0
                          ? editForm.dietaryRestrictions.join(', ')
                          : 'None'}
                        {editForm.dietaryOther && ` (${editForm.dietaryOther})`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Activities</h3>
                  <div className="space-y-2">
                    {editForm.activities && Object.entries(editForm.activities).length > 0 ? (
                      <>
                        {Object.entries(editForm.activities).map(([key, value]) =>
                          value ? (
                            <div key={key} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={true}
                                onChange={(e) => setEditForm({
                                  ...editForm,
                                  activities: { ...editForm.activities, [key]: e.target.checked }
                                })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          ) : null
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No activities selected</p>
                    )}
                  </div>
                </div>

                {/* Registration Metadata */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Registration ID:</span>
                      <span className="text-sm text-gray-900 font-mono">{editingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Submitted:</span>
                      <span className="text-sm text-gray-900">
                        {editForm.createdAt ? new Date(editForm.createdAt).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 flex justify-end gap-3 border-t border-purple-100 rounded-b-2xl">
                <button
                  onClick={cancelEdit}
                  className="btn-transform-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveEdit(editingId)}
                  className="btn-transform"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

