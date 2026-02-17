// Test script to verify eligibility logic matches PRD requirements
// Run with: node test-eligibility.js

const activities = [
  {
    id: 'aiAtWorkMon',
    name: 'AI@Work Session (Mon)',
    isEligible: () => true,
  },
  {
    id: 'execChambersMon',
    name: 'Exec Chambers (Mon)',
    isEligible: () => true,
  },
  {
    id: 'sponsoredDinnerMon',
    name: 'Sponsored Dinner (Mon)',
    isEligible: (data) => data.isCHRO === true && data.companySize === '5000_plus',
  },
  {
    id: 'execMemberLunchTue',
    name: 'Exec Member Lunch (Tue)',
    isEligible: (data) => data.isExecMember === true,
  },
  {
    id: 'chroExperienceLunchTue',
    name: 'CHRO Experience Lunch (Tue)',
    isEligible: (data) => data.isCHRO === true && data.companySize === '5000_plus',
  },
  {
    id: 'chroTrackSessionTue',
    name: 'CHRO Track Session (Tue)',
    isEligible: (data) => data.isCHRO === true && data.companySize === 'under_5000',
  },
  {
    id: 'execChambersTue',
    name: 'Exec Chambers (Tue)',
    isEligible: () => true,
  },
  {
    id: 'chroExperienceBreakfastWed',
    name: 'CHRO Experience Breakfast (Wed)',
    isEligible: (data) => data.isCHRO === true && data.companySize === '5000_plus',
  },
  {
    id: 'executiveBreakfastWed',
    name: 'Executive Breakfast (Wed)',
    isEligible: (data) => !(data.isCHRO === true && data.companySize === '5000_plus'),
  },
  {
    id: 'execChambersWed',
    name: 'Exec Chambers (Wed)',
    isEligible: () => true,
  },
];

function getEligibleActivities(formData) {
  return activities.filter(activity => activity.isEligible(formData));
}

function hasExecLoungeAccess(formData) {
  return formData.isCHRO === true || formData.isExecMember === true;
}

// Test scenarios from PRD
console.log('=== Testing Eligibility Logic ===\n');

// Flow A: Enterprise CHRO who is an Exec Member (PRD lines 175-178)
console.log('Flow A: Enterprise CHRO + Exec Member');
const flowA = {
  isCHRO: true,
  companySize: '5000_plus',
  isExecMember: true,
};
const flowAActivities = getEligibleActivities(flowA);
console.log('Should see:', flowAActivities.map(a => a.name).join(', '));
console.log('Exec Lounge Access:', hasExecLoungeAccess(flowA) ? 'YES' : 'NO');
console.log('Expected: AI@Work, Exec Chambers (Mon/Tue/Wed), Sponsored Dinner, Exec Member Lunch, CHRO Experience Lunch, CHRO Experience Breakfast');
console.log('Should NOT see: CHRO Track Session, Executive Breakfast\n');

// Flow B: CHRO at 3,000 employees, not Exec Member (PRD lines 179-182)
console.log('Flow B: CHRO under 5K, not Exec Member');
const flowB = {
  isCHRO: true,
  companySize: 'under_5000',
  isExecMember: false,
};
const flowBActivities = getEligibleActivities(flowB);
console.log('Should see:', flowBActivities.map(a => a.name).join(', '));
console.log('Exec Lounge Access:', hasExecLoungeAccess(flowB) ? 'YES' : 'NO');
console.log('Expected per MATRIX: AI@Work, Exec Chambers (Mon/Tue/Wed), CHRO Track Session, Executive Breakfast');
console.log('Should NOT see: Sponsored Dinner, Exec Member Lunch, CHRO Experience Lunch/Breakfast\n');

// Flow C: VP (not CHRO), 10K employees, not Exec Member (PRD lines 183-185)
console.log('Flow C: VP (not CHRO), not Exec Member');
const flowC = {
  isCHRO: false,
  companySize: null, // Non-CHROs don't answer company size question
  isExecMember: false,
};
const flowCActivities = getEligibleActivities(flowC);
console.log('Should see:', flowCActivities.map(a => a.name).join(', '));
console.log('Exec Lounge Access:', hasExecLoungeAccess(flowC) ? 'YES' : 'NO');
console.log('Expected per MATRIX: AI@Work, Exec Chambers (Mon/Tue/Wed), Executive Breakfast');
console.log('Should NOT see: Sponsored Dinner, CHRO activities, Exec Member Lunch\n');

// Flow D: Exec Member who is not a CHRO (PRD lines 186-189)
console.log('Flow D: Exec Member, not CHRO');
const flowD = {
  isCHRO: false,
  companySize: null,
  isExecMember: true,
};
const flowDActivities = getEligibleActivities(flowD);
console.log('Should see:', flowDActivities.map(a => a.name).join(', '));
console.log('Exec Lounge Access:', hasExecLoungeAccess(flowD) ? 'YES' : 'NO');
console.log('Expected: AI@Work, Exec Chambers (Mon/Tue/Wed), Exec Member Lunch, Executive Breakfast');
console.log('Should NOT see: Sponsored Dinner, CHRO Experience activities, CHRO Track Session\n');

