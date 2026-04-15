// task status
export const getTaskStatus = (task) => {
  const today = new Date();
  const deadline = new Date(task.deadline);

  // prevent overdue if project complete
  if (task.status === "Complete"){
    return "Complete";
  };

  // overdue condition
  if (deadline < today) {
    return "Overdue";
  };

  // otherwise get original status
  return task.status || "Pending";
};

// task progress
export const getTaskProgress = (tasks) => {
  const total = tasks.length;

  let pending = 0;
  let onProgress = 0;
  let complete = 0;
  let overdue = 0;

const now = new Date();

tasks.forEach((task) => {
  const status = task.status;

  if (status === "Pending") pending++;
  if (status === "On-progress") onProgress++;
  if (status === "Complete") complete++;

  // deadline handling
  let deadlineDate = null;

  if (task.deadline) {
    if (typeof task.deadline.toDate === "function") {
      // firebase Timestamp
      deadlineDate = task.deadline.toDate();
    } else {
      // already Date or string
      deadlineDate = new Date(task.deadline);
    }
  }

  if (
    deadlineDate &&
    status !== "Complete" &&
    deadlineDate < now
  ) {
    overdue++;
  }
});

  return { total, pending, onProgress, complete, overdue,};
};

// task complete percentage
export const getProgressPercentage = (tasks) => {
  const total = tasks.length;

  if (total === 0) return 0;

  const complete = tasks.filter((task) =>
    task.status === "Complete").length;

    const percentage = Math.round((complete / total) * 100);

    return percentage;
};