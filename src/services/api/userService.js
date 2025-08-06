import userData from "@/services/mockData/users.json";

let users = [...userData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getUsers = async () => {
  await delay(300);
  return [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getUserById = async (id) => {
  await delay(200);
  const user = users.find(u => u.Id === parseInt(id));
  if (!user) {
    throw new Error("User not found");
  }
  return { ...user };
};

export const getUserByEmail = async (email) => {
  await delay(200);
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error("User not found");
  }
  return { ...user };
};

export const createUser = async (userData) => {
  await delay(400);
  
  // Check if email already exists
  const existing = users.find(u => u.email === userData.email);
  if (existing) {
    throw new Error("Email already exists");
  }
  
  const maxId = users.length > 0 ? Math.max(...users.map(u => u.Id)) : 0;
  const newUser = {
    ...userData,
    Id: maxId + 1,
    role: userData.role || "free",
    master_cohort: userData.master_cohort || null,
    is_admin: userData.is_admin || false,
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  return { ...newUser };
};

export const updateUser = async (id, userData) => {
  await delay(300);
  const index = users.findIndex(u => u.Id === parseInt(id));
  if (index === -1) {
    throw new Error("User not found");
  }
  users[index] = { ...users[index], ...userData };
  return { ...users[index] };
};

export const deleteUser = async (id) => {
  await delay(300);
  const index = users.findIndex(u => u.Id === parseInt(id));
  if (index === -1) {
    throw new Error("User not found");
  }
  const deleted = users[index];
  users.splice(index, 1);
  return { ...deleted };
};