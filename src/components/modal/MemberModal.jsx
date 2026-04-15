import { useEffect, useRef, useState } from "react";
import defaultPic from "../../assets/default-profile.svg";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useDebounce } from "../../hooks/useDebounce";
import CloseIcon from "../../assets/close-icon.svg"
import searchIcon from "../../assets/search-icon.svg"
import VerticalDot from "../../assets/vertical-dot.svg";

const MemberModal = ({
  isOpen,
  onClose,
  members,
  project,
  isOwner,
  onRemoveMember,
  inviteCode
}) => {

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const debounceSearch = useDebounce(searchTerm, 300);
  const dropClose= useRef(null);

  // dropdown
  const toggleDropdown = (uid) => {
    setActiveDropdown(activeDropdown === uid ? null : uid);
  };

  // dropdown auto close
  useEffect (() => {
    const handleClickOutside = (event) => {
      if (dropClose.current && !dropClose.current.contains(event.target)) {
        setActiveDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [activeDropdown]);

  // remove member
  const handleRemove = async (uid) => {
    try {
      const updatedMembers = project.members.filter(
        (memberId) => memberId !== uid
      );

      const projectRef = doc(db, "projects", project.id);

      await updateDoc(projectRef, {
        members: updatedMembers,
      });

      onRemoveMember(uid);
      setActiveDropdown(null);
    } catch (error) {
      console.error(error);
    }
  };

  // search filter
  const filteredMembers = members.filter((mem) => {
    const term = debounceSearch.toLowerCase();

    return (
      mem.name.toLowerCase().includes(term) ||
      mem.email.toLowerCase().includes(term)
    );
  });

  // safe guard
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99">
      
      <div className="bg-white rounded-xl p-8 h-120 flex flex-col gap-y-7">
    
        <div className="relative font-medium">
            <button
            onClick={onClose}
            className="absolute right-0"
            >
              <img
              src={CloseIcon}
              alt="close"
              className="w-4"
              />
            </button>
            <h2 className="text-xl font-semibold">
              Members
            </h2>
        </div>

        <div className="flex items-center gap-x-5 justify-between font-medium">
          <div className="relative">
            <img
            src={searchIcon}
            alt="searc"
            className="w-5 absolute left-2 translate-y-1/2 opacity-50"
            />
            <input
            type="text"
            placeholder="Search member..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 pl-10 rounded-md focus:border-third-h outline-none"
          />
          </div>
          <p className="text-secondary">
            Invite code:
          </p>
          <p className="text-primary">
            {inviteCode}
          </p>
        </div>

        <div className="gap-y-2 flex flex-col">
          <p className="text-sm text-secondary">People with access</p>
          <div className="border-b-2 border-background"></div>
        </div>

        <div className="flex flex-col overflow-y-auto h-full gap-y-5">
          {filteredMembers.length === 0 && ( // members to filteredMembers
            <p className="text-sm text-gray-500 text-center">
              No members found
            </p>
          )}

          {filteredMembers.map((member) => {
            const isHost = member.uid === project.ownerId;
            return (
              <div
                key={member.uid}
                className=""
              >
                <div className="flex items-center w-full">
                  <div className="flex gap-x-5 w-full">
                    <img
                      src={member.photoURL || defaultPic}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <p className="font-medium">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">
                        {member.email}
                        </p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-end w-full pr-8">
                    {isHost ? (
                      <span className="text-sm text-third bg-third/20 py-2 px-4 rounded-full">
                        Host
                      </span>
                    ) : (
                      <span className="text-sm text-secondary bg-secondary/20 py-2 px-4 rounded-full">
                        Member
                      </span>
                    )}

                    {isOwner && !isHost && (
                      <div 
                      ref={dropClose}
                      className="absolute right-0"
                      >
                        <button
                          onClick={() => toggleDropdown(member.uid)}
                          className="p-2 hover:bg-secondary/20 rounded-full"
                        >
                          <img
                            src={VerticalDot}
                            alt="dot"
                            className="w-1"
                          />
                        </button>

                        {activeDropdown === member.uid && (
                          <div className="absolute right-0 mt-2 p-2 bg-white rounded-md shadow z-10">
                            <button
                              onClick={() => handleRemove(member.uid)}
                              className="block rounded-md w-full text-left px-3 py-2 text-sm hover:bg-hover text-cancel"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
};

export default MemberModal;