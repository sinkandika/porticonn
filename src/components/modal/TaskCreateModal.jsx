import { useState } from "react";
import { createTask, generateTaskId } from "../../services/taskService";
import CloseIcon from "../../assets/close-icon.svg"

const TaskCreateModal = ({ isOpen, onClose, projectId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  // alert
  const [isClicked, setIsClicked] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [error, setError] = useState(false);

  // create task
  const getTaskId = generateTaskId();

  const handleCreateTask = async (e) => {
    setIsClicked(true);
    e.preventDefault();

    if (startDate > deadline) {
      setError("Start date must be earlier than deadline?");
      setIsClicked(false);
			return;
    }

    try {
      await createTask(projectId, {
        getTaskId, // just to show generate task id in console
        name,
        description,
        startDate,
        deadline,
      });

      console.log("task ID is: ", getTaskId);

      setAlertOpen("task created!");
      setIsClicked(true);

      // delay close modal
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error(error);
      setIsClicked(false);
    }
  };

  if (!isOpen) return null;

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
          <p className="text-xl font-medium">Create New Task</p>
        </div>
        <div className="border-b-2 border-background"></div>
        <form 
        onSubmit={handleCreateTask}
        className="font-medium flex flex-col gap-y-5"
        >
          <div className="flex justify-between items-center">
            <p className="text-secondary w-full">Task Name</p>
            <input
              type="text"
              placeholder="Task Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-brdr text-primary outline-third p-2 w-full"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-secondary w-full">Task Description</p>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-brdr text-primary outline-third p-2 w-full min-h-20" 
            />
          </div>
          {error && (
            <div>
              <p className="text-error">{error}</p>
            </div>
          )}
          <div className="flex justify-between items-center">
            <p className="text-secondary w-full">Start Date</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="border border-brdr text-primary outline-third p-2 w-full"
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-secondary w-full">Deadline</p>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="border border-brdr text-primary outline-third p-2 w-full"
            />
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
              ? `Creating task...`
              : 'Create'
              }
          </button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateModal;