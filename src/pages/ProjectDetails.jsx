import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { deleteProject, getProjectById } from "../services/projectService";
import ProjectDetailsEditModal from "../components/modal/ProjectDetailsEditModal";
import { getProjectStatus } from "../utils/projectU";
import { getStatusColor } from "../utils/statusU";
import TaskCreateModal from "../components/modal/TaskCreateModal";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebase";
import ProjectDropdown from "../components/ProjectDropdown";
import TaskViewModal from "../components/modal/TaskViewModal";
import { dateFormat } from "../utils/dateU";
import TaskEditmodal from "../components/modal/TaskEditModal";
import { useDebounce } from "../hooks/useDebounce";
import { getProgressPercentage, getTaskProgress, getTaskStatus } from "../utils/taskU";
import { getDaysRemaining } from "../utils/dateU";
import TaskProgressBar from "../components/TaskProgressbar";
import { getUserById } from "../services/userService";
import defaultPic from "../assets/default-profile.svg";
import MemberModal from "../components/modal/MemberModal";
import UserDropdown from "../components/UserDropdown";
import { sendMessage } from "../services/messageService";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInputTest";
import TaskTable from "../components/TaskTable";
import VerticalDot from "../assets/vertical-dot.svg";
import Pagination from "../components/Pagination";
import searchIcon from "../assets/search-icon.svg";
import AddIcon from "../assets/add-icon-white.svg";
import DeleteIcon from "../assets/delete-icon-white.svg"

