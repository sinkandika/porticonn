import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { joinProjectByCode } from "../../services/projectService";
import CloseIcon from "../../assets/close-icon.svg"

const ProjectJoinModal = ({onClose}) => {
  const [invtCode, setInvtCode] = useState();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  // join project
  const handleJoinProject = async () => {
    if (!invtCode) {
      setError ("Invite code is required");
      return;
    }

    try {
      const projectId = await joinProjectByCode(invtCode, user.uid);
      console.log("Joined project:", projectId);

			navigate(`/projects/${projectId}`) //from const projectId
			onClose(); // close modal
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="fixed bg-black/50 inset-0 flex items-center justify-center z-90">
      <div className=" bg-white flex flex-col p-8 rounded-md text-primary w-md gap-y-8">
        <div className="flex flex-col gap-2">
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
          </div>
          <p className="text-xl font-medium">Join Project</p>
          <div className="border-b-2 border-background"></div>
        </div>
        <div className="px-10 flex flex-col gap-y-5 text-center text-primary">
          <p>Enter Invite Code</p>
          {error && (
            <div>
              <p className="text-error">{error}</p>
            </div>
          )}
          <input
          placeholder="enter code"
          value={invtCode}
          onChange={(e) => setInvtCode(e.target.value)}
          type="text"
          className="bg-background p-2 rounded-md outline-third w-full text-center"
          />
          <button
          className="bg-third text-white hover:bg-third-h rounded-md py-2 px-5"
          onClick={handleJoinProject}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectJoinModal;