Executive Experiences Registration Page Requirements Document
Overview
This registration page allows invited executives to sign up for curated programming at Transform 2026. The page uses conditional logic to display only the activities each registrant qualifies for based on their role, company size, and membership status.
Audience: Invited executives only (page URL shared via direct outreach)
Goal: Capture registrations for executive programming while making invitees feel this is an exclusive, white-glove experience

Page Flow
Welcome Message
     ↓
Qualification Questions (role, company size, membership status)
     ↓
Conditional Logic determines eligible activities
     ↓
Activity Selection (only eligible options shown)
     ↓
Logistics Questions (hotel, dietary)
     ↓
Confirmation


Section 1: Welcome Message
Headline: You're Invited: Executive Experiences at Transform 2026
Body Copy:
You've been selected to join our curated executive programming at Transform 2026. These sessions, meals, and experiences are designed exclusively for senior HR leaders — no vendors, no pitches, just meaningful conversations with peers navigating the same challenges you are.
Tell us a bit about yourself below, and we'll show you the experiences available to you. Space is limited, so register for what you'd like to attend and we'll confirm your spots.

Section 2: Qualification Questions
These questions determine which activities the registrant can see/select.
Q1: Contact Information
•	First Name (required)
•	Last Name (required)
•	Email (required)
•	Company (required)
•	Title (required)
Q2: Role
Are you a CHRO, CPO, or equivalent chief-level people/HR leader?
•	Yes
•	No
If "No" → Skip to Q4 (they may still qualify for Exec Chambers or be an Exec Member)
Q3: Company Size
How many employees are at your company?
•	Under 5,000 employees
•	5,000+ employees
Q4: Membership Status
Are you a current Transform Exec Member?
•	Yes
•	No

Section 3: Conditional Logic — Activity Eligibility
Based on answers to Q2, Q3, and Q4, determine which activities to display.
Eligibility Matrix
Activity	Conditions to Display
AI@Work Session (Mon 12-1PM)	Show to ALL
Exec Chambers Session (Mon 4-5PM)	Show to ALL
Sponsored Dinner (Mon 6-9PM)	ONLY if CHRO = Yes AND Company Size = 5,000+
Exec Member Lunch (Tue 11:30-12:30)	ONLY if Exec Member = Yes
Sponsored Lunch -  CHRO Experience (Tue 12-12:45)	ONLY if CHRO = Yes AND Company Size = 5,000+
CHRO Track Session (Tue 2-4PM)	ONLY if CHRO = Yes AND Company Size = Under 5,000
Exec Chamber Session (Tue 4-5PM)	Show to ALL
VIP Dinner (Tue 6:30-9PM)	ONLY if (CHRO = Yes AND Company Size = 5,000+) OR Exec Member = Yes
Breakfast - CHRO Experience (Wed 8-9AM)	ONLY if CHRO = Yes AND Company Size = 5,000+
Breakfast - Other Cohorts (Wed 8-9AM)	ONLY if NOT (CHRO = Yes AND Company Size = 5,000+)
Exec Chambers Session (Wed 3-4PM)	Show to ALL
Exec Lounge Access (Informational - No Registration Required) CHROs (any company size) and Exec Members automatically have access to the Exec Lounge throughout the conference. This private space is available for relaxing, private meetings, and conference check-in. Display this as an informational note for qualifying registrants, not as a selectable activity.
User Segments (for reference)
Segment	Criteria
CHRO Experience (Enterprise)	CHRO = Yes AND Company Size = 5,000+
CHRO Track (Growth Stage)	CHRO = Yes AND Company Size = Under 5,000
Exec Member	Exec Member = Yes
Exec Chambers Guest	Anyone not in above categories (gets Chambers access as a "taste")
Note: A person can be in multiple segments (e.g., CHRO at enterprise company who is also an Exec Member gets access to everything).

Section 4: Activity Selection
Display only the activities the registrant qualifies for (per logic above).
Section Header: Select the Experiences You'd Like to Attend
Instructions: Check all that you plan to attend. We'll confirm your registration via email.
Activity Display Format
For each eligible activity, show:
•	Checkbox
•	Day + Time
•	Activity Name
•	Brief description (optional, 1 line)
Activity List with Descriptions
Day	Time	Activity	Description
Mon	12–1 PM	AI@Work Session	Practitioners share real-world AI implementation stories
Mon	4–5 PM	Exec Chambers Session	Closed-door peer discussion
Mon	6–9 PM	Sponsored Dinner	Evening networking dinner
Tue	11:30 AM–12:30 PM	Exec Member Lunch	Private lunch for Transform Exec Members
Tue	12–12:45 PM	CHRO Experience Lunch	Sponsored lunch for enterprise CHROs
Tue	2–4 PM	CHRO Track Session	Afternoon session for growth-stage CHROs
Tue	4–5 PM	Exec Chamber Session	Closed-door peer discussion
Tue	6:30–9 PM	VIP Dinner	Invite-only dinner for senior leaders
Wed	8–9 AM	CHRO Experience Breakfast	Morning session for enterprise CHROs
Wed	8–9 AM	Executive Breakfast	Morning session for non-CHRO Experience attendees
Wed	3–4 PM	Exec Chamber Session	Closed-door peer discussion
Note: Exec Lounge Access is automatically granted to qualifying attendees (CHROs and Exec Members) and should be displayed as an informational message, not a selectable activity.
Note: Wed 8-9 AM has two mutually exclusive options — display only the one they qualify for.

