import reviewData from "@/services/mockData/reviews.json";

let reviews = [...reviewData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getReviews = async () => {
  await delay(300);
  return [...reviews].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getFeaturedReviews = async () => {
  await delay(200);
  return reviews.filter(r => r.featured === true);
};

export const getReviewById = async (id) => {
  await delay(200);
  const review = reviews.find(r => r.Id === parseInt(id));
  if (!review) {
    throw new Error("Review not found");
  }
  return { ...review };
};

export const createReview = async (reviewData) => {
  await delay(400);
  const maxId = reviews.length > 0 ? Math.max(...reviews.map(r => r.Id)) : 0;
  const newReview = {
    ...reviewData,
    Id: maxId + 1,
    likes: reviewData.likes || [],
    featured: reviewData.featured || false,
    created_at: new Date().toISOString()
  };
  reviews.push(newReview);
  return { ...newReview };
};

export const updateReview = async (id, reviewData) => {
  await delay(300);
  const index = reviews.findIndex(r => r.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Review not found");
  }
  reviews[index] = { ...reviews[index], ...reviewData };
  return { ...reviews[index] };
};

export const toggleLike = async (id, userId) => {
  await delay(200);
  const index = reviews.findIndex(r => r.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Review not found");
  }
  
  const review = reviews[index];
  const likes = [...review.likes];
  const userIndex = likes.indexOf(parseInt(userId));
  
  if (userIndex > -1) {
    likes.splice(userIndex, 1);
  } else {
    likes.push(parseInt(userId));
  }
  
  reviews[index] = { ...review, likes };
  return { ...reviews[index] };
};

export const deleteReview = async (id) => {
  await delay(300);
  const index = reviews.findIndex(r => r.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Review not found");
  }
  const deleted = reviews[index];
  reviews.splice(index, 1);
  return { ...deleted };
};