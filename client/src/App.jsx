import { SignedIn, SignedOut, SignIn, SignInButton, SignUp, UserButton } from "@clerk/clerk-react";
import { useSession } from '@clerk/clerk-react';
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


export default function App() {

  
  return (
   <div className="w-screen h-screen" >
    <Header/>
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/chart" element={<Charts/>}/>
    <Route path="/sign-in" element={<SignInPage/>}/>
    </Routes>
     
    </div>

  )
}