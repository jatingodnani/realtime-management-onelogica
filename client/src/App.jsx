import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TaskTable from "./components/TaskTable";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Charts from "./components/Charts";
import Home from "./components/Home";
import SignInPage from "./components/sign-in";
import SignUpPage from "./components/Signup";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<Charts />} />
          <Route path="/sign-in" element={<SignInPage />} />
        </Routes>
      </div>
      <motion.footer
        className="h-[60px] w-full border-t-2 shadow-md flex items-center justify-center bg-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0.5 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-gray-700 text-lg font-medium">
          Made with <span className="text-red-500">&hearts;</span> by Jatin
        </p>
      </motion.footer>
    </div>
  );
}
