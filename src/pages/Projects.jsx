import { useAuth } from "../context/AuthContext";
import ProjectDropdown from "../components/ProjectDropdown";
import { useEffect, useState } from "react";
import ProjectCreateModal from "../components/modal/ProjectCreateModal";
import ProjectJoinModal from "../components/modal/ProjectJoinModal";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../services/firebase";
import UserDropdown from "../components/UserDropdown";
import ProjectTabs from "../components/ProjectTabs";
import ProjectTable from "../components/ProjectTable";
import { useDebounce } from "../hooks/useDebounce";
import PorticonFull from "../assets/porticon-full-logo.svg";
import searchIcon from "../assets/search-icon.svg"
import PorticonIcon from "../assets/porticon-icon.svg"
import Pagination from "../components/Pagination";
import ArrowIcon from "../assets/dropdown-arrow.svg"
export default function Projects () {
	const { user, loading } = useAuth(); // auth

  const [loadingProjects, setLoadingProjects] = useState(true);

  // project variable
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

	// dropdown
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

	const handleNewProject = () => {
    setShowCreateModal(true);
  };

  const handleJoinWithCode = () => {
    setShowJoinModal(true);
  };

  // dropdown options
  const createProjectOptions = [
    { label: "New Project", onClick: handleNewProject }
  ];

  const joinProjectOptions = [
    { label: "Join with Code", onClick: handleJoinWithCode }
  ];

  // fetch project
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));

        const projectList = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const projectData = docSnap.data();

            // get tasks subcollection
            const tasksSnapshot = await getDocs(
              collection(db, "projects", docSnap.id, "tasks")
            );

            const tasksCount = tasksSnapshot.size;

            return {
              id: docSnap.id,
              ...projectData,
              tasksCount, // task count
            };
          })
        );

        setProjects(projectList);
        setLoadingProjects(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProjects();
  }, []);

  // search
  const [searchTerm, setSearchTerm] = useState("");

  const debounceSearch = useDebounce(searchTerm, 300);

  // project tabs count
  const allCount = projects.length;

  const createdCount = projects.filter(
    (proj) => proj.ownerId === user.uid
  ).length;

  const joinedCount = projects.filter(
    (proj) => 
      proj.members?.includes(user.uid) &&
      proj.ownerId !== user.uid
  ).length;

  // filter projects
  const filteredProjects = projects.filter((proj) => {
    if (activeTab === "all") { // prevent all project visible in every user
      return (
        proj.ownerId === user.uid ||
        proj.members?.includes(user.uid)
      )
    }

    if (activeTab === "created") {
      return proj.ownerId === user.uid;
    }

    if (activeTab === "joined") {
      return (
        proj.members?.includes(user.uid) &&
        proj.ownerId !== user.uid
      );
    }

    return true;
  })
  .filter((proj) => {
    const text = debounceSearch.toLowerCase();

    return (
      proj.projectName?.toLowerCase().includes(text) ||
      proj.status?.toLowerCase().includes(text) ||
      proj.ownerName?.toLowerCase().includes(text)
    );
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;

  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // loading
  if (loading) return <p>Loading...</p>;
  
  return (
		<div className="flex flex-col bg-background h-screen">

      <div className="flex justify-between py-2 px-7 bg-white w-full items-center">
        <div>
          <img 
          src={PorticonFull} 
          alt="logo" 
          className="w-35 hidden lg:block"
          />
          <img 
          src={PorticonIcon} 
          alt="icon"
          className="w-6 block lg:hidden" 
          />
        </div>
  
        <div className="flex gap-20 font-medium text-primary">
          <div className="flex 2xl:gap-x-20 gap-x-10 items-center">
            <ProjectDropdown
              label="Create"
              options={createProjectOptions}
              icon={ArrowIcon}
              iconClassName="w-3 mt-1"
            />
            <ProjectDropdown
              label="Join"
              options={joinProjectOptions}
              icon={ArrowIcon}
              iconClassName="w-3 mt-1"
            />
            {showCreateModal && (
              <ProjectCreateModal
              onClose={() => setShowCreateModal(false)}
              />
            )}
            {showJoinModal && (
              <ProjectJoinModal
              onClose={() => setShowJoinModal(false)}
              />
            )}
          </div>
          <div className="flex gap-4 items-center">
            <h1>{user.displayName}</h1>
            <UserDropdown />
          </div>
        </div>

      </div>

      <div className="px-3 py-4 h-full">
        <div className="bg-white flex flex-col p-8 gap-y-8 h-full">
          <div className="">
            <ProjectTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            counts={{
              all: allCount,
              created: createdCount,
              joined: joinedCount,
            }}
            />
          </div>
          <div className="">
            <div className="border border-primary w-sm flex flex-row px-4 rounded-md">
              <img
              src={searchIcon}
              alt="search"
              className="w-5 opacity-70"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 w-full outline-none text-primary"
              />
            </div>
          </div>
          <div>
            <ProjectTable
            projects={paginatedProjects} // project(database) -> filteredProject -> paginatedProjects
            loading={loadingProjects}
            />
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

		</div>
    
  );
};