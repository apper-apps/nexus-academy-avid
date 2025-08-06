import waitlistData from "@/services/mockData/waitlist.json";

let waitlist = [...waitlistData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getWaitlist = async () => {
  await delay(300);
  return [...waitlist].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getWaitlistByProgram = async (programSlug) => {
  await delay(200);
  return waitlist.filter(w => w.program_slug === programSlug);
};

export const addToWaitlist = async (email, programSlug) => {
  await delay(400);
  
  // Check if already on waitlist
  const existing = waitlist.find(w => w.email === email && w.program_slug === programSlug);
  if (existing) {
    throw new Error("Email already on waitlist for this program");
  }
  
  const maxId = waitlist.length > 0 ? Math.max(...waitlist.map(w => w.Id)) : 0;
  const newEntry = {
    Id: maxId + 1,
    email,
    program_slug: programSlug,
    created_at: new Date().toISOString()
  };
  
  waitlist.push(newEntry);
  return { ...newEntry };
};

export const removeFromWaitlist = async (id) => {
  await delay(300);
  const index = waitlist.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Waitlist entry not found");
  }
  const deleted = waitlist[index];
  waitlist.splice(index, 1);
  return { ...deleted };
};