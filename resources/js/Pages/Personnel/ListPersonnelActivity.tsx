import Authenticated from "@/Layouts/AuthenticatedLayout";
import { formatName } from "@/lib/utils";
import { PageProps, Personnel } from "@/types";
import { ActivityDetail } from "@/types/activities";
import { ReactElement, useState, useMemo } from "react";
import { Activity } from "./ActivityPartials/Activity";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PDFDownloadLink, usePDF } from "@react-pdf/renderer";
import { PersonnelActivityReport } from "@/Documents/PersonnelActivityReport";
import { Download } from "lucide-react";
import { usePage } from "@inertiajs/react";


type ListPersonnelActivityProps = PageProps<{
  personnel: Personnel & {
    activities: ActivityDetail[],
  },
}>;

export default function ListPersonnelActivity({ personnel }: ListPersonnelActivityProps) {
  const { user } = usePage().props.auth;
  const [selectedDate, setSelectedDate] = useState<string>("");

  const activities = personnel.activities.reduce<{
    [key: string]: ActivityDetail[],
  }>((acc, item) => {
    const dateKey = dayjs(item.created_at).format("YYYY-MM-DD");

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);

    return acc;
  }, {});

  // Get sorted array of available dates
  const availableDates = useMemo(() => {
    return Object.keys(activities).sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)
  }, [activities]);

  // Initialize PDF hook
  const [instance, updateInstance] = usePDF();

  // Generate PDF when button is clicked
  const handleGenerateReport = () => {
    if (selectedDate) {
      updateInstance(
        <PersonnelActivityReport
          personnel={personnel}
          creator={user}
          date={selectedDate}
        />
      );
    }
  };

  // Download PDF when ready
  useMemo(() => {
    if (instance.url && !instance.loading && selectedDate) {
      const link = document.createElement('a');
      link.href = instance.url;
      link.download = `personnel_${personnel.id}_activity_${selectedDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [instance.url, instance.loading, selectedDate, personnel.id]);

  return (
    <div className="mx-auto">
      <div className="px-6 py-4">
        <div className="px-6 py-4 border rounded-lg border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            <b>{formatName(personnel)}</b>'s Activity
          </h3>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Generate Report:</span>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map(date => (
                  <SelectItem key={date} value={date}>
                    {dayjs(date, "YYYY-MM-DD").format("MMM DD, YYYY")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerateReport}
              disabled={!selectedDate || instance.loading}
              className="bg-[#1B2560]"
            >
              <Download className="w-4 h-4 mr-2" />
              {instance.loading ? 'Generating...' : 'Generate PDF'}
            </Button>
          </div>
        </div>

        <div className="px-2 md:px-20 py-4">
          {Object.entries(activities).map(([date, details]) => (
            <div key={date} className="flex flex-col gap-2 mb-8">
              <div className="w-full flex items-center">
                <hr className="w-full text-gray-900 outline-1 outline-gray-900" />
                <span className="w-1/2 text-gray-700 text-center whitespace-nowrap px-4">
                  {dayjs(date, "YYYY-MM-DD").format("MMMM DD, YYYY")}
                </span>
                <hr className="w-full text-gray-900 outline-1 outline-gray-900" />
              </div>

              {details.map((activity, index) => (
                <Activity key={index} activity={activity} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ListPersonnelActivity.layout = (e: ReactElement<ListPersonnelActivityProps>) => {
  const { id } = e.props.personnel;

  return (
    <Authenticated
      children={e}
      pageTitle="Personnel Activity"
      breadcrumbEntries={[
        {
          value: 'Personnel Management',
          url: '/personnel',
        },
        {
          value: `Personnel (ID:${id})`,
          url: `/personnel/${id}`,
        },
        {
          value: 'Activity',
        },
    ]} />
  )
}