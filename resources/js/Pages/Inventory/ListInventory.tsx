"use client"

import Authenticated from "@/Layouts/AuthenticatedLayout"
import { useState } from "react"
import { Search, ArrowLeft } from "lucide-react"
import type React from "react"
import { PageProps } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConsumableItem, EquipmentGroup, ItemType } from "@/types/inventory"

type EquipmentEntry = EquipmentGroup & {  items_count: number }
type ConsumableEntry = ConsumableItem & { count: string }

const equipmentColumns: ColumnDef<EquipmentEntry>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <span>{row.getValue('name')}</span>
    )
  },
  {
    accessorKey: 'items_count',
    header: 'Count'
  },
  {
    id: 'details',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          className="bg-[#1B2560]"
          asChild
        >
          <Link href={`/inventory/equipment/${row.original.id}`}>
            Details
          </Link>
        </Button>
      </div>
    ),
  }
];

const consumableColumns: ColumnDef<ConsumableEntry>[] = [
  {
    accessorKey: 'name',
    cell: ({ row }) => (
      <span>{row.getValue('name')}</span>
    )
  },
  {
    accessorKey: 'count',
    header: 'Count'
  },
  {
    id: 'details',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <Button
          className="bg-[#1B2560]"
          asChild
        >
          <Link href={`/inventory/consumable/${row.original.id}`}>
            Details
          </Link>
        </Button>
      </div>
    ),
  }
]; 

export default function ListInventory({ items, type }: PageProps<{ items: {
  equipment: EquipmentEntry[],
  consumables: ConsumableEntry[],
}, type: ItemType }>) {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/inventory" className="p-2 rounded-full hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h2 className="text-lg font-semibold text-gray-900">
                  {type.name}
                </h2>
              </div>
              {/* <span className="text-sm text-gray-600">{items.length} item{items.length > 1 && 's'}</span> */}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
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
              <div>
                <select
                  // onChange={(e) => setFilterCondition(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Conditions</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Unserviceable">Unserviceable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Equipment List */}
          <Tabs defaultValue="equipment">
            <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Inventory
                  </h2>
                  <TabsList>
                    <TabsTrigger value="equipment">Equipment</TabsTrigger>
                    <TabsTrigger value="consumables">Consumables</TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="overflow-x-auto">
                <TabsContent value="equipment">
                  <DataTable
                    columns={equipmentColumns}
                    data={items.equipment}
                  />
                </TabsContent>
                <TabsContent value="consumables">
                  <DataTable
                    columns={consumableColumns}
                    data={items.consumables}
                  />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

ListInventory.layout = (e: React.JSX.Element) => <Authenticated pageTitle="ListInventory" children={e} />
