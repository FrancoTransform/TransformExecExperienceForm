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