export default function ProjectDetails () {

  const { projectId } = useParams(); // link for project Id firebase (same with app.jsx)

  const [loadingTask, setLoadingTask] = useState(true); // loading task

  // project variable
  const { user } = useAuth();
  const [project, setProject] = useState(null); // setProject to get all db and call with project
  const navigate = useNavigate();

  // task variable
  const [tasks, setTasks] = useState([]);

  // members variable
  const [membersData, setMembersData] = useState([]);

  // member modal
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // create task modal
  const [showCreateTask, setShowCreateTask] = useState(false);

  // message variable
  const [messages, setMessages] = useState([]); // show realtime message

  // fetch projects database and refresh
  const fetchProject = useCallback(async () => { // callback for refresh after saving
    try {
      const data = await getProjectById(projectId); // from projectService
      setProject(data);
    } catch (error) {
      console.error(error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // fetch task
  useEffect(() => {
    if (!projectId) return;

    const taskRef = collection(db, "projects", projectId, "tasks");
    const q = query(taskRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snap) => {
      const taskList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(taskList);
      setLoadingTask(false);
    }, [projectId]);

    return () => unsubscribe();
  }, [projectId]);

  // task count
  const taskCount = tasks.length;

  // selected task variable
  const [selectedTask, setSelectedTask] = useState(null);

  // task action view
  const [showTaskViewModal, setShowTaskViewModal] = useState(false);

  const handleViewTask = (t) => {
    setSelectedTask(t);
    setShowTaskViewModal(true);
  };

  // task action edit
  const [showTaskEditModal, setShowTaskEditModal] = useState(false);

  const handleEditTask = (t) => {
    setSelectedTask(t);
    setShowTaskEditModal(true);
  };

  // task action delete
  const handleDeleteTask = async (t) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;

    try {
      const taskRef = doc(db, "projects", projectId, "tasks", t.id);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error(err);
    }
  };

  // search task
  const [searchTerm, setSearchTerm] = useState("");

  const debounceSearch = useDebounce(searchTerm, 300); // useDebounce.js

  const fillteredTasks = tasks.filter((t) => {
    const term = debounceSearch.toLowerCase();
    const status = getTaskStatus(t).toLowerCase();

    return (
      t.taskId?.toLowerCase().includes(term) ||
      t.name?.toLowerCase().includes(term) ||
      status.includes(term)
    );
  });

  // pagination task
  const [currentPage, setCurrentPage] = useState(1);
  const taskDataLimit = 5;

  const indexLastTask = currentPage * taskDataLimit;
  const indexFirstTask = indexLastTask - taskDataLimit;

  const currentTasks= fillteredTasks.slice(
    indexFirstTask,
    indexLastTask
  );

  const totalPages = Math.ceil(fillteredTasks.length / taskDataLimit);

  // bulk task variable
  const [checkedTask, setCheckedTask] = useState([]);

  // task selected
  const handleSelectedTask = (taskId) => { // get generated task id not task id firestore
    setCheckedTask((prev) => 
      prev.includes(taskId)
      ? prev.filter((id) => id !== taskId)
      : [...prev, taskId]
    );
  };

  // bulk task delete
  const handleBulkDelete = async () => {
    const confirmDelete = window.confirm(
      "delete selected tasks?"
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        checkedTask.map((taskId) => {
        const taskRef = doc(db, "projects", projectId, "tasks", taskId); 
        return deleteDoc(taskRef);
      })
      );

      setCheckedTask([]); // reset checkmark after delete
    } catch (err) {
      console.error(err);
    }
  }

  useEffect (() => {
    setCheckedTask([]);
  }, [currentPage]);

    // task time remaining
  const daysRemaining = getDaysRemaining (project?.deadline);

  // task progress
  const taskProgress = getTaskProgress(tasks); // tasks is inside getTaskProgress in taskU.js

  // task progress percentage
  const taskPercent = getProgressPercentage(tasks);

  // edit project
	const [showEditModal, setShoweditModal] = useState(false);

  // delete project
  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm(
      "Are you sure to delete this project?"
    );
    if (!confirmDelete) return;
    try {
      await deleteProject(project.id); // from projectService
      alert("Project delete");

      navigate("/projects");
    } catch (err) {
      console.error("Delete system error", err);
    }
  };

  // fetch members firestore
  useEffect(() => {
    const fetchMember = async () => {
      if (!project?.members) return;

      const users = await getUserById(project.members);
      setMembersData(users);
    };

    fetchMember();
  }, [project]);

  // remove and refresh member
  const handleRemoveMember = (uid) => {
    // update members uid
    const upMembers = project.members.filter(
      (id) => id !== uid
    );

    // update project state
    setProject({
      ...project,
      members: upMembers,
    });

    // update ui member
    setMembersData((prev) =>
      prev.filter((mem) => mem.uid !== uid)
    );
  };

  // send message 
  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    await sendMessage(projectId, {
      text,
      senderId: user.uid,
      senderName: user.displayName || "user",
    });
  };


  // realtime message
  useEffect (() => {
    if (!projectId) return;

    const messageRef = collection(db, "projects", projectId, "messages");
    const q = query (messageRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(msgs);
    });

    return() => unsubscribe();
  }, [projectId]);

  // loading project
  if (!user) return <p>Loading user...</p>;
  if (!project) return <p>Loading project...</p>;

  // host and member rule
  const isOwner = project.ownerId === user.uid; // if ownerId and user.uid identical, it will make ownerID = true and show host page
  /*const isMember = project.members.includes(user.uid); // member view (host can saw too)*/

  // block outsider
  if (!project.members.includes(user.uid)) {
    return <p>You don't have permission</p>
  };

  // project overdue status
  const displayStatus = getProjectStatus(project);

  // create at convert
  const timeConvert = dateFormat(project.createdAt);

  return (
    <div className="bg-background h-screen flex flex-col">

      <div className="flex justify-end py-2 px-7 bg-white w-full items-center">
        <UserDropdown />
      </div>

      <div className="px-3 py-4 flex flex-col gap-3 overflow-auto">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
          <div className="bg-white lg:row-span-2 row-span-1 p-8 flex flex-col gap-y-5"> {/* row-span-2 merge 2 row */}
            <div className="flex flex-col gap-y-2 font-medium">
                {/* host view */}
                {isOwner && (
                  <ProjectDropdown
                  icon={VerticalDot}
                  label=""
                  options={[
                    {
                      label: "Edit Project",
                      onClick: () => setShoweditModal(true),
                    },
                    {
                      label: "Delete Project",
                      onClick: handleDeleteProject,
                    }
                  ]}
                  iconClassName="w-1 absolute right-0"
                  menuClassName="absolute bg-white rounded-md p-2 right-0 top-5 text-center shadow text-primary w-40"
                  />
                )}
              <p className="text-2xl text-primary">
                {project.projectName}
              </p>
              <p className="text-lg text-secondary max-w-250">
                {project.description}
              </p>
            </div>
            <div className="flex flex-col lg:flex-row justify-between gap-x-10 font-medium gap-y-3 lg:gap-y-0 overflow-x-auto">
              <div className="flex-1 flex flex-col gap-y-3">
                <div className="flex justify-between">
                  <p className="text-secondary">
                    Status
                  </p>
                  <p className={`font-medium ${getStatusColor(displayStatus)}`}>
                    {displayStatus}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-secondary">
                    Project ID
                  </p>
                  <p className="text-primary">
                    {project.id}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-secondary">
                    Invite code
                  </p>
                  <p className="text-primary">
                    {project.inviteCode}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-secondary">
                    Number of Task
                  </p>
                  <p className="text-primary">
                    {taskCount}
                  </p>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-y-3">
                <div className="flex justify-between">
                  <p className="text-secondary">
                    Host
                  </p>
                  <p className="text-primary">
                    {project.ownerName}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-secondary">
                    Create At
                  </p>
                  <p className="text-primary">
                    {timeConvert}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-secondary">
                    Start Date
                  </p>
                  <p className="text-primary">
                    {project.startDate}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-secondary">
                    Deadline
                  </p>
                  <p className="text-primary">
                    {project.deadline}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className=" bg-white lg:col-start-2 lg:row-start-1 col-start-1 row-start-2 p-8 flex flex-col gap-y-3">
            <p className="text-xl font-medium">
              Progress
            </p>
            <div className="flex justify-between font-medium">
              <p className="text-secondary">
                Time Remaining
              </p>
              <p className="text-primary">
                {daysRemaining === null
                ? "No deadline"
                : daysRemaining > 0
                ? `${daysRemaining} days left`
                : daysRemaining === 0
                ? "Last day"
                : "lol it's end"
                }
              </p>
            </div>
            <div className="flex justify-between font-medium">
              <p className="text-secondary">Task Complete</p>
              <p className="text-primary">{taskProgress.complete}/{taskProgress.total}</p>
            </div>
            <div className="flex justify-between font-medium">
              <p className="text-secondary">Project Progress</p>
              <p>{taskPercent}%</p>
            </div>
            <div className="pt-3">
              <TaskProgressBar
                value={taskPercent}
                />
            </div>
          </div>
          <div className="bg-white lg:col-start-2 lg:row-start-2 col-start-1 row-start-3 flex items-center font-medium text-primary p-5">
            <p className="text-xl font-medium pl-2 pr-4">
              Members
            </p>
            {membersData.slice(0,5).map((m) => (
              <img
              key={m.uid}
              src={m.photoURL || defaultPic}
              alt="ava"
              className="h-13 w-13 rounded-full p-1"
              />
            ))}
            {membersData.length > 5 && (
              <div className="h-8 w-8">
                +{membersData.length - 5}
              </div>
            )}
            <div className="relative w-full h-full">
              <button
              onClick={() => setIsMemberModalOpen(true)}
              className="absolute right-0 hover:text-primary-h text-sm"
              >
                See All
              </button>
            </div>
            <MemberModal
              isOpen={isMemberModalOpen}
              onClose={() => setIsMemberModalOpen(false)}
              members={membersData}
              project={project}
              isOwner={isOwner}
              onRemoveMember={handleRemoveMember}
              inviteCode={project.inviteCode}
            />
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
          <div className="bg-white p-8 gap-y-6 flex flex-col">
            <div className="flex flex-col lg:flex-row gap-5">
              <p className="text-xl font-medium flex-1">
                Task
              </p>
              <div className="relative">
                <img
                src={searchIcon}
                alt="src"
                className="w-5 absolute left-2 translate-y-1/2 opacity-50"
                />
                <input
                type="text"
                placeholder="Search task"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-3 py-2 pl-10 rounded-md focus:border-third-h outline-none w-full"
              />
              </div>
              <div className="flex flex-row justify-end gap-x-3 ">
                <button
                onClick={() => setShowCreateTask(true)}
                className="bg-third px-2.5 rounded-md hover:bg-third-h"
                >
                  <img
                  src={AddIcon}
                  alt="plus"
                  className="w-5 h-10"
                  />
                </button>
                {/* bulk delete */}
                {checkedTask.length > 0 && (
                  <button
                  onClick={handleBulkDelete}
                  className="bg-cancel px-2.5 rounded-md hover:bg-cancel-h"
                  >
                    <img
                    src={DeleteIcon}
                    alt="del"
                    className="w-5 h-10"
                    />
                  </button>
                )}
              </div>
            </div>
            <TaskTable
              currentTasks={currentTasks} // tasks(database)->filteredTasks(search)->currentTasks(pagination)
              checkedTask={checkedTask}
              handleSelectedTask={handleSelectedTask}
              setCheckedTask={setCheckedTask}
              handleViewTask={handleViewTask}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              loading={loadingTask}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
          <div className="grid col-start-1 row-start-2 lg:row-start-1 lg:col-start-2">
            <div className="bg-white p-8 flex flex-col gap-y-5">
              <p className="text-xl font-medium flex-1">
                Message
              </p>
              <MessageList
              messages={messages}
              currentUserId={user.uid}
              onSend={handleSendMessage}
              />
            </div>
          </div>
        </div>
      </div>
        
        {/* Edit modal */}
        {showEditModal && (
          <ProjectDetailsEditModal
            project={project}
            onClose={() => setShoweditModal(false)}
            onUpdate={fetchProject}
          />
        )}
        {/* task view modal */}
        {showTaskViewModal && (
          <TaskViewModal
          isOpen={showTaskViewModal}
          onClose={() => {
            setShowTaskViewModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          />
        )}
        {/* create task modal */}
        {showCreateTask &&(
          <TaskCreateModal
          isOpen={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          projectId={projectId}
          />
        )}
        {/* task edit modal */}
        {showTaskEditModal && (
          <TaskEditmodal
          isOpen={showTaskEditModal}
          onClose={() => setShowTaskEditModal(false)}
          task={selectedTask}
          projectId={projectId}
          />
        )}
    </div>
  );
}