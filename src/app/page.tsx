'use client'
import { AppSidebar } from "../components/common/Sidebar/Appsidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Card from "../components/common/Card/Card";
import { useAuthState } from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth'

export default function SidebarPage() {

  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user')
  return (
    <div>
       <div className='text-black flex align-right justify-end m-10'>
     <button onClick={() => {
    signOut(auth)
      .then(() => {
        sessionStorage.removeItem('user');
        router.push('/sign-in');
      })
      .catch((error) => {
        console.error('Error during sign out:', error);
      });
  }}
>
  Log out
</button>

   
     </div>


      <SidebarProvider>
        <AppSidebar />

        <SidebarTrigger />

        <Card />
      </SidebarProvider>

    </div>
  );
}
