import { PageProps } from "@/types";
import { Task } from "@/types/tasks";
import { usePage } from "@inertiajs/react";
import { AlertTriangle, CheckCircle, ClipboardList, Clock } from "lucide-react";

export default function Overview() {
  const { tasks: allTasks } = usePage<PageProps<{ tasks: Task[] }>>().props;

  const tasks = allTasks.filter((task) => task.status !== 'finished');

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
              <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
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
                {tasks.filter((t) => t.status === "ongoing").length}
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
                {tasks.filter((t) => t.priority === "urgent").length}
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
                {tasks.filter((t) => t.status === "completed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Tasks</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {tasks
            .filter((task) => task.status === "in-progress" || task.status === "pending")
            .slice(0, 5)
            .map((task) => (
              <div
                key={task.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">{task.type}</span>
                    {getStatusIcon(task.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{task.description.substring(0, 100)}...</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>📍 {task.location}</span>
                    <span>⏱️ {task.estimatedDuration}</span>
                    <span>👥 {task.assignedTo.length} assigned</span>
                    <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}