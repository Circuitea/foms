import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { toProperCase } from "@/lib/utils";
import { PageProps } from "@/types";
import { Task } from "@/types/tasks";
import { usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: 'Task',
  },
  {
    accessorKey: 'type.name',
    header: 'Type',
  },
  {
    accessorKey: 'priority.name',
    header: 'Priority'
  },
  {
    accessorFn: task => toProperCase(task.status),
    header: 'Status',
  },
  {
    accessorFn: (task) => dayjs(task.due_date).format('MMM DD, YYYY HH:mm'),
    header: 'Due Date',    
  },
  {
    id: 'details',
    header: '',
    cell: ({ row }) => (
      <Button variant="outline">Details</Button>
    ),
  },
];

export default function AllTasks() {
  const { tasks } = usePage<PageProps<{ tasks: Task[] }>>().props;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Tasks List</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={tasks}
        />
      </div>
    </div>
  );
}