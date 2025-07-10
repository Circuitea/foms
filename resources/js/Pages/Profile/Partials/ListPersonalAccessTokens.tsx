import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageProps } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Key, Lock, XCircle } from "lucide-react";
import { useState } from "react";

interface PersonalAccessToken {
  id: number,
  name: number,
  last_used_at: string,
  created_at: string,
}

const columns: ColumnDef<PersonalAccessToken>[] = [
  {
    accessorKey: 'name',
    header: 'Device Name',
  },
  {
    accessorKey: 'last_used_at',
    header: 'Last Used',
    cell: ({ row }) => <span>{row.getValue('last_used_at') ? dayjs(row.getValue('last_used_at')).format('YYYY-MM-DD HH:mm') : 'Never'}</span>
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => <span>{dayjs(row.getValue('created_at')).format('YYYY-MM-DD HH:mm')}</span>
  },
  {
    id: 'revoke',
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);

      return (
        <Dialog open={open} onOpenChange={setOpen} modal>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <XCircle />       
              Revoke
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke Token?</DialogTitle>
              <DialogDescription>Confirm Personal Access Token Deletion?</DialogDescription>
            </DialogHeader>
            <p>Are you sure you want to revoke   this Personal Access Token?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="destructive" asChild>
                <Link href={`/profile/token/${row.original.id}`} method="delete">Confirm</Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
  }
];

export default function ListPersonalAccessTokens() {
  const { tokens } = usePage<PageProps<{ tokens: PersonalAccessToken[] }>>().props;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 bg-green-50/30 border border-green-100 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <Key className="w-4 h-4 text-green-600" />
          <div>
            <h1 className="text-lg font-medium text-green-900">Personal Access Tokens</h1>
            <p className="text-green-700/70 text-sm">
              List and Revoke Access Tokens used by the Mobile Application
            </p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tokens}
        noData={<span>No Access Tokens Found</span>}
      />
    </div>
  );

}