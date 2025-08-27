import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { AlertTriangle, CheckCheck, ClipboardList, FileText, Plus, Users } from "lucide-react";
import Overview from "./ListTasksPartials/Overview";
import { Link } from "@inertiajs/react";
import AllTasks from "./ListTasksPartials/AllTasks";
import PersonnelTab from "./ListTasksPartials/Personnel";

export default function ListTasks() {
  return (
    <div>
      <Tabs defaultValue="overview">

        {/* Sticky Header */}
        <div className="sticky top-16 border-b border-gray-200 bg-[#1B2560]">
          {/* Main Header */}
          <TabsList>
            {[
              { id: "overview", label: "Overview", icon: ClipboardList },
              { id: "all", label: "All Tasks", icon: FileText },
              { id: "personnel", label: "Personnel", icon: Users },
              // { id: "templates", label: "Templates", icon: FileText },
            ].map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}><tab.icon className="w-4 h-4" /> {tab.label}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Main Content */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "all" && renderAllTasks()}
          {activeTab === "personnel" && renderPersonnel()}
          {activeTab === "templates" && renderTemplates()}
        </div> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TabsContent value="overview">
            <Overview />
          </TabsContent>
          <TabsContent value="all">
            <AllTasks />
          </TabsContent>
          <TabsContent value="personnel">
            <PersonnelTab />
          </TabsContent>
          <TabsContent value="templates">
            templates
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

ListTasks.layout = (e: JSX.Element) => <Authenticated 
  PageIcon={CheckCheck}
  pageTitle="Tasks Management"
  children={e}
/>