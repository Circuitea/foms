import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquipmentItemReport } from "@/Documents/EquipmentItemReport";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { getMonthName, toProperCase } from "@/lib/utils";
import { PageProps } from "@/types";
import { EquipmentGroup, EquipmentItem, EquipmentTransactionEntry } from "@/types/inventory";
import { Link, router, usePage } from "@inertiajs/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { table } from "console";
import dayjs from "dayjs";
import { Calendar, Clipboard, Info, MapPin, MoveLeft, Package } from "lucide-react";
import { useEffect, useState } from "react";

const columns: ColumnDef<EquipmentItem>[] = [
  {
    id: 'select-col',
    header: ({ table }) => (
      <Checkbox
        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() ? 'indeterminate' : false)}
        onCheckedChange={(checked) => {
          if (checked === 'indeterminate') return;
          const handler = table.getToggleAllRowsSelectedHandler();
          handler({ target: { checked } }); 
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        // className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => {
          if (checked === 'indeterminate') return;
          const handler = row.getToggleSelectedHandler();
          handler({ target: { checked } }); 
        }}
      />
    )
  },
  {
    accessorKey: 'name',
  },
  {
    id: 'task',
    accessorFn: () => '',
  },
    {
    accessorFn: () => 'Never',
    header: 'Last Used',
  },
]

export default function ShowEquipmentItem({
  item,
  start_date,
  end_date,
  months
}: PageProps<{
  item: EquipmentGroup & {
    items: (EquipmentItem & { entries: EquipmentTransactionEntry[], unfinished_tasks_count: number })[];
  };
  months: Record<number, number[]>; // year and months[]
  start_date: string;
  end_date: string;
}>) {
  const [selectedItems, setSelectedItems] = useState<RowSelectionState>({})
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);
  const { user } = usePage().props.auth;

  const monthOptions: {value: string, label: string}[] = [];
  
  Object.entries(months).forEach(([year, monthsInYear]) => monthsInYear.forEach(month => monthOptions.push({ value: `${year}-${String(month).padStart(2, '0')}`, label: `${getMonthName(month)} ${year}`})))


  useEffect(() => {
    console.log(item);
  }, []);

  const availableCount = item.items.reduce((total, equipment) => equipment.unfinished_tasks_count < 1 ? total + 1 : total, 0);
  const inUseCount = item.items.reduce((total, equipment) => equipment.unfinished_tasks_count >= 1 ? total + 1 : total, 0);

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/inventory">
              <MoveLeft />
              Back
            </Link>
          </Button>
          <Package className="w-6 h-6 text-[#1B2560]" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
            <p className="text-sm text-gray-600 capitalize">{item.type.name}</p>
          </div>
        </div>
        {/* <Button
          className="px-8 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
        >
          Edit Equipment
        </Button> */}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="flex-1 w-full h-80 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {!!item.image_path ? (
                <img src={`/storage/${item.image_path}`} />
              ) : (
                <div className="text-center flex flex-col justify-center items-center">
                  <div className="text-8xl mb-4">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-500">Equipment Image</div>
                </div>
              )}
            </div>
            <div className="flex-[3] flex flex-col">
              <div className="bg-blue-50 rounded-lg p-4 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Quantity & Availability
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{item.items.length}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{availableCount}</div>
                    <div className="text-sm text-gray-600">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{inUseCount}</div>
                    <div className="text-sm text-gray-600">In Use</div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-end">
              <div className="p-4 flex gap-2 items-baseline">
                <span>From</span>
                <Select value={startDate} onValueChange={setStartDate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>to</span>
                <Select value={endDate} onValueChange={setEndDate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.value < startDate}
                      >{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="bg-[#1B2560]" onClick={() => router.reload({ data: {start_date: startDate, end_date: endDate}, only: ['i'] })}>Apply</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-white p-4 shadow-lg rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clipboard className="w-5 h-5" />
                  Equipment List
                </h3>
                <DataTable
                  columns={columns}
                  data={item.items}
                  selectedRows={selectedItems}
                  setSelectedRows={setSelectedItems}
                  getRowId={(row) => row.id.toString()}
                />
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg h-full flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Equipment Item
                </h3>
                {Object.keys(selectedItems).length > 0
                  ? (
                    <div className="flex flex-col gap-2 h-full">
                      {Object.keys(selectedItems).map(itemID => {
                        const equipment_item = item.items.find(entry => entry.id === Number(itemID))
                        return (
                          <div className="bg-gray-50 p-2 rounded-lg shadow-lg">
                            <h3>{equipment_item?.name}</h3>
                            <div>
                              <span>Date of Acquisition: </span>
                              <span>{dayjs(equipment_item?.created_at).format('MMM DD, YYYY')}</span>
                            </div>
                          </div>
                        )}
                      )}
                      <div className="mt-auto flex justify-end">
                        <Button
                          className="bg-[#1B2560]"
                          asChild
                        >
                          <PDFDownloadLink fileName={`equipment_${item.id}_${dayjs(startDate, "YYYY-MM").format("YYYYMM")}-${dayjs(endDate, "YYYY-MM").format("YYYYMM")}`} document={<EquipmentItemReport group={item} selectedItems={Object.keys(selectedItems)} creator={user} />}>
                            Generate Report
                          </PDFDownloadLink>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment selected</h3>
                      <p className="mt-1 text-sm text-gray-500">Select an Equipment Item from the list.</p>
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          
        </div>
        
      </div>
    </>
  );
}

ShowEquipmentItem.layout = (e: JSX.Element) => <Authenticated pageTitle="Inventory Item" children={e} />