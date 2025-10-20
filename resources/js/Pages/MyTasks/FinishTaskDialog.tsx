import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types/tasks";
import { router, usePage } from "@inertiajs/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function FinishTaskDialog({ task, onSubmit }: { task: Task, onSubmit: () => void }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  // useEffect(() => {
  //   setFiles([]);
  // }, [open])

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
              rows={5}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="py-4 space-y-2">
            <Label htmlFor="attachments" className="w-full flex justify-center items-center py-2 border-2 rounded-lg">
              <span>Add Image Attachment/s</span>
            </Label>
            <Input
              className="py-2"
              id="attachments"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const newFiles = e.target.files ? Array.from(e.target.files) : [];
                if (newFiles.length > 0) {
                  setFiles(prev => [...prev, ...newFiles]);
                }
              }}
              hidden
            />
            {files.map((file, index) => (
              <div className="p-2 flex items-center justify-between border border-gray-200 rounded-lg">
                <a className="text-[#1B2560] underline" href={URL.createObjectURL(file)} download>{file.name}</a>
                <Button
                  className="w-8 h-8"
                  variant="outline"
                  onClick={() => {
                    setFiles([
                      ...files.filter((_, i) => index !== i),
                    ]);
                  }}
                >
                  <X />
                </Button>
              </div>
            ))}
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
              onClick={() => {
              router.post(`/my-tasks/${task.id}/status`, {
                status: 'finished',
                additional_notes: notes,
                attachments: files,
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