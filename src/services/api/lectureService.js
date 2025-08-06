import lectureData from "@/services/mockData/lectures.json";

let lectures = [...lectureData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getLectures = async () => {
  await delay(300);
  return [...lectures];
};

export const getLectureById = async (id) => {
  await delay(200);
  const lecture = lectures.find(l => l.Id === parseInt(id));
  if (!lecture) {
    throw new Error("Lecture not found");
  }
  return { ...lecture };
};

export const getLecturesByProgram = async (programId) => {
  await delay(250);
  return lectures.filter(l => l.program_id === parseInt(programId));
};

export const getLecturesByCategory = async (category) => {
  await delay(200);
  return lectures.filter(l => l.category.toLowerCase() === category.toLowerCase());
};

export const createLecture = async (lectureData) => {
  await delay(400);
  const maxId = lectures.length > 0 ? Math.max(...lectures.map(l => l.Id)) : 0;
  const newLecture = {
    ...lectureData,
    Id: maxId + 1,
    created_at: new Date().toISOString()
  };
  lectures.push(newLecture);
  return { ...newLecture };
};

export const updateLecture = async (id, lectureData) => {
  await delay(300);
  const index = lectures.findIndex(l => l.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Lecture not found");
  }
  lectures[index] = { ...lectures[index], ...lectureData };
  return { ...lectures[index] };
};

export const deleteLecture = async (id) => {
  await delay(300);
  const index = lectures.findIndex(l => l.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Lecture not found");
  }
  const deleted = lectures[index];
  lectures.splice(index, 1);
  return { ...deleted };
};