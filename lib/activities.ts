import { Activity, RegistrationFormData } from './types'

export const activities: Activity[] = [
  {
    id: 'aiAtWorkMon',
    day: 'Monday',
    time: '12:00 PM – 1:00 PM',
    name: 'AI@Work Session',
    description: 'Practitioners share real-world AI implementation stories',
    isEligible: () => true, // Show to ALL
  },
  {
    id: 'execChambersMon',
    day: 'Monday',
    time: '4:00 PM – 5:00 PM',
    name: 'Exec Chambers Session',
    description: 'Closed-door peer discussion',
    isEligible: () => true, // Show to ALL
  },
  {
    id: 'sponsoredDinnerMon',
    day: 'Monday',
    time: '6:00 PM – 9:00 PM',
    name: 'Sponsored Dinner',
    description: 'Evening networking dinner',
    isEligible: (data) => data.isCHRO === true && data.companySize === '5000_plus',
  },
  {
    id: 'execMemberLunchTue',
    day: 'Tuesday',
    time: '11:30 AM – 12:30 PM',
    name: 'Exec Member Lunch',
    description: 'Private lunch for Transform Exec Members',
    isEligible: (data) => data.isExecMember === true,
  },
  {
    id: 'chroExperienceLunchTue',
    day: 'Tuesday',
    time: '12:00 PM – 12:45 PM',
    name: 'CHRO Experience Lunch',
    description: 'Sponsored lunch for enterprise CHROs',
    isEligible: (data) => data.isCHRO === true && data.companySize === '5000_plus',
  },
  {
    id: 'chroTrackSessionTue',
    day: 'Tuesday',
    time: '2:00 PM – 4:00 PM',
    name: 'CHRO Track Session',
    description: 'Afternoon session for growth-stage CHROs',
    isEligible: (data) => data.isCHRO === true && data.companySize === 'under_5000',
  },
  {
    id: 'execChambersTue',
    day: 'Tuesday',
    time: '4:00 PM – 5:00 PM',
    name: 'Exec Chambers Session',
    description: 'Closed-door peer discussion',
    isEligible: () => true, // Show to ALL
  },
  {
    id: 'vipDinnerTue',
    day: 'Tuesday',
    time: '6:30 PM – 9:00 PM',
    name: 'VIP Dinner',
    description: 'Invite-only dinner for senior leaders',
    isEligible: (data) => 
      (data.isCHRO === true && data.companySize === '5000_plus') || 
      data.isExecMember === true,
  },
  {
    id: 'chroExperienceBreakfastWed',
    day: 'Wednesday',
    time: '8:00 AM – 9:00 AM',
    name: 'CHRO Experience Breakfast',
    description: 'Morning session for enterprise CHROs',
    isEligible: (data) => data.isCHRO === true && data.companySize === '5000_plus',
  },
  {
    id: 'executiveBreakfastWed',
    day: 'Wednesday',
    time: '8:00 AM – 9:00 AM',
    name: 'Executive Breakfast',
    description: 'Morning session for non-CHRO Experience attendees',
    isEligible: (data) => !(data.isCHRO === true && data.companySize === '5000_plus'),
  },
  {
    id: 'execChambersWed',
    day: 'Wednesday',
    time: '3:00 PM – 4:00 PM',
    name: 'Exec Chambers Session',
    description: 'Closed-door peer discussion',
    isEligible: () => true, // Show to ALL
  },
]

export const getEligibleActivities = (formData: RegistrationFormData): Activity[] => {
  return activities.filter(activity => activity.isEligible(formData))
}

export const hasExecLoungeAccess = (formData: RegistrationFormData): boolean => {
  return formData.isCHRO === true || formData.isExecMember === true
}

