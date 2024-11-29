'use client'
import { AppSidebar } from "../components/common/Sidebar/Appsidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Card from "../components/common/Card/Card";
import Link from "next/link";

// import { useAuthState } from 'react-firebase-hooks/auth'
// import { auth } from '@/app/firebase/config'
// import { useRouter } from 'next/navigation';
// import { signOut } from 'firebase/auth'

export default function SidebarPage() {

  // const [user] = useAuthState(auth);
  // const router = useRouter()
  // const userSession = sessionStorage.getItem('user')
  return (
    <div>


      <div>
      <div className="text-xl sm:text-xl lg:text-5xl font-extrabold mb-6 text-center  text-blue-600 tracking-wide drop-shadow-md p-3 m-3 font-roboto">
      <h1>
  Customer Issue Tracker
</h1>


</div>

{/* <div className='text-black flex align-right justify-end m-10'>
        <button  onClick={() => {
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

         */}

        
        {/* 
<div className="text-black flex align-left justify-end m-5">
<h1 className="flex  justify-self-start">Todo</h1>

</div> */}


<div className="flex justify-end items-end fixed bottom-4 right-4">
  <Link href="/report" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
    View Report
  </Link>
</div>



      </div>


      <SidebarProvider>
        <AppSidebar />

        <SidebarTrigger />

        <Card />
      </SidebarProvider>

    </div>
  );
}
