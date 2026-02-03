'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
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

    // Parse activities if it's a string (from database)
    let activities = registration.activities
    if (typeof activities === 'string') {
      try {
        activities = JSON.parse(activities)
      } catch (e) {
        activities = {}
      }
    }

    // Parse dietary restrictions if it's a string
    let dietaryRestrictions = registration.dietary_restrictions
    if (typeof dietaryRestrictions === 'string') {
      try {
        dietaryRestrictions = JSON.parse(dietaryRestrictions)
      } catch (e) {
        dietaryRestrictions = []
      }
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
      activities: activities || {},
      stayingAtWynn: registration.staying_at_wynn,
      checkInDate: formatDateForInput(registration.check_in_date),
      checkOutDate: formatDateForInput(registration.check_out_date),
      dietaryRestrictions: Array.isArray(dietaryRestrictions) ? dietaryRestrictions : [],
      dietaryOther: registration.dietary_other || '',
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading registrations...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="Transform" width={200} height={60} className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage Executive Experience Registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Registrations</div>
            <div className="text-3xl font-bold text-gray-900">{registrations.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">CHROs</div>
            <div className="text-3xl font-bold text-blue-600">
              {registrations.filter(r => r.is_chro).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Exec Members</div>
            <div className="text-3xl font-bold text-purple-600">
              {registrations.filter(r => r.is_exec_member).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Staying at Wynn</div>
            <div className="text-3xl font-bold text-green-600">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CHRO
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exec Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No registrations found matching your search.' : 'No registrations yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.first_name} {registration.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          registration.is_chro ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {registration.is_chro ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          registration.is_exec_member ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {registration.is_exec_member ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getActivityCount(registration)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(registration.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => startEdit(registration)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View/Edit
                        </button>
                        <button
                          onClick={() => handleDelete(registration.id)}
                          className="text-red-600 hover:text-red-900"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Edit Registration</h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
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
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveEdit(editingId)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

