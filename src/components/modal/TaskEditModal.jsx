import { useState } from "react"
import { updateTask } from "../../services/taskService";
import CloseIcon from "../../assets/close-icon.svg"
import AlertIcon from "../../assets/alert-icon.svg"
import LoadingIcon from "../../assets/loading-icon.svg"
import TimeIcon from "../../assets/time-icon.svg"
import FlagIcon from "../../assets/flag-icon.svg"
import { dateFormat } from "../../utils/dateU";

const TaskEditmodal = ({ isOpen, onClose, task, projectId }) => {
  const [name, setName] = useState(task.name || "");
  const [description, setDescription] = useState(task.description || "");
  const [startDate, setStartDate] = useState(task.startDate || "");
  const [deadline, setDeadline] = useState(task.deadline || "");
  const [status, setStatus] = useState(task.status || "Pending");

  const [isClicked, setIsClicked] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [error, setError] = useState(false);
  
  // update task
  const handleUpdate = async (e) => {
    setIsClicked(true);
    e.preventDefault();

    if (startDate > deadline) {
      setError("Start date must be earlier than deadline");
      setIsClicked(false); 
      return;
    }

    try {
      await updateTask(projectId, task.id, {
        name,
        description,
        startDate,
        deadline,
        status,
      });
      
      setAlertOpen("Task Updated!");
      setIsClicked(true);

      // delay close modal
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err){
      console.error(err);
      setIsClicked(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-99 flex justify-center items-center">
      <div className="bg-white flex flex-col px-8 py-10 gap-y-5 rounded-md text-primary w-2xl">
        {alertOpen && (
          <div className="bg-progress-complete/20 text-primary p-3 rounded-md mt-3 text-center">
            {alertOpen}
          </div>
        )}
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
          <p className="text-xl font-medium">Edit Task</p>
        </div>
        <div className="border-b-2 border-background"></div>
        <form
         onSubmit={handleUpdate}
         className="font-medium flex flex-col gap-y-5"
        >

          <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-brdr text-xl text-primary p-2"
          />

          <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-brdr min-h-30 text-secondary p-2"
          />
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
          {error && (
            <div>
              <p className="text-error">{error}</p>
            </div>
          )}
          <div className="flex justify-between">
            <div className="relative">
              <img
              src={TimeIcon}
              alt="tim"
              className="absolute w-4 left-0 translate-y-1/5"
              />
              <p className="text-secondary flex-1 pl-8">Start Date</p>
            </div>
            <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            />
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
            <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            />
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
            <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="On-progress">On Proggress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          <button
          type="submit"
          className={`
            text-white rounded-md py-2 px-5 mt-5
            ${isClicked 
              ? 'bg-disable-button cursor-not-allowed opacity-50'
              : 'bg-third hover:bg-third-h'
            }
          `}
          >
            {isClicked 
            ? `Saving...`
            : 'Save'
            }
        </button>

        </form>
      </div>
    </div>
  )


}
export default TaskEditmodal;