import programData from "@/services/mockData/programs.json";
import { toast } from 'react-toastify';

let programs = [...programData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getPrograms = async () => {
  await delay(300);
  return [...programs];
};

export const getProgramById = async (id) => {
  await delay(200);
  const program = programs.find(p => p.Id === parseInt(id));
  if (!program) {
    throw new Error("Program not found");
  }
  return { ...program };
};

export const getProgramBySlug = async (slug) => {
  await delay(200);
  const program = programs.find(p => p.slug === slug);
  if (!program) {
    throw new Error("Program not found");
  }
  return { ...program };
};

export const createProgram = async (programData) => {
  try {
    await delay(400);
    const maxId = programs.length > 0 ? Math.max(...programs.map(p => p.Id)) : 0;
    const newProgram = {
      ...programData,
      Id: maxId + 1,
      created_at: new Date().toISOString()
    };
    programs.push(newProgram);
    toast.success(`Program "${newProgram.title}" created successfully!`);
    return { ...newProgram };
  } catch (error) {
    toast.error("Failed to create program. Please try again.");
    throw error;
  }
};

export const updateProgram = async (id, programData) => {
  await delay(300);
  const index = programs.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Program not found");
  }
  programs[index] = { ...programs[index], ...programData };
  return { ...programs[index] };
};

export const deleteProgram = async (id) => {
  await delay(300);
  const index = programs.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Program not found");
  }
  const deleted = programs[index];
programs.splice(index, 1);
  return { ...deleted };
};

export const getNonMembershipPrograms = async () => {
  await delay(300);
  return programs.filter(p => p.slug !== "membership").map(p => ({ ...p }));
};