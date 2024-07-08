import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useSession } from '@clerk/clerk-react';
import { useEffect } from "react";

export default function App() {
  const { session } = useSession();

  const getSessionToken = async () => {
    if (session) {
      const sessionToken = await session.getToken();
      console.log('Session Token:', sessionToken);
    }
  };

  useEffect(() => {
    getSessionToken();
  }, []);
  
  return (
    <header>
     
    </header>
  )
}