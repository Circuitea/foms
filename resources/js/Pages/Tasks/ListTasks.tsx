import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { AlertTriangle, ClipboardList, FileText, Plus, Users } from "lucide-react";
import Overview from "./ListTasksPartials/Overview";
import { Link } from "@inertiajs/react";
import AllTasks from "./ListTasksPartials/AllTasks";
import PersonnelTab from "./ListTasksPartials/Personnel";

export default function ListTasks() {
  return (
    <div className="min-h-screen">
      <Tabs defaultValue="overview">

        {/* Sticky Header */}
        <div className="sticky top-0 z-50 shadow border-b border-gray-200" style={{ backgroundColor: "#1B2560" }}>
          {/* Main Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white bg-opacity-20">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">Task Management</h1>
                  <p className="text-sm text-gray-200">CDRRMO Operations Center</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Emergency Task
                </button>
                {/* <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Task
                </button> */}
                <Link
                  href="/tasks/new"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Task
                </Link>
              </div>
            </div>
          </div>
          
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

          {/* Navigation Tabs */}
          {/* <div className="border-t border-gray-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-8">
                {[
                  { id: "overview", label: "Overview", icon: ClipboardList },
                  { id: "all", label: "All Tasks", icon: FileText },
                  { id: "personnel", label: "Personnel", icon: Users },
                  { id: "templates", label: "Templates", icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-400 text-blue-300"
                        : "border-transparent text-gray-300 hover:text-white hover:border-gray-400"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div> */}
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

ListTasks.layout = (e: JSX.Element) => <Authenticated pageTitle="Tasks Management" children={e} />