import toast from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LocationHistoryReport } from "@/Documents/LocationHistoryReport";
import { cn, formatName } from "@/lib/utils";
import { Location, Personnel } from "@/types";
import { pdf, PDFDownloadLink, usePDF } from "@react-pdf/renderer";
import axios, { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { FileText, User, Users } from "lucide-react";
import { useState } from "react";

export type PersonnelWithLocationHistory = Personnel & {
  location_history: Location[];
}

export function GenerateLocationHistoryReportDialog() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [personnelList, setPersonnelList] = useState<PersonnelWithLocationHistory[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>([]);
  const [selectionDisabled, setSelectionDisabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);


  return (
    <Tooltip>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="w-8 h-8"
            >
              <FileText className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Generate Location History Report Form</DialogTitle>
            <DialogDescription>Select a date and the personnel to include their location history.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-[1fr_70%] gap-2">
            <div className="border-4 p-2 border-gray-200 rounded-lg">
              <Calendar
                required
                disabled={selectionDisabled}
                mode="single"
                selected={selectedDate}
                onSelect={(newDate) => {
                  const targetDate = dayjs(newDate).format('YYYY-MM-DD');
                  setSelectionDisabled(true);
                  axios.get<PersonnelWithLocationHistory[]>(`/api/location-history/people/${targetDate}`)
                    .then(res => {
                      if (res.status !== 200) {
                        throw new Error(`Error: ${res.status} (${res.statusText})`);
                      }
                      setPersonnelList(res.data)
                      setSelectedPersonnel([]);
                    })
                    .catch(error => {
                      toast('error', 'Error Fetching Location History', error);
                        return;
                    })
                    .finally(() => {
                      setSelectedDate(newDate);
                      setSelectionDisabled(false);
                    });
                }}
                className="w-full"
              />
            </div>
            <div>
              {personnelList.length > 0 ? (
                <div className="px-6">
                  <div className="overflow-y-auto h-96 space-y-2">
                    {personnelList.map((personnel, index) => (
                      <PersonnelSelection
                        key={index}
                        personnel={personnel}
                        selected={selectedPersonnel.includes(personnel.id)}
                        onClick={() => setSelectedPersonnel(ids =>
                          ids.includes(personnel.id)
                          ? ids.filter(id => id !== personnel.id)
                          : [...ids, personnel.id]
                        )}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Users className="w-20 h-20" />
                  <span>No personnel found.</span>
                  <span>Get started by selecting a date.</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            {selectedPersonnel.length > 0 && (
              <Button
                onClick={() => setDialogOpen(false)}
                asChild
              >
                <PDFDownloadLink document={<LocationHistoryReport date={selectedDate} personnel={personnelList.filter(person => selectedPersonnel.includes(person.id))} />} fileName={
                  `location-history-${dayjs(selectedDate).format('YYYY-MM-DD')}-ids-${[...selectedPersonnel].sort((a, b) => a - b).join('_')}`
                }>
                  {({ loading }) => loading 
                    ? 'Generating Report...'
                    : 'Download Report'
                    }
                </PDFDownloadLink>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TooltipContent>
        Generate Location History Report
      </TooltipContent>
    </Tooltip>
  )
}

function PersonnelSelection({ personnel, selected, onClick }: { personnel: PersonnelWithLocationHistory, selected: boolean, onClick: () => void }) {
  const sortedHistory = [...personnel.location_history].sort((a, b) => dayjs(a.created_at).diff(dayjs(b.created_at)))
  
  return (
    <div
      className={cn(
        "px-4 py-2 rounded-lg border shadow-xs flex justify-between items-baseline cursor-pointer",
        selected ? 'bg-blue-50 border-blue-400' : 'border-gray-200',
      )}
      onClick={onClick}
    >
      <span>{formatName(personnel)}</span>
      <span className="text-xs text-gray-500">{dayjs(sortedHistory[0].created_at).format('hh:mm A')} - {dayjs(sortedHistory[sortedHistory.length-1].created_at).format('hh:mm A')}</span>
    </div>
  );
}