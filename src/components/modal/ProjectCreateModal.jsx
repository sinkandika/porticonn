import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createProject, generateInviteCode } from "../../services/projectService";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import CloseIcon from "../../assets/close-icon.svg"

const ProjectCreateModal = ({onClose}) => {

	const { user } = useAuth();

	const [projectName, setProjectName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [deadline, setDeadline] = useState("");

	const navigate = useNavigate();

	const [error, setError] = useState("");

	// create project
	const handleCreateProject = async () => {
		if (!projectName) {
			setError("Project name is required");
			return;
		}
		if (startDate > deadline) {
			setError("why is the start date earlier than the deadline?");
			return;
		}

		try {
			setError(false);
			const inviteCode = generateInviteCode(); // from projectService

			const projectDatabase = {
				projectName,
				description,
				startDate,
				deadline,
				ownerName: user.displayName,
				ownerId: user.uid, // user.uid is firebase Auth property
				members: [user.uid],
				inviteCode,
				status: "Pending",
				createdAt: serverTimestamp(),
			};

			const projectId = await createProject(projectDatabase); // from projectService (just to get console log

			console.log("Project Created ID:", projectId);
			console.log("Invite Code:", inviteCode); // from projectData

			navigate(`/projects/${projectId}`) //from const projectId
			onClose(); // close modal
		} catch (err) {
			console.error("Error creating project", err);
		}
	};


	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className=" bg-white flex flex-col p-8 gap-y-10 rounded-md text-primary w-2xl">
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
						<p className="text-xl font-medium">Create New Project</p>
					</div>
					<div className="border-b-2 border-background"></div>
				</div>
				<div className="flex flex-col gap-y-8">
					<div className="flex justify-between items-center">
						<p className="w-full">Project name:</p>
						<input
						placeholder="Project name"
						value={projectName}
						type="text"
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
						className="bg-background p-2 rounded-md outline-third w-full"
						/>
					</div>
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
				</div>
				{error && (
					<div>
						<p className="text-error">{error}</p>
					</div>
				)}
				<div className="flex justify-end gap-3">
					<button
					onClick={onClose}
					className="text-white bg-cancel hover:bg-cancel-h rounded-md py-2 px-5"
					>
						Cancel
					</button>
					<button
						onClick={handleCreateProject}
						className="bg-third text-white hover:bg-third-h rounded-md py-2 px-5"
						>
							Create Project
						</button>
				</div>
			</div>
		</div>
	);
};

export default ProjectCreateModal;