Section 5: Logistics Questions
Q5: Hotel
Will you be staying at the Wynn Las Vegas?
•	Yes
•	No
Q6: Hotel Dates (Conditional — only show if Q5 = Yes)
Check-in Date: [Date picker] Check-out Date: [Date picker]
Q7: Dietary Restrictions
Do you have any food allergies or dietary restrictions?
•	None
•	Vegetarian
•	Vegan
•	Gluten-free
•	Kosher
•	Halal
•	Other: [text field]
Allow multiple selections + "Other" free text

Section 6: Submit + Confirmation
Submit Button
Text: Register for Executive Experiences
Confirmation Page
Headline: You're Registered
Body: Thanks for registering for Executive Experiences at Transform 2026. We've received your selections and will send a confirmation email with details for each event you signed up for.
Your Selections: [List activities they selected]
Questions? Contact exec@transform.us 
See you in Las Vegas.

Confirmation Email (Auto-Send)
Subject: Your Executive Experiences Registration — Transform 2026
Body:
Hi [First Name],
Thanks for registering for Executive Experiences at Transform 2026. Here's what you signed up for:
[List of selected activities with day/time]
Hotel: [Wynn / Not staying at Wynn] [If Wynn: Check-in: [Date] | Check-out: [Date]]
Dietary Restrictions: [Their selections]
We'll send calendar invites and additional details as we get closer to the event. If you need to make changes, reply to this email.
See you in Las Vegas.
— The Transform Team

Technical Requirements
Form Logic
•	Conditional display of activities based on Q2, Q3, Q4
•	Mutual exclusivity for Wed 8-9 AM breakfast options
•	Conditional display of Q6 (hotel dates) based on Q5
Data Capture
Store all responses in a database/spreadsheet with the following fields:
•	First Name
•	Last Name
•	Email
•	Company
•	Title
•	Is CHRO (Yes/No)
•	Company Size (Under 5K / 5K+)
•	Exec Member (Yes/No)
•	[One column per activity — checked/unchecked]
•	Staying at Wynn (Yes/No)
•	Check-in Date
•	Check-out Date
•	Dietary Restrictions
Note: Exec Lounge eligibility can be calculated from CHRO + Exec Member fields — no need to store separately.
Integrations (Optional)
•	Auto-send confirmation email on submit
•	Sync to CRM or event management system
•	Calendar invite generation for selected activities
Access Control
•	Page should be unlisted (not indexed, not linked from main site)
Design Notes
•	Keep the tone warm and exclusive — this is a VIP experience
•	Use Transform brand colors/styling
•	Mobile-responsive (execs will likely open invite on phone)
•	Progress indicator if form is long, or keep it single-scroll if possible


 
Appendix: Sample User Flows
Flow A: Enterprise CHRO who is an Exec Member
•	Sees: AI@Work, Exec Chambers Sessions (Mon, Tue, Wed), Sponsored Dinner, Exec Member Lunch, CHRO Experience Lunch, VIP Dinner, CHRO Experience Breakfast
•	Informational: Exec Lounge Access (auto-granted)
•	Does NOT see: CHRO Track Session (that's for under 5K companies)
Flow B: CHRO at company with 3,000 employees, not an Exec Member
•	Sees: AI@Work, Exec Chambers Sessions (Mon, Tue, Wed), Sponsored Dinner, CHRO Track Session, VIP Dinner, Breakfast (non-CHRO Experience)
•	Informational: Exec Lounge Access (auto-granted)
•	Does NOT see: Exec Member Lunch, CHRO Experience Lunch/Breakfast
Flow C: VP of People (not CHRO), 10,000-person company, not an Exec Member
•	Sees: AI@Work, Exec Chambers Sessions (Mon, Tue, Wed), Sponsored Dinner, Breakfast (non-CHRO Experience)
•	Does NOT see: Any CHRO-specific programming, Exec Member Lunch, VIP Dinner (unless invited separately), Exec Lounge
Flow D: Exec Member who is not a CHRO
•	Sees: AI@Work, Exec Chambers Sessions (Mon, Tue, Wed), Sponsored Dinner, Exec Member Lunch, VIP Dinner, Breakfast (non-CHRO Experience)
•	Informational: Exec Lounge Access (auto-granted)
•	Does NOT see: CHRO Experience Lunch/Breakfast/Sessions, CHRO Track Session
