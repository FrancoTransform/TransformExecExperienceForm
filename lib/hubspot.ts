import { Client } from '@hubspot/api-client'

// Initialize HubSpot client
const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN })

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  company: string
  title: string
  isCHRO: boolean
  companySize: string | null
  isExecMember: boolean
  activities: {
    aiAtWorkMon?: boolean
    execChambersMon?: boolean
    sponsoredDinnerMon?: boolean
    execMemberLunchTue?: boolean
    chroExperienceLunchTue?: boolean
    chroTrackSessionTue?: boolean
    execChambersTue?: boolean
    vipDinnerTue?: boolean
    chroExperienceBreakfastWed?: boolean
    executiveBreakfastWed?: boolean
    execChambersWed?: boolean
  }
  stayingAtWynn: boolean
  checkInDate: string | null
  checkOutDate: string | null
  dietaryRestrictions: string[]
  dietaryOther: string | null
}

/**
 * Sync registration data to HubSpot as a contact
 */
export async function syncToHubSpot(data: RegistrationData): Promise<void> {
  try {
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
      console.warn('HUBSPOT_ACCESS_TOKEN not configured, skipping HubSpot sync')
      return
    }

    // Format selected activities as a readable list
    const selectedActivities = Object.entries(data.activities)
      .filter(([_, selected]) => selected)
      .map(([key]) => formatActivityName(key))
      .join('; ')

    // Format dietary restrictions
    const dietaryInfo = data.dietaryRestrictions.length > 0
      ? data.dietaryRestrictions.join(', ') + (data.dietaryOther ? ` (Other: ${data.dietaryOther})` : '')
      : 'None'

    // Prepare contact properties
    const properties = {
      email: data.email,
      firstname: data.firstName,
      lastname: data.lastName,
      company: data.company,
      jobtitle: data.title,
      // Custom properties (these need to be created in HubSpot first)
      is_chro: data.isCHRO ? 'Yes' : 'No',
      company_size: data.companySize || 'Not specified',
      is_exec_member: data.isExecMember ? 'Yes' : 'No',
      staying_at_wynn: data.stayingAtWynn ? 'Yes' : 'No',
      check_in_date: data.checkInDate || '',
      check_out_date: data.checkOutDate || '',
      dietary_restrictions: dietaryInfo,
      selected_activities: selectedActivities,
      transform_2026_registered: 'Yes',
      registration_date: new Date().toISOString().split('T')[0],
    }

    // Create or update contact in HubSpot
    const response = await hubspotClient.crm.contacts.basicApi.create({
      properties,
      associations: [],
    })

    console.log('Successfully synced to HubSpot:', response.id)
  } catch (error: any) {
    // If contact already exists, update it
    if (error.code === 409 || error.body?.category === 'CONFLICT') {
      try {
        // Search for existing contact by email
        const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ',
                  value: data.email,
                },
              ],
            },
          ],
          properties: ['email'],
          limit: 1,
        })

        if (searchResponse.results.length > 0) {
          const contactId = searchResponse.results[0].id

          // Update existing contact
          const properties = {
            firstname: data.firstName,
            lastname: data.lastName,
            company: data.company,
            jobtitle: data.title,
            is_chro: data.isCHRO ? 'Yes' : 'No',
            company_size: data.companySize || 'Not specified',
            is_exec_member: data.isExecMember ? 'Yes' : 'No',
            staying_at_wynn: data.stayingAtWynn ? 'Yes' : 'No',
            check_in_date: data.checkInDate || '',
            check_out_date: data.checkOutDate || '',
            dietary_restrictions:
              data.dietaryRestrictions.length > 0
                ? data.dietaryRestrictions.join(', ') +
                  (data.dietaryOther ? ` (Other: ${data.dietaryOther})` : '')
                : 'None',
            selected_activities: Object.entries(data.activities)
              .filter(([_, selected]) => selected)
              .map(([key]) => formatActivityName(key))
              .join('; '),
            transform_2026_registered: 'Yes',
            registration_date: new Date().toISOString().split('T')[0],
          }

          await hubspotClient.crm.contacts.basicApi.update(contactId, { properties })
          console.log('Successfully updated existing contact in HubSpot:', contactId)
        }
      } catch (updateError) {
        console.error('Error updating HubSpot contact:', updateError)
        // Don't throw - we don't want to block registration if HubSpot fails
      }
    } else {
      console.error('Error syncing to HubSpot:', error)
      // Don't throw - we don't want to block registration if HubSpot fails
    }
  }
}

/**
 * Convert activity key to readable name
 */
function formatActivityName(key: string): string {
  const activityNames: Record<string, string> = {
    aiAtWorkMon: 'AI@Work Session (Mon 12-1PM)',
    execChambersMon: 'Exec Chambers (Mon 4-5PM)',
    sponsoredDinnerMon: 'Sponsored Dinner (Mon 6-9PM)',
    execMemberLunchTue: 'Exec Member Lunch (Tue 11:30-12:30)',
    chroExperienceLunchTue: 'CHRO Experience Lunch (Tue 12-12:45)',
    chroTrackSessionTue: 'CHRO Track Session (Tue 2-4PM)',
    execChambersTue: 'Exec Chambers (Tue 4-5PM)',
    vipDinnerTue: 'VIP Dinner (Tue 6:30-9PM)',
    chroExperienceBreakfastWed: 'CHRO Experience Breakfast (Wed 8-9AM)',
    executiveBreakfastWed: 'Executive Breakfast (Wed 8-9AM)',
    execChambersWed: 'Exec Chambers (Wed 3-4PM)',
  }
  return activityNames[key] || key
}

