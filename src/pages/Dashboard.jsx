import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };
  
  return (
  <div>
    <h1>Hello, {user.displayName}</h1>
    <button onClick={handleLogout}>
      Logout
    </button>
  </div>
  );
}
