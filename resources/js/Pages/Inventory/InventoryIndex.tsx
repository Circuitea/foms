"use client"

import { useState, useEffect, ReactElement } from "react"
import {
  Search,
  Package,
  CheckCircle,
  Filter,
  Calendar,
  MapPin,
  User,
  Wrench,
  History,
  Check,
  X,
} from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type React from "react"
import { PageProps } from "@/types"
import { Link } from "@inertiajs/react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { ItemEntry, ItemType } from "@/types/inventory"
import { cn, userHasPermission } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import AddItemForm from "./Partials/AddItemForm"
import { useRealTimeClock } from "@/hooks/use-clock"

// Success notification component
interface SuccessNotificationProps {
  show: boolean
  message: string
  onClose: () => void
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ show, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 1000) // Auto-close after 1 second
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
      <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Operation Successful</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
          <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "Excellent":
      return "bg-green-100 text-green-800"
    case "Good":
      return "bg-blue-100 text-blue-800"
    case "Fair":
      return "bg-yellow-100 text-yellow-800"
    case "Poor":
      return "bg-red-100 text-red-800"
    case "Unserviceable":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const columns: ColumnDef<ItemEntry>[] = [
  {
    accessorKey: 'name',
    header: 'EQUIPMENT',
    cell: (({ row }) => (
      <div>
        <div className="text-sm font-medium text-gray-900">{row.getValue('name')}</div>
        <div className="text-sm text-gray-500">{row.original.description}</div>
      </div>
    ))
  },
  {
    id: 'status',
    header: 'STATUS',
    accessorFn: () => 10,
    cell: (({ row }) => (
      <div className="flex items-center">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <span className="ml-2 text-sm text-gray-900">
          {row.original.conditions.find(condition => condition.name === 'available')?.amount}/{row.original.conditions.reduce((total, condition) => total + condition.amount, 0)} Available
        </span>
      </div>
    ))
  },
  {
    id: 'conditions',
    header: 'QUANTITY',
    cell: (({ row }) => (
      <div className="text-sm text-gray-900">
        <div>Total: {row.original.conditions.reduce((total, condition) => total + condition.amount, 0)}</div>
        <div className="text-xs text-gray-500 flex gap-2">
          {row.original.conditions.map(condition => `${condition.label}: ${condition.amount}`).join(' | ')}
        </div>
      </div>
    ))
  },
  {
    id: 'condition',
    header: 'CONDITION',
    cell: (({ row }) => (
      <div className="space-x-1">
        {row.original.conditions.filter(condition => condition.amount > 0).map((condition) => (
          <span className={cn(
            'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
            getConditionColor(condition.name)
          )}>
            {condition.label}
          </span>
        ))}
      </div>
    ))
  },
  {
    id: 'location',
    header: 'LOCATION',
    accessorFn: () => 'Storage Room A',
  },
  {
    id: 'details',
    cell: ({ row }) => (
      <Button variant="outline" asChild>
        <Link href={`/inventory/item/${row.original.id}`}>
          Details
        </Link>
      </Button>
    )
  },
];

type IndexItemType = ItemType & {items_count: number}

