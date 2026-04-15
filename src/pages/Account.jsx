import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserData } from "../services/accountService";
import defaultPic from "../assets/default-profile.svg";
import EditPhotoModal from "../components/modal/EditPhotoModal";
import EditIcon from "../assets/edit-icon.svg";

const Account = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  // edit image
  const [showEditPhoto, setShowEditPhoto] = useState(false);

  // fetch users data
  useEffect (() => {
    const fetchUser = async () => {
      if (!user?.uid) return; // uid from users database uid: AGTt4NDHSiUQa22EWsutIZf2jy93 (string)

      try {
        const data = await getUserData(user.uid);
        setUserData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [user]);

  if (!userData) return <p>Loading data....</p>

  return (
    <div className="flex justify-center h-screen bg-background px-3 py-4">
      <div className="font-medium text-primary bg-white w-300 h-200 rounded-md p-8 gap-y-10 flex flex-col">
        <p className="text-2xl">Account Settings</p>
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-center lg:gap-x-10 gap-x-0">
          <div className="relative w-fit">
            <button
            onClick={() => setShowEditPhoto(true)}
            className="bg-white p-2 rounded-full shadow absolute bottom-0 right-1 hover:shadow-md"
            >
              <img
              src={EditIcon}
              alt="edt"
              className="w-4"
              />
            </button>
            <img
            src={userData.photoURL || defaultPic}
            alt="profile"
            className="w-30 h-30 rounded-full"
            />
          </div>
          <div className="flex gap-x-2">
            <p className="text-secondary">User ID:</p>
            <p>{userData.uid}</p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 items-center lg:gap-x-10 gap-x-0">
          <div className="flex flex-col w-full">
            <p className="text-secondary">Full Name</p>
            <p className="border border-brdr p-3 rounded-md">
              {userData.name}
            </p>
          </div>
          <div className="flex flex-col w-full">
            <p className="text-secondary">Email</p>
            <p className="border border-brdr p-3 rounded-md">
              {userData.email}
            </p>
          </div>
        </div>
      </div>
      {showEditPhoto && (
        <EditPhotoModal 
        user={user}
        onclose={() => setShowEditPhoto(false)}
        onSuccess={(newUrl) => 
          setUserData((prev) => ({
            ...prev,
            photoURL: newUrl,
          }))
        }
        />
      )}
    </div>
  );
};
export default Account;