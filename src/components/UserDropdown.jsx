import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useEffect, useRef, useState } from "react";
import { logoutUser } from "../services/authService";
import defaultPic from "../assets/default-profile.svg";
import { subscribeUserData } from "../services/accountService";

const UserDropdown = () => {

  const { user } = useAuth();
  const navigate = useNavigate();

  // open close
  const [open, setOpen] = useState(false);

  const [userData, setUserData] = useState(null);
  const dropClose = useRef(null);

  // fetch users firestore (not from auth)
  useEffect (() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeUserData(user.uid, setUserData);

    return () => unsubscribe();
  }, [user]);

  // dropdown
  const toggleDropdown = () => {
    setOpen(!open);
  };

  // dropdown auto close
	useEffect (() => {
		const handleClickOutside = (event) => {
			if (dropClose.current && !dropClose.current.contains(event.target)) {
				setOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [open]);

  // account
	const handleAccount = () => {
		navigate("/account");
    setOpen(false); // close dropdown after click
	}

  // logout
  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate("/login");
    } catch (err){
      alert(err.message);
    }
  };

  return (
    <div 
    ref={dropClose}
    className="relative"
    >
      {/* Avatar */}
      <img
        src={userData?.photoURL || defaultPic}
        alt="profile"
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full cursor-pointer object-cover shadow"
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 bg-white rounded-md shadow z-50 w-35 p-2">
          
          <button 
          onClick={handleAccount}
          className="block p-3 rounded-md hover:bg-hover w-full text-left"
          >
            Account
          </button>

          <button 
          className="block p-3 w-full opacity-50 text-left"
          disabled
          >
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="block p-3 rounded-md hover:bg-hover w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;