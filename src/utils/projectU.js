
// project status
export const getProjectStatus = (project) => {
  const today = new Date();
  const deadline = new Date(project.deadline);

  // prevent overdue if project complete
  if (project.status === "complete") {
    return "Complete";
  }

  // overdue condition
  if (deadline < today ){
    return "Overdue";
  }

  // otherwise retun original status
  return project.status;
};