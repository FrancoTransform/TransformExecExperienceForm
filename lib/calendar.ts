// Generate .ics calendar file content for an activity
export interface CalendarEvent {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
}

export function generateICS(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Transform 2026//Executive Experiences//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    `UID:${Date.now()}@transform.us`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return icsContent
}

export function downloadICS(event: CalendarEvent, filename: string): void {
  const icsContent = generateICS(event)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

// Parse activity string to extract date and time information
export function parseActivityString(activityString: string): {
  name: string
  date: string
  time: string
} | null {
  // Format: "Activity Name - Mon, Mar 23 • 12:00 PM – 1:00 PM"
  const match = activityString.match(/^(.+?) - (.+?) • (.+)$/)
  if (!match) return null

  return {
    name: match[1].trim(),
    date: match[2].trim(), // "Mon, Mar 23"
    time: match[3].trim(), // "12:00 PM – 1:00 PM"
  }
}

// Convert activity string to calendar event
export function activityToCalendarEvent(activityString: string): CalendarEvent | null {
  const parsed = parseActivityString(activityString)
  if (!parsed) return null

  // Parse date (e.g., "Mon, Mar 23" -> Mar 23, 2026)
  const dateMatch = parsed.date.match(/\w+, \w+ (\d+)/)
  if (!dateMatch) return null

  const day = parseInt(dateMatch[1])
  const year = 2026
  const month = 2 // March (0-indexed)

  // Parse time (e.g., "12:00 PM – 1:00 PM")
  const timeMatch = parsed.time.match(/(\d+):(\d+) (AM|PM) – (\d+):(\d+) (AM|PM)/)
  if (!timeMatch) return null

  const startHour = parseInt(timeMatch[1]) + (timeMatch[3] === 'PM' && timeMatch[1] !== '12' ? 12 : 0) - (timeMatch[3] === 'AM' && timeMatch[1] === '12' ? 12 : 0)
  const startMinute = parseInt(timeMatch[2])
  const endHour = parseInt(timeMatch[4]) + (timeMatch[6] === 'PM' && timeMatch[4] !== '12' ? 12 : 0) - (timeMatch[6] === 'AM' && timeMatch[4] === '12' ? 12 : 0)
  const endMinute = parseInt(timeMatch[5])

  const startDate = new Date(Date.UTC(year, month, day, startHour + 8, startMinute)) // PST is UTC-8
  const endDate = new Date(Date.UTC(year, month, day, endHour + 8, endMinute))

  return {
    title: `${parsed.name} - Transform 2026`,
    description: `Executive Experience at Transform 2026\n\n${parsed.name}\n${parsed.date} • ${parsed.time}`,
    location: 'Wynn Las Vegas, 3131 S Las Vegas Blvd, Las Vegas, NV 89109',
    startDate,
    endDate,
  }
}

