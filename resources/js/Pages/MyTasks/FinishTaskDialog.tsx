import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TaskReport } from "@/Documents/TaskReport";
import { Task } from "@/types/tasks";
import { usePage } from "@inertiajs/react";
import { PDFDownloadLink, PDFViewer, usePDF } from "@react-pdf/renderer";
import { useEffect, useMemo, useState } from "react";

export function FinishTaskDialog({ task, onSubmit }: { task: Task, onSubmit: () => void }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [debouncedNotes, setDebouncedNotes] = useState('');
  const { user } = usePage().props.auth;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNotes(notes);
    }, 1000);

    return () => clearTimeout(handler);
  }, [notes]);

  const document = useMemo(
    () => <TaskReport task={task} user={user} notes={debouncedNotes} />,
    [task, user, debouncedNotes]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-center rounded bg-[#1B2560]"
        >
          Finish
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl h-full grid-rows-12">
        <DialogHeader className="">
          <DialogTitle>Finish Task?</DialogTitle>
          <DialogDescription>The following report will be generated for the completion of this task.</DialogDescription>
        </DialogHeader>
        <div className="row-span-11 grid grid-cols-[60%_40%] h-full relative top-0">
          <PDFViewer className="h-full w-full">
            {document}
          </PDFViewer>
          <div className="ml-4 space-y-4">
            <div className="px-6 py-4 space-y-2 bg-gray-50 border-gray-200 shadow-lg rounded-lg">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="px-6 py-4 bg-gray-50 border-gray-200 shadow-lg rounded-lg flex justify-end items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#1B2560]"
                onClick={() => onSubmit()}
                asChild
              >
                <PDFDownloadLink document={document}>
                  Submit Report and Finish Task
                </PDFDownloadLink>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}