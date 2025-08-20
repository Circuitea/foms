import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { formatName } from "@/lib/utils";
import { PageProps, Personnel } from "@/types";
import { BookCheck, Briefcase, CircleCheck, CirclePlay, LogIn, LogOut, Pen, Send } from "lucide-react";
import { ReactElement } from "react";

type ListPersonnelActivityProps = PageProps<{
  personnel: Personnel,
}>;

export default function ListPersonnelActivity({ personnel }: ListPersonnelActivityProps) {
  return (
    <div className="px-6 py-4">
      <div className="px-6 py-4 border rounded-lg border-gray-200">
        <h3 className="text-lg font-medium text-gray-900"><b>{formatName(personnel)}</b>'s Activity</h3>
      </div>

      <div className="px-2 md:px-20 py-4">
        <div className="flex flex-col gap-2">
          <div className="w-full flex items-center">
            <hr className="w-full text-gray-900 outline-1 outline-gray-900" />
            <span className="w-1/2 text-gray-700 text-center">August 20, 2025</span>
            <hr className="w-full text-gray-900 outline-1 outline-gray-900" />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <LogOut className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Logged Out Mobile Application</h3>
                </div>
                <p className="text-sm text-gray-700">04:30PM</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Pen className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Changed Status from "OLD STATUS" to "NEW STATUS"</h3>
                </div>
                <p className="text-sm text-gray-700">04:30PM</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CircleCheck className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Finished Task "EXAMPLE TASK NAME"</h3>
                </div>
                <p className="text-sm text-gray-700">04:30PM</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CirclePlay className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Started Task "EXAMPLE TASK NAME"</h3>
                </div>
                <p className="text-sm text-gray-700">04:30PM</p>
              </div>
            </div>

            <div className="px-6 py-4 flex flex-col gap-2">
              <span>task id</span>
              <span>task name</span>
              <span>task due date</span>
            </div>

          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Logged In Mobile Application</h3>
                </div>
                <p className="text-sm text-gray-700">09:00AM</p>
              </div>
            </div>
          </div>

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