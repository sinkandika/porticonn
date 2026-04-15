import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import SuccessIcon from "../assets/success-icon.svg";

export default function RegisterSuccess () {

  // auto redirected to login
  const [countdown, setCountdown] = useState(4);
  const navi = useNavigate();

  useEffect (() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown == 0) {
      navi("/login");
    }
  }, [countdown, navi]);

  return (
    <div className="bg-background h-screen flex justify-center p-20">
      <main className="bg-white p-10 rounded-xl w-2xl h-140 flex flex-col justify-between">

        <div className="flex flex-col items-center gap-y-8">
          <p className="font-bold text-2xl text-primary">SUCCESS!</p>
          <img
          src={SuccessIcon}
          alt="success-icon"
          className="w-35"
          />
          <p className="text-secondary text-xl w-70 text-center ">You have successfully created an account</p>
        </div>

        <div className="flex flex-col items-center gap-y-2">
          <p className="text-primary font-bold ">Redirected to login in {countdown} seconds</p>
          <p>
            {"Not redirected?"} {""}
            <Link to="/login"
            className="text-third hover:text-third-h transition duration-300 text-lg"
            >
            Back to login
            </Link>
          </p>
        </div>

      </main>
    </div>
  );
}