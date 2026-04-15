import { useState } from "react";
import { createTask, generateTaskId } from "../../services/taskService";

const TaskCreateModal = ({ isOpen, onClose, projectId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");

  // create task
  const getTaskId = generateTaskId();

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (startDate > deadline) {
      alert("Why start date more than deadline date?");
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

      alert("task created!");
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Create Task</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />

        <button type="submit">Create</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default TaskCreateModal;