export default function InventoryIndex({ types, items, totalCount }: PageProps<{ types: IndexItemType[], items: ItemEntry[], totalCount: number }>) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCondition, setFilterCondition] = useState<string>("all")
  const currentTime = useRealTimeClock()

  // const renderDetailModal = () => {
  //   if (!showDetailModal || !selectedItem) return null

  //   const itemCode = generateItemCode(
  //     selectedItem.category,
  //     equipmentList
  //       .filter((item) => item.category === selectedItem.category)
  //       .findIndex((item) => item.id === selectedItem.id),
  //   )

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  //       <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
  //           <div className="flex items-center gap-3">
  //             <Package className="w-6 h-6 text-[#1B2560]" />
  //             <div>
  //               <h2 className="text-xl font-semibold text-gray-900">{selectedItem.name}</h2>
  //               <p className="text-sm text-gray-600 capitalize">{selectedItem.category} Equipment</p>
  //             </div>
  //           </div>
  //           <button onClick={handleCloseDetailModal} className="text-gray-400 hover:text-gray-600 transition-colors">
  //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //           </button>
  //         </div>

  //         <div className="flex-1 overflow-y-auto p-6">
  //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  //             <div className="lg:col-span-1">
  //               <div className="w-full h-80 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
  //                 <div className="text-center">
  //                   <div className="text-8xl mb-4">
  //                     {selectedItem.category === "safety" && selectedItem.name.toLowerCase().includes("vest")
  //                       ? "🦺"
  //                       : selectedItem.category === "rescue" && selectedItem.name.toLowerCase().includes("helmet")
  //                         ? "⛑️"
  //                         : selectedItem.category === "medical"
  //                           ? "🏥"
  //                           : selectedItem.category === "tools"
  //                             ? "🔧"
  //                             : selectedItem.category === "shelter"
  //                               ? "🏠"
  //                               : selectedItem.category === "logistics"
  //                                 ? "⚙️"
  //                                 : "📦"}
  //                   </div>
  //                   <div className="text-sm text-gray-500">Equipment Image</div>
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="lg:col-span-2 space-y-6">
  //               <div className="bg-gray-50 rounded-lg p-6">
  //                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
  //                   <Package className="w-5 h-5" />
  //                   Basic Information
  //                 </h3>
  //                 <div className="grid grid-cols-2 gap-4">
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700">Item Code</label>
  //                     <p className="text-sm text-gray-900 font-mono">{itemCode}</p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700">Serial Number</label>
  //                     <p className="text-sm text-gray-900 font-mono">{selectedItem.serialNumber || "N/A"}</p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700">Category</label>
  //                     <p className="text-sm text-gray-900 capitalize">{selectedItem.category}</p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700">Condition</label>
  //                     <span
  //                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(
  //                         selectedItem.condition,
  //                       )}`}
  //                     >
  //                       {selectedItem.condition}
  //                     </span>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700">Location</label>
  //                     <p className="text-sm text-gray-900 flex items-center gap-1">
  //                       <MapPin className="w-4 h-4" />
  //                       {selectedItem.location}
  //                     </p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700">Last Used</label>
  //                     <p className="text-sm text-gray-900">{selectedItem.lastUsed || "Never"}</p>
  //                   </div>
  //                 </div>
  //                 <div className="mt-4">
  //                   <label className="block text-sm font-medium text-gray-700">Description</label>
  //                   <p className="text-sm text-gray-900">{selectedItem.description}</p>
  //                 </div>
  //                 {selectedItem.notes && (
  //                   <div className="mt-4">
  //                     <label className="block text-sm font-medium text-gray-700">Notes</label>
  //                     <p className="text-sm text-gray-900">{selectedItem.notes}</p>
  //                   </div>
  //                 )}
  //               </div>

  //               <div className="bg-blue-50 rounded-lg p-6">
  //                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
  //                   <Package className="w-5 h-5" />
  //                   Quantity & Availability
  //                 </h3>
  //                 <div className="grid grid-cols-4 gap-4">
  //                   <div className="text-center">
  //                     <div className="text-2xl font-bold text-blue-600">{selectedItem.quantity}</div>
  //                     <div className="text-sm text-gray-600">Total</div>
  //                   </div>
  //                   <div className="text-center">
  //                     <div className="text-2xl font-bold text-green-600">{selectedItem.available}</div>
  //                     <div className="text-sm text-gray-600">Available</div>
  //                   </div>
  //                   <div className="text-center">
  //                     <div className="text-2xl font-bold text-orange-600">{selectedItem.inUse}</div>
  //                     <div className="text-sm text-gray-600">In Use</div>
  //                   </div>
  //                   <div className="text-center">
  //                     <div className="text-2xl font-bold text-red-600">{selectedItem.maintenance}</div>
  //                     <div className="text-sm text-gray-600">Maintenance</div>
  //                   </div>
  //                 </div>
  //               </div>

  //               <div className="bg-yellow-50 rounded-lg p-6">
  //                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
  //                   <Calendar className="w-5 h-5" />
  //                   Inspection Schedule
  //                 </h3>
  //                 <div className="grid grid-cols-2 gap-4">
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700">Last Inspection</label>
  //                     <p className="text-sm text-gray-900">{selectedItem.lastInspection}</p>
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700">Next Inspection</label>
  //                     <p className="text-sm text-gray-900">{selectedItem.nextInspection}</p>
  //                   </div>
  //                 </div>
  //               </div>

  //               {selectedItem.maintenanceHistory && selectedItem.maintenanceHistory.length > 0 && (
  //                 <div className="bg-gray-50 rounded-lg p-6">
  //                   <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
  //                     <Wrench className="w-5 h-5" />
  //                     Maintenance History
  //                   </h3>
  //                   <div className="space-y-3">
  //                     {selectedItem.maintenanceHistory.map((record, index) => (
  //                       <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
  //                         <div className="flex justify-between items-start">
  //                           <div>
  //                             <p className="font-medium text-gray-900">{record.type}</p>
  //                             <p className="text-sm text-gray-600">{record.description}</p>
  //                             <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
  //                               <User className="w-3 h-3" />
  //                               {record.technician}
  //                             </p>
  //                           </div>
  //                           <span className="text-sm text-gray-500">{record.date}</span>
  //                         </div>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}

  //               {selectedItem.deploymentHistory && selectedItem.deploymentHistory.length > 0 && (
  //                 <div className="bg-green-50 rounded-lg p-6">
  //                   <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
  //                     <History className="w-5 h-5" />
  //                     Deployment History
  //                   </h3>
  //                   <div className="space-y-3">
  //                     {selectedItem.deploymentHistory.map((record, index) => (
  //                       <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
  //                         <div className="flex justify-between items-start">
  //                           <div>
  //                             <p className="font-medium text-gray-900">{record.user}</p>
  //                             <p className="text-sm text-gray-600">{record.purpose}</p>
  //                             <p className="text-xs text-gray-500">Deployed: {record.date}</p>
  //                           </div>
  //                         </div>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
  //           <button
  //             onClick={handleCloseDetailModal}
  //             className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
  //           >
  //             Close
  //           </button>
  //           <button
  //             onClick={() => {
  //               setEditingItem(selectedItem)
  //               setShowDetailModal(false)
  //               setShowEditModal(true)
  //             }}
  //             className="px-8 py-3 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
  //           >
  //             Edit Equipment
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderEditModal = () => {
  //   if (!showEditModal || !editingItem) return null

  //   const itemCode = generateItemCode(
  //     editingItem.category,
  //     equipmentList
  //       .filter((item) => item.category === editingItem.category)
  //       .findIndex((item) => item.id === editingItem.id),
  //   )

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  //       <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
  //           <div className="flex items-center gap-3">
  //             <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
  //               <span className="text-orange-600">📦</span>
  //             </div>
  //             <span className="text-lg font-semibold text-gray-900">Edit Equipment</span>
  //           </div>
  //           <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-gray-600 transition-colors">
  //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //           </button>
  //         </div>

  //         <div className="flex-1 overflow-y-auto p-6">
  //           <div className="flex gap-8">
  //             <div className="w-96 flex-shrink-0">
  //               <div className="w-full h-80 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
  //                 <div className="text-center">
  //                   <div className="text-8xl mb-4">
  //                     {editingItem.category === "safety" && editingItem.name.toLowerCase().includes("vest")
  //                       ? "🦺"
  //                       : editingItem.category === "rescue" && editingItem.name.toLowerCase().includes("helmet")
  //                         ? "⛑️"
  //                         : editingItem.category === "medical"
  //                           ? "🏥"
  //                           : editingItem.category === "tools"
  //                             ? "🔧"
  //                             : editingItem.category === "shelter"
  //                               ? "🏠"
  //                               : editingItem.category === "logistics"
  //                                 ? "⚙️"
  //                                 : "📦"}
  //                   </div>
  //                   <div className="text-sm text-gray-500 font-medium">Equipment Image</div>
  //                 </div>
  //               </div>

  //               <div className="mt-6 space-y-3">
  //                 <button
  //                   onClick={() => setShowMaintenanceModal(true)}
  //                   className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-between group"
  //                 >
  //                   <div className="flex items-center gap-3">
  //                     <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
  //                       <Wrench className="w-5 h-5 text-blue-600" />
  //                     </div>
  //                     <div className="text-left">
  //                       <div className="font-medium text-gray-900">Maintenance History</div>
  //                       <div className="text-sm text-gray-600">
  //                         {editingItem.maintenanceHistory?.length || 0} records
  //                       </div>
  //                     </div>
  //                   </div>
  //                   <svg
  //                     className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
  //                     fill="none"
  //                     stroke="currentColor"
  //                     viewBox="0 0 24 24"
  //                   >
  //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  //                   </svg>
  //                 </button>

  //                 <button
  //                   onClick={() => setShowDeploymentModal(true)}
  //                   className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-between group"
  //                 >
  //                   <div className="flex items-center gap-3">
  //                     <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
  //                       <History className="w-5 h-5 text-green-600" />
  //                     </div>
  //                     <div className="text-left">
  //                       <div className="font-medium text-gray-900">Deployment History</div>
  //                       <div className="text-sm text-gray-600">
  //                         {editingItem.deploymentHistory?.length || 0} records
  //                       </div>
  //                     </div>
  //                   </div>
  //                   <svg
  //                     className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
  //                     fill="none"
  //                     stroke="currentColor"
  //                     viewBox="0 0 24 24"
  //                   >
  //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  //                   </svg>
  //                 </button>
  //               </div>
  //             </div>

  //             <div className="flex-1 space-y-6">
  //               <div className="bg-gray-50 rounded-lg p-6">
  //                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
  //                 <div className="grid grid-cols-3 gap-6">
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-2">Item name:</label>
  //                     <input
  //                       type="text"
  //                       value={editingItem.name}
  //                       onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
  //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
  //                     />
  //                   </div>

  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-2">Item code:</label>
  //                     <input
  //                       type="text"
  //                       value={itemCode}
  //                       readOnly
  //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-base"
  //                     />
  //                   </div>

  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
  //                     <input
  //                       type="number"
  //                       value={editingItem.quantity.toString()}
  //                       onChange={(e) => {
  //                         const inputValue = e.target.value
  //                         if (inputValue === "") {
  //                           setEditingItem({
  //                             ...editingItem,
  //                             quantity: 0,
  //                             available: 0,
  //                             condition: getAutomaticCondition(0, editingItem.thresholds!),
  //                           })
  //                           return
  //                         }

  //                         const newQuantity = Number.parseInt(inputValue, 10)
  //                         if (!isNaN(newQuantity) && newQuantity >= 0) {
  //                           const newCondition = getAutomaticCondition(newQuantity, editingItem.thresholds!)
  //                           const newAvailable = Math.max(0, newQuantity - editingItem.inUse - editingItem.maintenance)
  //                           setEditingItem({
  //                             ...editingItem,
  //                             quantity: newQuantity,
  //                             available: newAvailable,
  //                             condition: newCondition,
  //                           })
  //                         }
  //                       }}
  //                       min="0"
  //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
  //                     />
  //                   </div>
  //                 </div>

  //                 <div className="grid grid-cols-2 gap-6 mt-4">
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-2">Condition:</label>
  //                     <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-between">
  //                       <span
  //                         className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getConditionColor(
  //                           editingItem.condition,
  //                         )}`}
  //                       >
  //                         {editingItem.condition}
  //                       </span>
  //                       <span className="text-sm text-gray-500">(Auto-determined by quantity)</span>
  //                     </div>
  //                   </div>

  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-2">Location:</label>
  //                     <input
  //                       type="text"
  //                       value={editingItem.location}
  //                       onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
  //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
  //                     />
  //                   </div>
  //                 </div>
  //               </div>

  //               <div className="bg-blue-50 rounded-lg p-6">
  //                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Status</h3>
  //                 <div className="grid grid-cols-3 gap-6">
  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-2">Available:</label>
  //                     <input
  //                       type="number"
  //                       value={editingItem.available.toString()}
  //                       readOnly
  //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 text-base font-semibold"
  //                     />
  //                     <p className="text-xs text-gray-500 mt-1">
  //                       Auto-calculated: Total - Deployed - Maintenance ={" "}
  //                       {editingItem.quantity - editingItem.inUse - editingItem.maintenance}
  //                     </p>
  //                   </div>

  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-2">Deployed:</label>
  //                     <input
  //                       type="number"
  //                       value={editingItem.inUse.toString()}
  //                       onChange={(e) => {
  //                         const inputValue = e.target.value
  //                         if (inputValue === "") {
  //                           const newAvailable = editingItem.quantity - 0 - editingItem.maintenance
  //                           setEditingItem({ ...editingItem, inUse: 0, available: Math.max(0, newAvailable) })
  //                           return
  //                         }

  //                         const newInUse = Number.parseInt(inputValue, 10)
  //                         if (!isNaN(newInUse) && newInUse >= 0) {
  //                           const maxInUse = editingItem.quantity - editingItem.maintenance
  //                           const clampedInUse = Math.min(newInUse, maxInUse)
  //                           const newAvailable = editingItem.quantity - clampedInUse - editingItem.maintenance
  //                           setEditingItem({
  //                             ...editingItem,
  //                             inUse: clampedInUse,
  //                             available: Math.max(0, newAvailable),
  //                           })
  //                         }
  //                       }}
  //                       min="0"
  //                       max={editingItem.quantity - editingItem.maintenance}
  //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
  //                     />
  //                   </div>

  //                   <div>
  //                     <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance:</label>
  //                     <input
  //                       type="number"
  //                       value={editingItem.maintenance.toString()}
  //                       onChange={(e) => {
  //                         const inputValue = e.target.value
  //                         if (inputValue === "") {
  //                           const newAvailable = editingItem.quantity - editingItem.inUse - 0
  //                           setEditingItem({ ...editingItem, maintenance: 0, available: Math.max(0, newAvailable) })
  //                           return
  //                         }

  //                         const newMaintenance = Number.parseInt(inputValue, 10)
  //                         if (!isNaN(newMaintenance) && newMaintenance >= 0) {
  //                           const maxMaintenance = editingItem.quantity - editingItem.inUse
  //                           const clampedMaintenance = Math.min(newMaintenance, maxMaintenance)
  //                           const newAvailable = editingItem.quantity - editingItem.inUse - clampedMaintenance
  //                           setEditingItem({
  //                             ...editingItem,
  //                             maintenance: clampedMaintenance,
  //                             available: Math.max(0, newAvailable),
  //                           })
  //                         }
  //                       }}
  //                       min="0"
  //                       max={editingItem.quantity - editingItem.inUse}
  //                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
  //                     />
  //                   </div>
  //                 </div>
  //               </div>

  //               <div className="bg-yellow-50 rounded-lg p-6">
  //                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
  //                   Condition Thresholds (Admin Configurable):
  //                 </h3>
  //                 <div className="grid grid-cols-3 gap-6">
  //                   <div>
  //                     <label className="block text-sm font-medium text-green-700 mb-2">Excellent (≥)</label>
  //                     <input
  //                       type="number"
  //                       value={editingItem.thresholds?.excellent || 0}
  //                       onChange={(e) => {
  //                         const newThresholds = {
  //                           ...editingItem.thresholds!,
  //                           excellent: Number.parseInt(e.target.value) || 0,
  //                         }
  //                         const newCondition = getAutomaticCondition(editingItem.quantity, newThresholds)
  //                         setEditingItem({
  //                           ...editingItem,
  //                           thresholds: newThresholds,
  //                           condition: newCondition,
  //                         })
  //                       }}
  //                       className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
  //                     />
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-blue-700 mb-2">Good (≥)</label>
  //                     <input
  //                       type="number"
  //                       value={editingItem.thresholds?.good || 0}
  //                       onChange={(e) => {
  //                         const newThresholds = {
  //                           ...editingItem.thresholds!,
  //                           good: Number.parseInt(e.target.value) || 0,
  //                         }
  //                         const newCondition = getAutomaticCondition(editingItem.quantity, newThresholds)
  //                         setEditingItem({
  //                           ...editingItem,
  //                           thresholds: newThresholds,
  //                           condition: newCondition,
  //                         })
  //                       }}
  //                       className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
  //                     />
  //                   </div>
  //                   <div>
  //                     <label className="block text-sm font-medium text-yellow-700 mb-2">Fair (≥)</label>
  //                     <input
  //                       type="number"
  //                       value={editingItem.thresholds?.fair || 0}
  //                       onChange={(e) => {
  //                         const newThresholds = {
  //                           ...editingItem.thresholds!,
  //                           fair: Number.parseInt(e.target.value) || 0,
  //                         }
  //                         const newCondition = getAutomaticCondition(editingItem.quantity, newThresholds)
  //                         setEditingItem({
  //                           ...editingItem,
  //                           thresholds: newThresholds,
  //                           condition: newCondition,
  //                         })
  //                       }}
  //                       className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base"
  //                     />
  //                   </div>
  //                 </div>
  //                 <p className="text-sm text-gray-600 mt-3 bg-white p-3 rounded-md border border-gray-200">
  //                   <strong>Note:</strong> Set custom thresholds for this item. Below Fair = Poor, 0 = Unserviceable
  //                 </p>
  //               </div>

  //               <div className="bg-gray-50 rounded-lg p-6">
  //                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
  //                 <textarea
  //                   value={editingItem.notes || ""}
  //                   onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
  //                   rows={4}
  //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
  //                   placeholder="Add any additional notes about this equipment..."
  //                 />
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
  //           <button
  //             onClick={() => setShowCloseEditModal(false)}
  //             className="px-8 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             onClick={handleApplyChanges}
  //             className="px-8 py-3 bg-[#1B2560] text-white rounded-lg hover:bg-[#2A3B70] transition-colors font-medium shadow-sm"
  //           >
  //             Apply
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderMaintenanceHistoryModal = () => {
  //   if (!showMaintenanceModal || !editingItem) return null

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
  //       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
  //           <div className="flex items-center gap-3">
  //             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
  //               <Wrench className="w-5 h-5 text-blue-600" />
  //             </div>
  //             <div>
  //               <h2 className="text-xl font-semibold text-gray-900">Maintenance History</h2>
  //               <p className="text-sm text-gray-600">{editingItem.name}</p>
  //             </div>
  //           </div>
  //           <button
  //             onClick={() => setShowMaintenanceModal(false)}
  //             className="text-gray-400 hover:text-gray-600 transition-colors"
  //           >
  //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //           </button>
  //         </div>

  //         <div className="flex-1 overflow-y-auto p-6">
  //           {editingItem.maintenanceHistory && editingItem.maintenanceHistory.length > 0 ? (
  //             <div className="space-y-4">
  //               {editingItem.maintenanceHistory.map((record, index) => (
  //                 <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
  //                   <div className="flex justify-between items-start mb-2">
  //                     <h3 className="font-semibold text-gray-900">{record.type}</h3>
  //                     <span className="text-sm text-gray-500">{record.date}</span>
  //                   </div>
  //                   <p className="text-gray-700 mb-2">{record.description}</p>
  //                   <p className="text-sm text-gray-600 flex items-center gap-1">
  //                     <User className="w-4 h-4" />
  //                     Technician: {record.technician}
  //                   </p>
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <div className="text-center py-12">
  //               <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
  //               <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Records</h3>
  //               <p className="text-gray-600 mb-4">This equipment has no maintenance history yet.</p>
  //             </div>
  //           )}
  //         </div>

  //         <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
  //           <button
  //             onClick={() => setShowMaintenanceModal(false)}
  //             className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
  //           >
  //             Close
  //           </button>
  //           <button
  //             onClick={() => setShowAddMaintenanceForm(true)}
  //             className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
  //           >
  //             Add Maintenance Record
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderDeploymentHistoryModal = () => {
  //   if (!showDeploymentModal || !editingItem) return null

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
  //       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
  //           <div className="flex items-center gap-3">
  //             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
  //               <History className="w-5 h-5 text-green-600" />
  //             </div>
  //             <div>
  //               <h2 className="text-xl font-semibold text-gray-900">Deployment History</h2>
  //               <p className="text-sm text-gray-600">{editingItem.name}</p>
  //             </div>
  //           </div>
  //           <button
  //             onClick={() => setShowDeploymentModal(false)}
  //             className="text-gray-400 hover:text-gray-600 transition-colors"
  //           >
  //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //           </button>
  //         </div>

  //         <div className="flex-1 overflow-y-auto p-6">
  //           {editingItem.deploymentHistory && editingItem.deploymentHistory.length > 0 ? (
  //             <div className="space-y-4">
  //               {editingItem.deploymentHistory.map((record, index) => (
  //                 <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
  //                   <div className="flex justify-between items-start mb-2">
  //                     <h3 className="font-semibold text-gray-900">{record.user}</h3>
  //                     <span className="text-sm text-gray-500">{record.date}</span>
  //                   </div>
  //                   <p className="text-gray-700 mb-2">Purpose: {record.purpose}</p>
  //                   <div className="flex items-center gap-4 text-sm text-gray-600">
  //                     <span>Deployed: {record.date}</span>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <div className="text-center py-12">
  //               <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
  //               <h3 className="text-lg font-medium text-gray-900 mb-2">No Deployment Records</h3>
  //               <p className="text-gray-600 mb-4">This equipment has no deployment history yet.</p>
  //             </div>
  //           )}
  //         </div>

  //         <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
  //           <button
  //             onClick={() => setShowDeploymentModal(false)}
  //             className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
  //           >
  //             Close
  //           </button>
  //           <button
  //             onClick={() => setShowAddDeploymentForm(true)}
  //             className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
  //           >
  //             Add Deployment Record
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderAddMaintenanceForm = () => {
  //   if (!showAddMaintenanceForm) return null

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
  //       <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-200">
  //           <h3 className="text-lg font-semibold text-gray-900">Add Maintenance Record</h3>
  //           <button onClick={() => setShowAddMaintenanceForm(false)} className="text-gray-400 hover:text-gray-600">
  //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //           </button>
  //         </div>

  //         <div className="p-6 space-y-4">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
  //             <input
  //               type="date"
  //               value={newMaintenanceRecord.date}
  //               onChange={(e) => setNewMaintenanceRecord({ ...newMaintenanceRecord, date: e.target.value })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
  //             <select
  //               value={newMaintenanceRecord.type}
  //               onChange={(e) => setNewMaintenanceRecord({ ...newMaintenanceRecord, type: e.target.value })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //             >
  //               <option value="">Select type...</option>
  //               <option value="Inspection">Inspection</option>
  //               <option value="Cleaning">Cleaning</option>
  //               <option value="Repair">Repair</option>
  //               <option value="Replacement">Replacement</option>
  //               <option value="Calibration">Calibration</option>
  //               <option value="Testing">Testing</option>
  //             </select>
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
  //             <textarea
  //               value={newMaintenanceRecord.description}
  //               onChange={(e) => setNewMaintenanceRecord({ ...newMaintenanceRecord, description: e.target.value })}
  //               rows={3}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //               placeholder="Describe the maintenance performed..."
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Technician *</label>
  //             <input
  //               type="text"
  //               value={newMaintenanceRecord.technician}
  //               onChange={(e) => setNewMaintenanceRecord({ ...newMaintenanceRecord, technician: e.target.value })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //               placeholder="Technician name..."
  //             />
  //           </div>
  //         </div>

  //         <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
  //           <button
  //             onClick={() => setShowAddMaintenanceForm(false)}
  //             className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             onClick={handleAddMaintenanceRecord}
  //             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
  //           >
  //             Add Record
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderAddDeploymentForm = () => {
  //   if (!showAddDeploymentForm) return null

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
  //       <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-200">
  //           <h3 className="text-lg font-semibold text-gray-900">Add Deployment Record</h3>
  //           <button onClick={() => setShowAddDeploymentForm(false)} className="text-gray-400 hover:text-gray-600">
  //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //           </button>
  //         </div>

  //         <div className="p-6 space-y-4">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Deployment Date</label>
  //             <input
  //               type="date"
  //               value={newDeploymentRecord.date}
  //               onChange={(e) => setNewDeploymentRecord({ ...newDeploymentRecord, date: e.target.value })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Response Team/Unit *</label>
  //             <input
  //               type="text"
  //               value={newDeploymentRecord.user}
  //               onChange={(e) => setNewDeploymentRecord({ ...newDeploymentRecord, user: e.target.value })}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
  //               placeholder="Response team or unit name..."
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium text-gray-700 mb-2">Mission/Operation Purpose *</label>
  //             <textarea
  //               value={newDeploymentRecord.purpose}
  //               onChange={(e) => setNewDeploymentRecord({ ...newDeploymentRecord, purpose: e.target.value })}
  //               rows={3}
  //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
  //               placeholder="Purpose of deployment..."
  //             />
  //           </div>
  //         </div>

  //         <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
  //           <button
  //             onClick={() => setShowAddDeploymentForm(false)}
  //             className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             onClick={handleAddDeploymentRecord}
  //             className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
  //           >
  //             Add Record
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderBulkDeploymentModal = () => {
  //   if (!showBulkDeploymentModal) return null

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  //       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-200">
  //           <h2 className="text-xl font-semibold text-gray-900">Bulk Equipment Deployment</h2>
  //           <button onClick={() => setShowBulkDeploymentModal(false)} className="text-gray-400 hover:text-gray-600">
  //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //           </button>
  //         </div>

  //         <div className="flex-1 overflow-y-auto p-6">
  //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //             <div className="space-y-4">
  //               <h3 className="text-lg font-semibold text-gray-900">Deployment Information</h3>

  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700 mb-2">Response Team/Unit *</label>
  //                 <input
  //                   type="text"
  //                   value={bulkDeploymentData.user}
  //                   onChange={(e) => setBulkDeploymentData({ ...bulkDeploymentData, user: e.target.value })}
  //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //                   placeholder="Enter response team or unit name..."
  //                 />
  //               </div>

  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700 mb-2">Mission/Operation Purpose *</label>
  //                 <textarea
  //                   value={bulkDeploymentData.purpose}
  //                   onChange={(e) => setBulkDeploymentData({ ...bulkDeploymentData, purpose: e.target.value })}
  //                   rows={3}
  //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //                   placeholder="Describe the mission or operation purpose..."
  //                 />
  //               </div>

  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700 mb-2">Deployment Date</label>
  //                 <input
  //                   type="date"
  //                   value={bulkDeploymentData.date}
  //                   onChange={(e) => setBulkDeploymentData({ ...bulkDeploymentData, date: e.target.value })}
  //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //                 />
  //               </div>
  //             </div>

  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-4">
  //                 Select Equipment ({selectedItems.length} selected)
  //               </h3>
  //               <div className="relative mb-3">
  //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
  //                 <input
  //                   type="text"
  //                   placeholder="Search equipment..."
  //                   value={bulkDeploymentSearchTerm}
  //                   onChange={(e) => setBulkDeploymentSearchTerm(e.target.value)}
  //                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
  //                 />
  //               </div>
  //               <div className="h-96 overflow-y-auto border border-gray-200 rounded-md">
  //                 {equipmentList
  //                   .filter((item) => item.available > 0)
  //                   .filter((item) =>
  //                     bulkDeploymentSearchTerm
  //                       ? item.name.toLowerCase().includes(bulkDeploymentSearchTerm.toLowerCase()) ||
  //                         item.description.toLowerCase().includes(bulkDeploymentSearchTerm.toLowerCase()) ||
  //                         (item.location &&
  //                           item.location.toLowerCase().includes(bulkDeploymentSearchTerm.toLowerCase())) ||
  //                         (item.serialNumber &&
  //                           item.serialNumber.toLowerCase().includes(bulkDeploymentSearchTerm.toLowerCase()))
  //                       : true,
  //                   )
  //                   .map((item) => (
  //                     <div key={item.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
  //                       <label className="flex items-center space-x-3 cursor-pointer">
  //                         <input
  //                           type="checkbox"
  //                           checked={selectedItems.includes(item.id)}
  //                           onChange={(e) => {
  //                             if (e.target.checked) {
  //                               setSelectedItems([...selectedItems, item.id])
  //                             } else {
  //                               setSelectedItems(selectedItems.filter((id) => id !== item.id))
  //                             }
  //                           }}
  //                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
  //                         />
  //                         <div className="flex-1">
  //                           <div className="text-sm font-medium text-gray-900">{item.name}</div>
  //                           <div className="text-xs text-gray-500">
  //                             Available: {item.available} | Location: {item.location}
  //                           </div>
  //                         </div>
  //                       </label>
  //                     </div>
  //                   ))}
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
  //           <button
  //             onClick={() => setShowBulkDeploymentModal(false)}
  //             className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             onClick={handleBulkDeployment}
  //             className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
  //           >
  //             Deploy Selected Items ({selectedItems.length})
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderBulkMaintenanceModal = () => {
  //   if (!showBulkMaintenanceModal) return null

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  //       <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-200">
  //           <h2 className="text-xl font-semibold text-gray-900">Bulk Equipment Maintenance</h2>
  //           <button onClick={() => setShowBulkMaintenanceModal(false)} className="text-gray-400 hover:text-gray-600">
  //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //           </button>
  //         </div>

  //         <div className="flex-1 overflow-y-auto p-6">
  //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //             <div className="space-y-4">
  //               <h3 className="text-lg font-semibold text-gray-900">Maintenance Information</h3>

  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700 mb-2">Technician *</label>
  //                 <input
  //                   type="text"
  //                   value={bulkMaintenanceData.technician}
  //                   onChange={(e) => setBulkMaintenanceData({ ...bulkMaintenanceData, technician: e.target.value })}
  //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
  //                   placeholder="Enter technician name..."
  //                 />
  //               </div>

  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Type *</label>
  //                 <select
  //                   value={bulkMaintenanceData.type}
  //                   onChange={(e) => setBulkMaintenanceData({ ...bulkMaintenanceData, type: e.target.value })}
  //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
  //                 >
  //                   <option value="">Select type...</option>
  //                   <option value="Inspection">Inspection</option>
  //                   <option value="Cleaning">Cleaning</option>
  //                   <option value="Repair">Repair</option>
  //                   <option value="Replacement">Replacement</option>
  //                   <option value="Calibration">Calibration</option>
  //                   <option value="Testing">Testing</option>
  //                 </select>
  //               </div>

  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
  //                 <textarea
  //                   value={bulkMaintenanceData.description}
  //                   onChange={(e) => setBulkMaintenanceData({ ...bulkMaintenanceData, description: e.target.value })}
  //                   rows={3}
  //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
  //                   placeholder="Describe the maintenance to be performed..."
  //                 />
  //               </div>

  //               <div>
  //                 <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Date</label>
  //                 <input
  //                   type="date"
  //                   value={bulkMaintenanceData.date}
  //                   onChange={(e) => setBulkMaintenanceData({ ...bulkMaintenanceData, date: e.target.value })}
  //                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
  //                 />
  //               </div>
  //             </div>

  //             <div>
  //               <h3 className="text-lg font-semibold text-gray-900 mb-4">
  //                 Select Equipment ({selectedItems.length} selected)
  //               </h3>
  //               <div className="relative mb-3">
  //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
  //                 <input
  //                   type="text"
  //                   placeholder="Search equipment..."
  //                   value={bulkMaintenanceSearchTerm}
  //                   onChange={(e) => setBulkMaintenanceSearchTerm(e.target.value)}
  //                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
  //                 />
  //               </div>
  //               <div className="h-96 overflow-y-auto border border-gray-200 rounded-md">
  //                 {equipmentList
  //                   .filter((item) => item.available > 0)
  //                   .filter((item) =>
  //                     bulkMaintenanceSearchTerm
  //                       ? item.name.toLowerCase().includes(bulkMaintenanceSearchTerm.toLowerCase()) ||
  //                         item.description.toLowerCase().includes(bulkMaintenanceSearchTerm.toLowerCase()) ||
  //                         (item.location &&
  //                           item.location.toLowerCase().includes(bulkMaintenanceSearchTerm.toLowerCase())) ||
  //                         (item.serialNumber &&
  //                           item.serialNumber.toLowerCase().includes(bulkMaintenanceSearchTerm.toLowerCase()))
  //                       : true,
  //                   )
  //                   .map((item) => (
  //                     <div key={item.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
  //                       <label className="flex items-center space-x-3 cursor-pointer">
  //                         <input
  //                           type="checkbox"
  //                           checked={selectedItems.includes(item.id)}
  //                           onChange={(e) => {
  //                             if (e.target.checked) {
  //                               setSelectedItems([...selectedItems, item.id])
  //                             } else {
  //                               setSelectedItems(selectedItems.filter((id) => id !== item.id))
  //                             }
  //                           }}
  //                           className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
  //                         />
  //                         <div className="flex-1">
  //                           <div className="text-sm font-medium text-gray-900">{item.name}</div>
  //                           <div className="text-xs text-gray-500">
  //                             Available: {item.available} | Location: {item.location}
  //                           </div>
  //                         </div>
  //                       </label>
  //                     </div>
  //                   ))}
  //               </div>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
  //           <button
  //             onClick={() => setShowBulkMaintenanceModal(false)}
  //             className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             onClick={handleBulkMaintenance}
  //             className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
  //           >
  //             Schedule Maintenance ({selectedItems.length})
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // const renderAddItemModal = () => {
  //   if (!showAddItemModal) return null

  //   return (
  //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
  //       <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
  //         <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
  //           <div className="flex items-center gap-3">
  //             <Package className="w-6 h-6 text-[#1B2560]" />
  //             <span className="text-lg font-semibold text-gray-900">Add New Equipment</span>
  //           </div>
  //           <button
  //             onClick={() => setShowAddItemModal(false)}
  //             className="text-gray-400 hover:text-gray-600 transition-colors"
  //           >
  //             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  //             </svg>
  //           </button>
  //         </div>

  //         <div className="flex-1 overflow-y-auto p-6">
  //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name *</label>
  //               <input
  //                 type="text"
  //                 value={newItem.name}
  //                 onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //                 placeholder="Enter equipment name..."
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
  //               <select
  //                 value={newItem.category}
  //                 onChange={(e) =>
  //                   setNewItem({
  //                     ...newItem,
  //                     category: e.target.value as "rescue" | "medical" | "tools" | "shelter" | "safety" | "logistics",
  //                   })
  //                 }
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //               >
  //                 <option value="rescue">Rescue Equipment</option>
  //                 <option value="medical">Medical Equipment</option>
  //                 <option value="tools">Tools & Equipment</option>
  //                 <option value="shelter">Shelter & Supply</option>
  //                 <option value="safety">Safety Equipment</option>
  //                 <option value="logistics">Logistics Equipment</option>
  //               </select>
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
  //               <input
  //                 type="number"
  //                 value={newItem.quantity}
  //                 onChange={(e) =>
  //                   setNewItem({ ...newItem, quantity: Number(e.target.value), available: Number(e.target.value) })
  //                 }
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //                 placeholder="Enter quantity..."
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
  //               <input
  //                 type="text"
  //                 value={newItem.location}
  //                 onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //                 placeholder="Enter location..."
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
  //               <input
  //                 type="text"
  //                 value={newItem.serialNumber}
  //                 onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //                 placeholder="Enter serial number..."
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Last Inspection Date</label>
  //               <input
  //                 type="date"
  //                 value={newItem.lastInspection}
  //                 onChange={(e) => setNewItem({ ...newItem, lastInspection: e.target.value })}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Next Inspection Date</label>
  //               <input
  //                 type="date"
  //                 value={newItem.nextInspection}
  //                 onChange={(e) => setNewItem({ ...newItem, nextInspection: e.target.value })}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //               />
  //             </div>

  //             <div className="col-span-2">
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
  //               <textarea
  //                 value={newItem.description}
  //                 onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
  //                 rows={3}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //                 placeholder="Enter description..."
  //               />
  //             </div>

  //             <div className="col-span-2">
  //               <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
  //               <textarea
  //                 value={newItem.notes}
  //                 onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
  //                 rows={3}
  //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //                 placeholder="Enter notes..."
  //               />
  //             </div>
  //           </div>
  //         </div>

  //         <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
  //           <button
  //             onClick={() => setShowAddItemModal(false)}
  //             className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             onClick={handleAddItem}
  //             className="px-6 py-3 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
  //           >
  //             Add Equipment
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
          <div className="sticky top-0 z-40 bg-[#1B2560] border-b border-gray-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-white" />
                  <h1 className="text-xl font-semibold text-white">Inventory</h1>
                </div>
                <div className="text-sm font-mono text-white">{currentTime}</div>
              </div>
              <div className="mt-2 text-sm text-gray-300">CDRRMO Staff Portal › Inventory</div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className={`grid grid-cols-2 md:grid-cols-${types.length/2} gap-6 mb-8`}>
              {types.map((type) => (
                <Link
                  key={type.id}
                  href={`/inventory/${type.id}`}
                >
                    <div
                    key={type.id}
                    className="bg-[#E8F4FD] border-2 border-gray-300 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-[#1B2560] hover:scale-105"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="text-[#1B2560] mb-2">
                        <div className="w-20 h-20 flex items-center justify-center">
                          <div className="text-4xl text-[#1B2560]">{type.icon}</div>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-[#1B2560]">{type.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{type.items_count} items</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Search and filter section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search equipment..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={filterCondition}
                      onChange={(e) => setFilterCondition(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option value="all">All Conditions</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                      <option value="Unserviceable">Unserviceable</option>
                    </select>
                  </div>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                {userHasPermission(/inventory\.(?:create|\*)/) && (
                  <AddItemForm />
                )}
              </div>
            </div>

            {/* Equipment table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Equipment Inventory
                    {/* {selectedCategory && (
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        - {categories.find((c) => c.id === selectedCategory)?.name}
                      </span>
                    )} */}
                  </h2>
                  <span className="text-sm text-gray-600">
                    {items.length} of {totalCount} items
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={items}
                  noData={(
                    <div className="text-center py-12">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                  )}
                  getRowHref={(row) => `/inventory/item/${row.id}`}
                />
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

InventoryIndex.layout = (e: ReactElement) => <Authenticated children={e} />
