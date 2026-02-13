import { Activity, RegistrationFormData } from './types'

// Transform 2026 dates: March 22-26, 2026 (Sunday-Thursday)
// Executive Experience activities are on Mon-Wed (March 23-25)
export const activities: Activity[] = [
  {
    id: 'aiAtWorkMon',
    day: 'Monday',
    time: '12:00 PM – 1:00 PM',
    name: 'AI@Work Session',
    description: 'Monday, March 23rd | 12:00–1:00 PM PST\nLocation: Wynn Las Vegas | Montrachet 2\nSpeakers:\n• Jessica Swank, Chief People Officer, Box\n• Brandon Barnes, VP, People Intelligence & Rewards, Box',
    hasDetailedDescription: true,
    isEligible: () => true, // Show to ALL
  },
  {
    id: 'execChambersMon',
    day: 'Monday',
    time: '4:00 PM – 5:00 PM',
    name: 'Exec Chamber Session - The Ripple Effect',
    description: 'Monday, March 23rd | 4:00–5:00 PM PST\nLocation: Wynn Las Vegas | Montrachet 2\nSpeakers:\n• Jennifer Christie, Chief People Officer, Docusign\n• Fiona Shinkfield, VP, People Strategy, Technology & Compliance, Docusign',
    hasDetailedDescription: true,
    isEligible: () => true, // Show to ALL
  },
  {
    id: 'sponsoredDinnerMon',
    day: 'Monday',
    time: '6:00 PM – 9:00 PM',
    name: 'CHRO Experience Dinner brought to you by Aon',
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
    name: 'CHRO Experience Lunch brought to you by Aon',
    description: 'Peer conversation based lunch for enterprise CHROs',
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
    name: 'AI@Work Session',
    description: 'Tuesday, March 24th | 4:00–5:00 PM PST\nLocation: Wynn Las Vegas | Montrachet 2\nSpeaker: Apple Musni, Chief People Officer, REI',
    hasDetailedDescription: true,
    isEligible: () => true, // Show to ALL
  },
  {
    id: 'vipDinnerTue',
    day: 'Tuesday',
    time: '6:30 PM – 9:00 PM',
    name: 'VIP Dinner brought to you by Dergel Cornerstone',
    description: 'Invite-only dinner for senior leaders',
    isEligible: (data) =>
      (data.isCHRO === true && data.companySize === '5000_plus') ||
      data.isExecMember === true,
  },
  {
    id: 'chroExperienceBreakfastWed',
    day: 'Wednesday',
    time: '8:00 AM – 9:00 AM',
    name: 'CHRO Experience Breakfast brought to you by Aon',
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
    name: 'Exec Chamber Session - Raising the Bar',
    description: 'Building Integrated Talent Cycles That Scale\nWednesday, March 25th | 3:00–4:00 PM PST\nLocation: Wynn Las Vegas | Montrachet 2\nSpeakers:\n• Amy Reichanadter, Chief People Officer, Databricks\n• Andrew Wilhelms, VP, Talent Management, Databricks',
    hasDetailedDescription: true,
    isEligible: () => true, // Show to ALL
  },
]

// Map day names to actual dates for Transform 2026 (March 22-26)
export const dayToDate: Record<string, string> = {
  'Monday': 'Mon, Mar 23',
  'Tuesday': 'Tue, Mar 24',
  'Wednesday': 'Wed, Mar 25',
}

// Get full date string for an activity
export const getActivityDateString = (activity: Activity): string => {
  return `${dayToDate[activity.day]} • ${activity.time}`
}

export const getEligibleActivities = (formData: RegistrationFormData): Activity[] => {
  return activities.filter(activity => activity.isEligible(formData))
}

export const hasExecLoungeAccess = (formData: RegistrationFormData): boolean => {
  return formData.isCHRO === true || formData.isExecMember === true
}

