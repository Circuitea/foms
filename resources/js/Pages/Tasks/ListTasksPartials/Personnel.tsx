import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { formatName, toProperCase } from "@/lib/utils";
import { PageProps, Personnel } from "@/types";
import { Task } from "@/types/tasks";
import { usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";

type PersonnelWithTasks = Personnel & {
  assigned_tasks: Task[],
}

const columns: ColumnDef<PersonnelWithTasks>[] = [
  {
    accessorFn: personnel => formatName(personnel),
    header: 'Name',
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        {row.original.roles.map(role => (
          <span>{role.label}</span>
        ))}
      </div>
    )
  },
  {
    accessorKey: 'sections',
    header: 'Sections',
  },
  {
    id: 'contact',
    header: 'contact',
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        <span>{row.original.email}</span>
        <span>{row.original.mobile_number}</span>
      </div>
    )
  },
  {
    accessorKey: 'assigned_tasks',
    header: 'Tasks',
    cell: ({ row }) => (
      <div className="flex flex-col gap-2">
        {row.original.assigned_tasks.map(task => (
          <span>{task.title}</span>
        ))}
      </div>
    )
  },
  {
    id: 'actions',
    cell: () => (
      <div className="flex gap-2">
        <Button variant="outline">
          Assign Task
        </Button>
      </div>
    ),
  },

]

export default function PersonnelTab() {
  const { personnel } = usePage<PageProps<{
    personnel: PersonnelWithTasks[],
  }>>().props;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Personnel Management</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        {/* <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Tasks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {personnel.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatName(person)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">SECTION</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">CONTACT</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      person.status === "available"
                        ? "bg-green-100 text-green-800"
                        : person.status === "busy"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {person.status}
                  </span>
                  STATUS
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">TASKS</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                   <button onClick={() => handleAssignTask(person)} className="text-blue-600 hover:text-blue-900 mr-3">
                    Assign Task
                  </button>
                  <button
                    onClick={() => handleEditPersonnel(person)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleRemovePersonnel(person)} className="text-red-600 hover:text-red-900">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
        <DataTable
          columns={columns}
          data={personnel}
        />
      </div>
    </div>
  );
}