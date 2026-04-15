// status color
export const getStatusColor = (status) => {
  const statusMap = {
    "Pending": "text-progress-pending",
    "On-progress": "text-progress-on-progress",
    "Complete": "text-progress-complete",
    "Overdue": "text-progress-overdue"
  };
  return statusMap[status];
};