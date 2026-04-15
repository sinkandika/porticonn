import { dateFormat } from "../../utils/dateU";
import CloseIcon from "../../assets/close-icon.svg"
import AlertIcon from "../../assets/alert-icon.svg"
import LoadingIcon from "../../assets/loading-icon.svg"
import TimeIcon from "../../assets/time-icon.svg"
import FlagIcon from "../../assets/flag-icon.svg"
import { getStatusColor } from "../../utils/statusU";

const TaskViewModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null ;

  return (
    <div className="fixed inset-0 bg-black/50 z-99 flex items-center justify-center">
      <div className="bg-white flex flex-col px-8 py-10 gap-y-5 rounded-md text-primary w-2xl">
        <div className="relative">
          <button 
          onClick={onClose}
          className="absolute right-0"
          >
            <img 
            src={CloseIcon} 
            alt="close" 
            className="w-4" />
          </button>
          <p className="text-xl font-medium">Task Details</p>
        </div>
        <div className="border-b-2 border-background"></div>
        <div className="font-medium flex flex-col gap-y-5 ">
          <p className="text-xl text-primary">{task.name}</p>
          <p className="text-secondary">{task.description}</p>
          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between">
              <div className="relative">
                <img
                src={FlagIcon}
                alt="flg"
                className="absolute w-3 left-1 translate-y-1/5"
                />
                <p className="text-secondary flex-1 pl-8">Created At</p>
              </div>
              <p className="text-primary">{dateFormat(task.createdAt)}</p>
            </div>
            <div className="flex justify-between">
              <div className="relative">
                <img
                src={TimeIcon}
                alt="tim"
                className="absolute w-4 left-0 translate-y-1/5"
                />
                <p className="text-secondary flex-1 pl-8">Start Date</p>
              </div>
              <p className="text-primary">{task.startDate}</p>
            </div>
            <div className="flex justify-between">
              <div className="relative">
                <img
                src={AlertIcon}
                alt="now"
                className="absolute w-1.5 left-1 translate-y-1/6"
                />
                <p className="text-secondary flex-1 pl-8">Deadline</p>
              </div>
              <p className="text-progress-overdue">{task.deadline}</p>
            </div>
            <div className="flex justify-between">
              <div className="relative">
                <img
                src={LoadingIcon}
                alt="load"
                className="absolute w-4 left-0 translate-y-1/4"
                />
                <p className="text-secondary flex-1 pl-8">Status</p>
              </div>
              <p className={`${getStatusColor(task.status)}`}>{task.status}</p>
            </div>

          </div>
        </div>
      </div>
    </div>

  );
};

export default TaskViewModal;