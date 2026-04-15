const ProjectTabs = ({ activeTab, setActiveTab, counts }) => {
  return (
    <div className="flex flex-col gap-y-6 overflow-x-auto">
      <div className="flex gap-x-6 min-w-lg">
        <button
          onClick={() => setActiveTab("all")}
          className={`p-3 font-medium border-b-3 transition ${
            activeTab === "all"
              ? "border-third text-third"
              : "border-transparent text-secondary hover:text-secondary-h"
          }`}
        >
          All Projects ({counts?.all || 0})
        </button>
        <button
          onClick={() => setActiveTab("created")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "created"
              ? "border-third text-third"
              : "border-transparent text-secondary hover:text-secondary-h"
          }`}
        >
          Created Projects ({counts?.created || 0})
        </button>
        <button
          onClick={() => setActiveTab("joined")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "joined"
              ? "border-third text-third"
              : "border-transparent text-secondary hover:text-secondary-h"
          }`}
        >
          Joined Projects ({counts?.joined || 0})
        </button>
      </div>
      <div className="border-b-2 border-background">

      </div>
    </div>
  );
};

export default ProjectTabs;