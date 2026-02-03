export interface RegistrationFormData {
  // Contact Information
  firstName: string
  lastName: string
  email: string
  company: string
  title: string
  
  // Qualification Questions
  isCHRO: boolean | null
  companySize: 'under_5000' | '5000_plus' | null
  isExecMember: boolean | null

  // CHRO Track Questions (only for CHRO + under_5000)
  chroTrackCompanySizeDetail: 'under_500' | '500_1999' | '2000_4999' | null
  chroTrackCompanyPresence: 'global' | 'us_only' | null
  chroTrackCompanyType: 'public' | 'private' | 'in_transition' | null
  chroTrackBiggestChallenge: string
  chroTrackWinToShare: string
  chroTrackSessionGoals: string[]

  // Activity Selections
  activities: {
    aiAtWorkMon: boolean
    execChambersMon: boolean
    sponsoredDinnerMon: boolean
    execMemberLunchTue: boolean
    chroExperienceLunchTue: boolean
    chroTrackSessionTue: boolean
    execChambersTue: boolean
    vipDinnerTue: boolean
    chroExperienceBreakfastWed: boolean
    executiveBreakfastWed: boolean
    execChambersWed: boolean
  }
  
  // Logistics
  stayingAtWynn: boolean | null
  checkInDate: string
  checkOutDate: string
  dietaryRestrictions: string[]
  dietaryOther: string
}

export interface Activity {
  id: keyof RegistrationFormData['activities']
  day: string
  time: string
  name: string
  description: string
  isEligible: (formData: RegistrationFormData) => boolean
}

