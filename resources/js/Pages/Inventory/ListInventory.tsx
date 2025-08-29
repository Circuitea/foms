"use client"

import Authenticated from "@/Layouts/AuthenticatedLayout"
import { useState, useEffect } from "react"
import { Search, Package, CheckCircle, ArrowLeft } from "lucide-react"
import type React from "react"
import { PageProps } from "@/types"
import Item, { ItemCondition, ItemConditionValue, ItemEntry, ItemType } from "@/types/inventory"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EquipmentItem {
  id: string
  name: string
  category: string
  quantity: number
  available: number
  inUse: number
  maintenance: number
  condition: "Excellent" | "Good" | "Fair" | "Poor" | "Unserviceable"
  location: string
  lastInspection: string
  nextInspection: string
  serialNumber?: string
  description: string
  notes?: string
  lastUsed?: string
  maintenanceHistory?: {
    date: string
    type: string
    description: string
    technician: string
  }[]
  checkoutHistory?: {
    date: string
    user: string
    purpose: string
    returnDate?: string
  }[]
}

// Real-time clock hook
function useRealTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  return formatTime(currentTime)
}

const getConditionColor = (condition: ItemConditionValue) => {
    switch (condition) {
      case "available":
        return "bg-green-100 text-green-800"
      case "deployed":
        return "bg-blue-100 text-blue-800"
      case "in_maintenance":
        return "bg-yellow-100 text-yellow-800"
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

export default function ListInventory({ items, type }: PageProps<{ items: ItemEntry[], type: ItemType }>) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCondition, setFilterCondition] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null)
  const currentTime = useRealTimeClock()

  // Category names and their display names
  const categoryNames: Record<string, string> = {
    rescue: "Rescue Equipment",
    medical: "Medical Equipment",
    tools: "Tools & Equipment",
    shelter: "Shelter & Supply",
    safety: "Safety Equipment",
    logistics: "Logistics Equipment",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-[#1B2560] tracking-wide">
              Inventory Details
            </h1>
            <div className="text-lg font-medium text-gray-700">{currentTime}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
              <span className="text-sm text-gray-600">{items.length} item{items.length > 1 && 's'}</span>
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
                  onChange={(e) => setFilterCondition(e.target.value)}
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
            />
          </div>
        </div>
      </div>
    </div>
  )
}

ListInventory.layout = (e: React.JSX.Element) => <Authenticated pageTitle="ListInventory" children={e} />
