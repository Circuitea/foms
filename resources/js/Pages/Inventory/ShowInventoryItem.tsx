import { Button } from "@/components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import Item, { ItemCondition } from "@/types/inventory";
import { Link } from "@inertiajs/react";
import { Calendar, MapPin, MoveLeft, Package } from "lucide-react";
import { useEffect } from "react";



export default function ShowInventoryItem({
  item
}: PageProps<{
  item: Item & {
    conditions: ItemCondition[],
  },
}>) {

  useEffect(() => {
    console.log(item);
  }, [])

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
          onClick={() => {
            // setEditingItem(item)
            // setShowDetailModal(false)
            // setShowEditModal(true)
          }}
          className="px-8 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
        >
          Edit Equipment
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="w-full h-80 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-8xl mb-4">
                  {/* {item.category === "safety" && item.name.toLowerCase().includes("vest")
                    ? "🦺"
                    : item.category === "rescue" && item.name.toLowerCase().includes("helmet")
                      ? "⛑️"
                      : item.category === "medical"
                        ? "🏥"
                        : item.category === "tools"
                          ? "🔧"
                          : item.category === "shelter"
                            ? "🏠"
                            : item.category === "logistics"
                              ? "⚙️"
                              : "📦"} */}
                  <Package className="w-6 h-6" />
                </div>
                <div className="text-sm text-gray-500">Equipment Image</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700">Item Code</label>
                  <p className="text-sm text-gray-900 font-mono">CODE</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                  <p className="text-sm text-gray-900 font-mono">SERIAL NUMBER</p>
                </div> */}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Used</label>
                  <p className="text-sm text-gray-900">LAST USED</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{item.description  }</p>
              </div>
              {/* {item.notes && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900">{item.notes}</p>
                </div>
              )} */}
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Quantity & Availability
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{item.conditions.reduce((total, condition) => total += condition.amount, 0)}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{item.conditions.find(condition => condition.name === 'available')?.amount}</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{item.conditions.find(condition => condition.name === 'deployed')?.amount}</div>
                  <div className="text-sm text-gray-600">In Use</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{item.conditions.find(condition => condition.name === 'in_maintenance')?.amount}</div>
                  <div className="text-sm text-gray-600">Maintenance</div>
                </div>
              </div>
            </div>

            {/* <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Inspection Schedule
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Inspection</label>
                  <p className="text-sm text-gray-900">LAST INSPECTION</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Next Inspection</label>
                  <p className="text-sm text-gray-900">NEXT INSPECTION</p>
                </div>
              </div>
            </div> */}

            {/* {item.maintenanceHistory && item.maintenanceHistory.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Maintenance History
                </h3>
                <div className="space-y-3">
                  {item.maintenanceHistory.map((record, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{record.type}</p>
                          <p className="text-sm text-gray-600">{record.description}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <User className="w-3 h-3" />
                            {record.technician}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">{record.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* {item.deploymentHistory && item.deploymentHistory.length > 0 && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Deployment History
                </h3>
                <div className="space-y-3">
                  {item.deploymentHistory.map((record, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{record.user}</p>
                          <p className="text-sm text-gray-600">{record.purpose}</p>
                          <p className="text-xs text-gray-500">Deployed: {record.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

ShowInventoryItem.layout = (e: JSX.Element) => <Authenticated pageTitle="Inventory Item" children={e} />