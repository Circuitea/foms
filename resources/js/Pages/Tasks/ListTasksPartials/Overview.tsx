import { PageProps } from "@/types";
import { Task } from "@/types/tasks";
import { Link, usePage } from "@inertiajs/react";
import { AlertTriangle, CheckCircle, ClipboardList, Clock, Plus, XCircle } from "lucide-react";

export default function Overview() {
  const { tasks: allTasks } = usePage<PageProps<{ tasks: Task[] }>>().props;

  const tasks = allTasks.filter(task => !task.finished_at);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-700 text-white animate-pulse rounded-md"
      case "high":
        return "bg-red-600 text-white rounded-md"
      case "normal":
        return "bg-[#1B2560] text-white rounded-md"
      case "low":
        return "bg-gray-500 text-white rounded-md"
      default:
        return "bg-gray-500 text-white rounded-md"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "on-hold":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#1B2560" }}>
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{allTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#1B2560" }}>
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#1B2560" }}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter((t) => t.priority.name === "urgent").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#1B2560" }}>
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {allTasks.length - tasks.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Ongoing Tasks</h3>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency Task
            </button>
            <Link
              href="/tasks/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {tasks
            .map((task) => (
              <div
                key={task.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${getPriorityColor(task.priority.name)}`}>
                      {task.priority.name.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">{task.type.name}</span>
                    {!task.finished_at ? (
                      <Clock className="w-4 h-4 text-blue-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${!task.finished_at ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {!task.finished_at ? "Ongoing" : "Finished"}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{task.description.substring(0, 100)}...</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>📍 {task.location}</span>
                    <span>⏱️ {task.duration}</span>
                    <span>👥 {task.personnel.length} assigned</span>
                    <span>📅 Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}