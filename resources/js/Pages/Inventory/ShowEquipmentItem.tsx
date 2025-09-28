import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { toProperCase } from "@/lib/utils";
import { PageProps } from "@/types";
import { EquipmentGroup, EquipmentItem } from "@/types/inventory";
import { Link } from "@inertiajs/react";
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
  item
}: PageProps<{
  item: EquipmentGroup & {
    items: EquipmentItem[];
  };
}>) {
  const [selectedItems, setSelectedItems] = useState<RowSelectionState>({})

  useEffect(() => {
    console.log(item);
  }, []);

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
        <Button
          className="px-8 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
        >
          Edit Equipment
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
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
                <div className="text-2xl font-bold text-green-600">{-1}</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{-1}</div>
                <div className="text-sm text-gray-600">In Use</div>
              </div>
              
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
                      >
                        Generate Report
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
    </>
  );
}

ShowEquipmentItem.layout = (e: JSX.Element) => <Authenticated pageTitle="Inventory Item" children={e} />