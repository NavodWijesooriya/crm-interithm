import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Card",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  return (
    <Sidebar className="h-screen bg-gray-900 text-black">
      <SidebarContent className="flex flex-col justify-between h-full">
       
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="p-10 text-3xl text-black">
   
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="m-2">
                {items.map((item) => (
                  <SidebarMenuItem className="gap-6" key={item.title}>
                    <SidebarMenuButton
                      className="text-xl gap-4 m-6 text-black hover:text-black transition"
                      asChild
                    >
                      <a href={item.url} className="flex items-center gap-4">
                        <item.icon className="text-gray-400" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="mb-6 flex justify-center">
          <button
            className="bg-red-500 text-white text-xl px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() => {
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
      </SidebarContent>
    </Sidebar>
  );
}
