import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
function Header() {
  const { user } = useUser();
 
  return (
    <nav className='h-[70px] w-screen border-b-2 shadow-md flex items-center justify-between px-10 bg-white'>
      <Logo />
      <div className='flex items-center space-x-6'>
        {user ? (
          <>
           <Link to="/" className='text-lg font-medium text-gray-700 hover:text-blue-500 transition-colors duration-300'>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
             Dashboard
            </motion.div>
            </Link>
            <Link to="/chart" className='text-lg font-medium text-gray-700 hover:text-blue-500 transition-colors duration-300'>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              Charts
            </motion.div>
            </Link>
          </>
        ):<Link to="https://github.com/jatingodnani">
        <FaGithub size={30}/>
        </Link>}
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}

function Logo() {
  return (
    <motion.div 
      className='flex items-center justify-center'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className='font-bold leading-8 text-[25px] tracking-wider text-blue-600'>TaskTracker</h1>
    </motion.div>
  )
}

export default Header;
