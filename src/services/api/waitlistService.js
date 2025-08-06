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

export const addToWaitlist = async (waitlistData) => {
  try {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Prepare data with only updateable fields
    const params = {
      records: [{
        email: waitlistData.email,
        program_slug: waitlistData.program_slug,
        ...(waitlistData.user_id && { user_id: waitlistData.user_id })
      }]
    };

    const response = await apperClient.createRecord('waitlist', params);
    
    // Handle response
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create waitlist ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            console.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating waitlist entry:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error creating waitlist entry:", error.message);
      throw new Error(error.message);
    }
  }
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