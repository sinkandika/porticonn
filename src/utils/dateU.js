// date format
export const dateFormat = (timestamp) => {
  if (!timestamp) return "-";

  try {
    return timestamp.toDate().toLocaleDateString();
  } catch {
    return "-";
  }
};

// x days left
export const getDaysRemaining = (deadline) => {
  if (!deadline) return null;

  let end;

  // If Firebase Timestamp
  if (typeof deadline.toDate === "function") {
    end = deadline.toDate();
  } 
  // If already JS Date
  else if (deadline instanceof Date) {
    end = deadline;
  } 
  // If string
  else {
    end = new Date(deadline);
  }

  const now = new Date();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
