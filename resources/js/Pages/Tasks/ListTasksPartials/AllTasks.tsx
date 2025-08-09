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
    <>
      <DataTable
        columns={columns}
        data={tasks}
      />
    </>
  );
}