import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TaskReport } from "@/Documents/TaskReport";
import { Task } from "@/types/tasks";
import { router, usePage } from "@inertiajs/react";
import { pdf, PDFDownloadLink, PDFViewer, usePDF } from "@react-pdf/renderer";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

export function FinishTaskDialog({ task, onSubmit }: { task: Task, onSubmit: () => void }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-center rounded bg-[#1B2560]"
        >
          Finish
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader className="">
          <DialogTitle>Finish Task?</DialogTitle>
          <DialogDescription>Additional notes can be included in the report.</DialogDescription>
        </DialogHeader>
        <div className="h-full relative top-0">
          <div className="py-4 space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              rows={10}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-[#1B2560]"
            onClick={() => {
              router.post(`/my-tasks/${task.id}/status`, {
                status: 'finished',
                additional_notes: notes,
              });
            }}
          >
            Submit Report and Finish Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}