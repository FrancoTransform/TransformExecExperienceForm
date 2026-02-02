import { Client } from '@hubspot/api-client'
import { RegistrationFormData } from './types'

// Initialize HubSpot client
const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN })

/**
 * Sync registration data to HubSpot as a contact
 */
export async function syncToHubSpot(data: RegistrationFormData): Promise<void> {
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
    const properties: any = {
      email: data.email,
      firstname: data.firstName,
      lastname: data.lastName,
      company: data.company,
      jobtitle: data.title,
      // Custom properties (these need to be created in HubSpot first)
      execexp_is_chro: data.isCHRO === true ? 'Yes' : data.isCHRO === false ? 'No' : 'Not specified',
      execexp_company_size: data.companySize === 'under_5000' ? 'Under 5,000' : data.companySize === '5000_plus' ? '5,000+' : 'Not specified',
      execexp_is_exec_member: data.isExecMember === true ? 'Yes' : data.isExecMember === false ? 'No' : 'Not specified',
      execexp_staying_at_wynn: data.stayingAtWynn === true ? 'Yes' : data.stayingAtWynn === false ? 'No' : 'Not specified',
      execexp_dietary_restrictions: dietaryInfo,
      execexp_selected_activities: selectedActivities,
      execexp_transform_2026_registered: 'Yes',
      execexp_registration_date: new Date().toISOString().split('T')[0],
    }

    // Only add date fields if they have values (to avoid HubSpot errors if properties don't exist)
    if (data.checkInDate) {
      properties.execexp_check_in_date = data.checkInDate
    }
    if (data.checkOutDate) {
      properties.execexp_check_out_date = data.checkOutDate
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
                  operator: 'EQ' as any,
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
          const properties: any = {
            firstname: data.firstName,
            lastname: data.lastName,
            company: data.company,
            jobtitle: data.title,
            execexp_is_chro: data.isCHRO === true ? 'Yes' : data.isCHRO === false ? 'No' : 'Not specified',
            execexp_company_size: data.companySize === 'under_5000' ? 'Under 5,000' : data.companySize === '5000_plus' ? '5,000+' : 'Not specified',
            execexp_is_exec_member: data.isExecMember === true ? 'Yes' : data.isExecMember === false ? 'No' : 'Not specified',
            execexp_staying_at_wynn: data.stayingAtWynn === true ? 'Yes' : data.stayingAtWynn === false ? 'No' : 'Not specified',
            execexp_dietary_restrictions:
              data.dietaryRestrictions.length > 0
                ? data.dietaryRestrictions.join(', ') +
                  (data.dietaryOther ? ` (Other: ${data.dietaryOther})` : '')
                : 'None',
            execexp_selected_activities: Object.entries(data.activities)
              .filter(([_, selected]) => selected)
              .map(([key]) => formatActivityName(key))
              .join('; '),
            execexp_transform_2026_registered: 'Yes',
            execexp_registration_date: new Date().toISOString().split('T')[0],
          }

          // Only add date fields if they have values
          if (data.checkInDate) {
            properties.execexp_check_in_date = data.checkInDate
          }
          if (data.checkOutDate) {
            properties.execexp_check_out_date = data.checkOutDate
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

