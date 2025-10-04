import Authenticated from "@/Layouts/AuthenticatedLayout";
import { AlertTriangle, CheckCheck, ClipboardList, FileText, Plus, Users } from "lucide-react";
import Overview from "./ListTasksPartials/Overview";
import { Link } from "@inertiajs/react";
import AllTasks from "./ListTasksPartials/AllTasks";
import PersonnelTab from "./ListTasksPartials/Personnel";
import { PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/tabs";

export default function ListTasks() {
  return (
    <div>
      <PageTabs defaultValue="overview">

        {/* Sticky Header */}
        <div className="sticky top-16 border-b border-gray-200 bg-[#1B2560]">
          {/* Main Header */}
          <PageTabsList>
            {[
              { id: "overview", label: "Overview", icon: ClipboardList },
              { id: "all", label: "All Tasks", icon: FileText },
              // { id: "templates", label: "Templates", icon: FileText },
            ].map((tab) => (
              <PageTabsTrigger key={tab.id} value={tab.id}><tab.icon className="w-4 h-4" /> {tab.label}</PageTabsTrigger>
            ))}
          </PageTabsList>
        </div>

        {/* Main Content */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "all" && renderAllTasks()}
          {activeTab === "personnel" && renderPersonnel()}
          {activeTab === "templates" && renderTemplates()}
        </div> */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageTabsContent value="overview">
            <Overview />
          </PageTabsContent>
          <PageTabsContent value="all">
            <AllTasks />
          </PageTabsContent>
          {/* <PageTabsContent value="templates">
            templates
          </PageTabsContent> */}
        </div>
      </PageTabs>
    </div>
  );
}

ListTasks.layout = (e: JSX.Element) => <Authenticated 
  PageIcon={CheckCheck}
  pageTitle="Tasks Management"
  children={e}
/>
