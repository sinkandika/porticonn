import ProjectDropdown from "../components/ProjectDropdown";
import { getTaskStatus } from "../utils/taskU";
import VerticalDot from "../assets/vertical-dot.svg"
import { getStatusColor } from "../utils/statusU";

const TaskTable = ({
  currentTasks,
  checkedTask,
  handleSelectedTask,
  setCheckedTask,
  handleViewTask,
  handleEditTask,
  handleDeleteTask,
  loading,
}) => {

  return (
    <div className="flex overflow-y-auto flex-col rounded-md">
      <table className="w-full min-w-250">
        <thead className="bg-background text-left text-primary items-center">
          <tr>
            <th className="p-4">
              <input
                type="checkbox"
                checked={
                  currentTasks.length > 0 &&
                  currentTasks.every((t) =>
                  checkedTask.includes(t.id)
                  )
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setCheckedTask((prev) => [
                      ...new Set([
                        ...prev,
                        ...currentTasks.map((t) => t.id),
                      ]),
                    ]);
                  } else {
                    setCheckedTask([]);
                  }
                }}
              />
            </th>
            <th className="p-4">Task ID</th>
            <th className="p-4">Name</th>
            {/*<th className="p-4">Description</th>*/}
            <th className="p-4">Start Date</th>
            <th className="p-4">Deadline</th>
            <th className="p-4">Status</th>
            {/*<th className="p-4">Created At</th>*/}
            <th className="p-4"></th>
          </tr>
        </thead>

        <tbody className="">
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center py-4">
                Loading task
              </td>
            </tr>
          ) : currentTasks.length === 0 ? (
            <tr>
              <td>no task appear</td>
            </tr>
          ) : (
            currentTasks.map((t) => (
              <tr 
              key={t.id} 
              
              className="cursor-pointer hover:bg-hover transition border-b border-brdr text-left text-primary z-0"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={checkedTask.includes(t.id)}
                    onChange={() => handleSelectedTask(t.id)}
                  />
                </td>
                <td className="p-4" onClick={()=> handleViewTask(t)}>{t.taskId}</td>
                <td className="p-4" onClick={()=> handleViewTask(t)}>{t.name}</td>
                {/*<td className="p-4">{t.description}</td>*/}
                <td className="p-4">{t.startDate}</td>
                <td className="p-4">{t.deadline}</td>
                <td className={`p-4 ${getStatusColor(getTaskStatus(t))}`}>{getTaskStatus(t)}</td>
                {/*<td className="p-4">{dateFormat(t.createdAt)}</td> import dateFormat first*/} 
                <td className="p-4">
                  <ProjectDropdown
                    options={[
                      {
                        label: "View",
                        onClick: () => handleViewTask(t),
                      },
                      {
                        label: "Edit",
                        onClick: () => handleEditTask(t),
                      },
                      {
                        label: "Delete",
                        onClick: () => handleDeleteTask(t),
                      },
                    ]}
                    icon={VerticalDot}
                    iconClassName="w-1"
                    menuClassName="absolute bg-white py-2 px-4 z-99 text-primary font-medium right-10 shadow"
                  />
                </td>
              </tr>
            ))
          )}
          
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;