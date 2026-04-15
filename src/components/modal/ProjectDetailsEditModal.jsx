import { useState } from "react";
import { updateProject } from "../../services/projectService";
import CloseIcon from "../../assets/close-icon.svg"

const ProjectDetailsEditModal = ({ project, onClose, onUpdate }) => {
  const [projectName, setProjectName] = useState(project.projectName); // it's for pre fill data
  const [description, setDescription] = useState(project.description);
  const [startDate, setStartDate] = useState(project.startDate);
  const [deadline, setDeadline] = useState(project.deadline);
  const [status, setStatus] = useState(project.status);

  const [isClicked, setIsClicked] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [error, setError] = useState(false);

  // status dropdown
  const statusDropdown = [
    { value: "Pending", label: "Pending"},
    { value: "On-progress", label: "On-Progress"},
    { value: "Complete", label: "Complete"},
  ];

  // update project
  const handleUpdate = async () => {
    setIsClicked(true);

    if (startDate > deadline) {
      setError("Start date must be earlier than deadline");
      setIsClicked(false); 
      return;
    }

    try {
      setError(false) // close error
      await updateProject(project.id, {
        projectName,
        description,
        startDate,
        deadline,
        status,
      });

      if (onUpdate) {
        await onUpdate();
      }

      // show alert
      setAlertOpen("Project updated!");
      setIsClicked(false);

      // delay close modal
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error(error);
      setIsClicked(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99">
      <div className="bg-white flex flex-col p-8 gap-y-5 rounded-md text-primary w-2xl">
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
          <p className="text-xl font-medium">Edit Project</p>
        </div>
        <div className="border-b-2 border-background"></div>
        <div className="flex justify-between items-center">
          <p className="w-full">Project name:</p>
          <input 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)} 
          className="bg-background p-2 rounded-md outline-third w-full"
          />
        </div>
        <div className="flex justify-between">
						<p className="w-full">Project Description:</p>
						<textarea
						placeholder="Enter description"
						value={description}
						type="text"
						onChange={(e) => setDescription(e.target.value)}
						className="bg-background p-2 rounded-md outline-third w-full min-h-20"
						/>
				</div>
        {error && (
					<div>
						<p className="text-error">{error}</p>
					</div>
				)}
        <div className="flex justify-between gap-x-20 items-center">
						<p>Start Date:</p>
						<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						className="p-2 rounded-md outline-third"
						/>
				</div>
        <div className="flex justify-between gap-x-20 items-center">
						<p>Deadline:</p>
						<input
						type="date"
						value={deadline}
						onChange={(e) => setDeadline(e.target.value)}
						className="p-2 rounded-md outline-third"
						/>
				</div>
        <div className="flex justify-between gap-x-20 items-center">
						<p>Status:</p>
						<select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            >
              {statusDropdown.map((opt) => (
                <option
                key={opt.value}
                value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
				</div>
        <button
        onClick={handleUpdate}
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
      </div>
    </div>
  );
};

export default ProjectDetailsEditModal;