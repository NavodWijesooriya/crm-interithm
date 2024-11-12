
import {AppSidebar} from "../components/common/Sidebar/Appsidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Card from "../components/common/Card/Card";


export default function SidebarPage() {
  return (
    <div>
      
      * <SidebarProvider>
          <AppSidebar/>
          
            <SidebarTrigger />
          
            <Card/>
         </SidebarProvider> 
  
    </div>
  );
}
