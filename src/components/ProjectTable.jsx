import { useNavigate } from "react-router-dom";
import LoadingIcon from "../assets/loading-icon.svg"
import { getStatusColor } from "../utils/statusU";
import { getProjectStatus } from "../utils/projectU";

const ProjectTable = ({ projects, loading, }) => {

  const navigate = useNavigate();

  return (
  <div className="flex overflow-y-auto flex-col rounded-md">
    <table className="min-w-250 max-w-full">
      
      <thead className="bg-background text-left text-primary items-center">
        <tr>
          <th className="p-4">Project ID</th>
          <th className="p-4">Project Name</th>
          <th className="p-4 text-center">Tasks</th>
          <th className="p-4">Start Date</th>
          <th className="p-4">Deadline</th>
          <th className="p-4">Status</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan="6" className="h-75">
              <div className="flex flex-col items-center justify-center h-full gap-y-2 text-primary">
                <img src={LoadingIcon} alt="loading" className="w-10 animate-spin [animation-duration:0.5s] ease-linear" />
                <p>Loading Data</p>
              </div>
            </td>
          </tr>
        ) : projects.length === 0 ? (
          <tr>
            <td colSpan="6" className="h-75 text-center text-primary">
              No project found
            </td>
          </tr>
        ) : (
          projects.map((project) => (
            <tr
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="cursor-pointer hover:bg-hover transition border-b border-brdr text-left text-primary"
            >
              <td className="p-4">{project.id}</td>
              <td className="p-4">{project.projectName}</td>
              <td className="p-4 text-center">{project.tasksCount || 0}</td>
              <td className="p-4">{project.startDate}</td>
              <td className="p-4">{project.deadline}</td>
              <td className={`p-4 ${getStatusColor(getProjectStatus(project))}`}>
                {getProjectStatus(project)}
              </td>
            </tr>
          ))
        )}
      </tbody>

    </table>
  </div>
  );
};

export default ProjectTable;