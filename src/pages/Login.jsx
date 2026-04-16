import { useState } from "react";
import { loginUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

import PorticonFull from "../assets/porticon-full-logo.svg";
import HiveplanLogo from "../assets/hiveplan-logo.svg";
import FyzyLogo from "../assets/fyzy-logo.svg";
import GoogleLogo from "../assets/google-logo.svg";

export default function Login() {

  const [email, setEmail] = useState("sinkandika@porticonn.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // login system
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError(""); // clear previous error
      
      await loginUser(email, password);
      navigate("/projects");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center bg-background h-screen">
      <main className="bg-white p-10 rounded-xl w-xl space-y-10 h-200 flex flex-col justify-between ">

        <div className="flex flex-col justify-center items-center">
          <img
          src={PorticonFull}
          alt="porticon-logo"
          className="w-60"
          />
            <p className="text-3xl text-primary font-medium pt-5" >Sign in</p>
            <p className="text-xl text-secondary">to enter the Porticonn</p>
        </div>

        <form
        className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col font-medium text-primary gap-2">
              <span>Email</span>
              <input
                placeholder="Email"
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
          </div>
          <div>
            {error && (
              <p className="text-error text-sm">
                {error}
              </p>
            )}
          </div>
        </form>
        <div className="flex justify-between items-center">
          <a 
          href="#"
          className="text-secondary hover:text-secondary-h transition duration-300"
          >
            Forgot your password?
          </a>
          <button 
          onClick={handleLogin}
          type="submit"
          className="bg-primary text-white py-3 rounded-md w-40 hover:bg-primary-h transition duration-300"
          >
            Sign in
          </button>
        </div>

        <div className="flex flex-col gap-y-10">
          <div className="flex items-center">
            <div className="grow border-t"></div>
            <span className="mx-8">Or sign in with</span>
            <div className="grow border-t"></div>
          </div>
          <div className="flex flex-row items-center space-x-5">
            <div className="h-14 flex flex-1 shadow-sm justify-center items-center hover:shadow-md transition duration-300">
              <img
              src={GoogleLogo}
              alt="google-logo"
              className="h-7"
              />
            </div>
            <div className="h-14 flex flex-1 shadow-sm justify-center items-center hover:shadow-md transition duration-300">
              <img
              src={HiveplanLogo}
              alt="hiveplan-logo"
              className="h-8.5"
              />
            </div>
            <div className="h-14 flex flex-1 shadow-sm justify-center items-center hover:shadow-md transition duration-300 ">
              <img 
              src={FyzyLogo} 
              alt="fyzy-logo"
              className="h-7"
              />
            </div>
          </div>
        </div>

        <div className="justify-center flex py-5">
          <Link to="/register"
          className="text-secondary hover:text-secondary-h transition duration-300 text-lg"
          >
          Create an account
          </Link>
        </div>

      </main>
    </div>
  );
}
