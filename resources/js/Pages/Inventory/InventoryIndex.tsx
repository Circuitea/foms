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
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { PageProps } from "@/types"
import { Link } from "@inertiajs/react"
import { ColumnDef } from "@tanstack/react-table"
import { cn, userHasPermission } from "@/lib/utils"
import AddItemForm from "./Partials/AddItemForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConsumableItem, EquipmentGroup, EquipmentItem, ItemType } from "@/types/inventory"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import NewTransactionForm from "./Partials/NewTransactionForm"

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
    accessorKey: 'type',
    cell: ({ row }) => (
      <span>{row.original.type.icon} {row.original.type.name}</span>
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
    accessorKey: 'type',
    cell: ({ row }) => (
      <span>{row.original.type.icon} {row.original.type.name}</span>
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

export default function InventoryIndex({ types, items, totalCount }: PageProps<{ types: ItemType[], items: {
  equipment: EquipmentEntry[],
  consumables: ConsumableEntry[],
}, totalCount: number }>) {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="mx-auto px-6 py-8">
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
                {/* <p className="text-sm text-gray-600 font-medium">items</p> */}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Search and filter section */}
      <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
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
            {userHasPermission(/inventory\.(?:create|\*)/) && (
              <AddItemForm />
            )}
            <NewTransactionForm />
          </div>
        </div>

        
      </div>

      {/* Equipment table */}
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
              <span className="text-sm text-gray-600">
                {0} of {totalCount} items
              </span>
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
  );
}

InventoryIndex.layout = (e: ReactElement) => <Authenticated PageIcon={ClipboardCheck} pageTitle="Inventory" children={e} />
