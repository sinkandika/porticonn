import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

import PorticonFull from "../assets/porticon-full-logo.svg";

export default function Register () {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState("");

  // Register from authService.jsx
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password not match");
      return;
    }

    try {
      setError("");
      await registerUser(name, email, password);
      navigate("/registerSuccess");
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="flex justify-center items-center bg-background h-screen">
      <main className="bg-white p-10 rounded-xl w-xl h-200 flex flex-col">

        <div className="flex flex-col justify-center items-center gap-y-5">
          <img
          src={PorticonFull}
          alt="porticon-logo"
          className="w-60"
          />
          <p className="text-2xl text-primary font-medium">Create an new account</p>
        </div>


        <form
        className="flex flex-col flex-1 gap-5 justify-center pb-20"
        >
          <div className="flex flex-col gap-y-4">
            {error && (
              <p className="text-error text sm">
                {error}
              </p>
            )}
            <div className="flex flex-col font-medium text-primary gap-2">
              <span>Name</span>
              <input
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-brdr focus:ring-brdr-h p-2 text-primary rounded-md"
              />
            </div>
            <div className="flex flex-col font-medium text-primary gap-2">
              <span>Email</span>
              <input
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-brdr focus:ring-brdr-h p-2 text-primary rounded-md"
              />
            </div>
            <div className="flex flex-col font-medium text-primary gap-2">
              <span>Password</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-brdr focus:ring-brdr-h p-2 text-primary rounded-md"
              />
            </div>
            <div className="flex flex-col font-medium text-primary gap-2">
              <span>Confirm Password</span>
              <input
                type="password"
                placeholder="Re-enter your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-brdr focus:ring-brdr-h p-2 text-primary rounded-md"
              />
            </div>
          </div>
        </form>
        <div className="flex justify-between items-center">
          <Link to="/login"
          className="text-secondary hover:text-secondary-h transition duration-300 text-lg"
          >
          Sign in Instead
          </Link>
          <button
          onClick={handleRegister}
          type="submit"
          className="bg-primary text-white py-3 rounded-md w-40 hover:bg-primary-h transition duration-300"
          >
            Sign Up
          </button>
        </div>

      </main>
    </div>
  );
}
