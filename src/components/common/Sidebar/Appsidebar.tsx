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
    <div className=" bg-black">
    <Sidebar className="h-screen ">
      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupLabel className="p-10 text-3xl"></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="m-2">
              {items.map((item) => (
                <SidebarMenuItem className="gap-6" key={item.title}>
                  <SidebarMenuButton className="text-xl gap-4 text m-6" asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex items-center justify-center h-full">
          <button
            className="text-black text-2xl px-4 py-2 rounded-lg hover:bg-gray-200 transition"
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
    </div>
  );
}
