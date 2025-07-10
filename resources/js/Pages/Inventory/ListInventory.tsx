"use client"

import Authenticated from "@/Layouts/AuthenticatedLayout"
import { useState, useEffect } from "react"
import { Search, Package, AlertTriangle, CheckCircle, Clock, ArrowLeft, Edit, Clipboard, Download } from "lucide-react"
import type React from "react"
import { PageProps } from "@/types"
import Paginator from "@/types/paginator"
import Item from "@/types/inventory"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Link } from "@inertiajs/react"

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

const columns: ColumnDef<Item>[] = [
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
          {row.getValue('status')}/10 Available
        </span>
      </div>
    ))
  },
  {
    id: 'quantity',
    header: 'QUANTITY',
    accessorFn: () => 10,
    cell: (({ row }) => (
      <div className="text-sm text-gray-900">
        <div>Total: {row.getValue('quantity')}</div>
        <div className="text-xs text-gray-500">
          Available: 10 | In Use: 0
          {/* {item.maintenance > 0 && ` | Maintenance: ${item.maintenance}`} */}
        </div>
      </div>
    ))
  },
  {
    id: 'condition',
    header: 'CONDITION',
    cell: (() => (
      <div className="space-x-1">
        {['Good', 'Fair', 'Unserviceable'].map((condition) => (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(condition)}`}>
            {condition}
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
    id: 'inspectionDate',
    header: 'NEXT INSPECTION',
    accessorFn: () => new Date('1/1/2025'),
    cell: (({ row }) => {
      const date = row.getValue('inspectionDate') as Date;
      return (
        <span>{date.toDateString()}</span>
      );
    }),
  },
]

export default function ListInventory({ items }: PageProps<{ items: Paginator<Item> }>) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCondition, setFilterCondition] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null)
  const [activeTab, setActiveTab] = useState<"details" | "maintenance" | "checkout">("details")
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

  // Mock equipment data - in a real app, this would come from an API or props
  const equipmentData: EquipmentItem[] = [
    // Rescue Equipment
    {
      id: "1",
      name: "Rescue Helmet",
      category: "rescue",
      quantity: 14,
      available: 14,
      inUse: 0,
      maintenance: 0,
      condition: "Good",
      location: "Storage Room A",
      lastInspection: "2024-12-01",
      nextInspection: "2025-06-01",
      description: "Safety helmets for rescue operations",
      notes: "All in good condition",
      lastUsed: "2024-11-15",
      maintenanceHistory: [
        {
          date: "2024-10-15",
          type: "Inspection",
          description: "Regular inspection and cleaning",
          technician: "John Doe",
        },
        {
          date: "2024-06-20",
          type: "Repair",
          description: "Replaced chin straps on 3 helmets",
          technician: "Jane Smith",
        },
      ],
      checkoutHistory: [
        {
          date: "2024-11-15",
          user: "Team Alpha",
          purpose: "Training Exercise",
          returnDate: "2024-11-15",
        },
        {
          date: "2024-09-05",
          user: "Emergency Response Unit",
          purpose: "Flood Response",
          returnDate: "2024-09-07",
        },
      ],
    },
    {
      id: "2",
      name: "Basket Stretcher",
      category: "rescue",
      quantity: 2,
      available: 2,
      inUse: 0,
      maintenance: 0,
      condition: "Good",
      location: "Storage Room A",
      lastInspection: "2024-12-05",
      nextInspection: "2025-06-05",
      description: "Rescue basket for patient transport",
      lastUsed: "2024-10-22",
      maintenanceHistory: [
        {
          date: "2024-12-05",
          type: "Inspection",
          description: "Regular inspection and cleaning",
          technician: "John Doe",
        },
      ],
      checkoutHistory: [
        {
          date: "2024-10-22",
          user: "Medical Team",
          purpose: "Patient Transport",
          returnDate: "2024-10-22",
        },
      ],
    },

    // Medical Equipment
    {
      id: "8",
      name: "First Aid Kit",
      category: "medical",
      quantity: 20,
      available: 20,
      inUse: 0,
      maintenance: 0,
      condition: "Good",
      location: "Medical Storage",
      lastInspection: "2024-12-01",
      nextInspection: "2025-03-01",
      description: "Complete first aid kits for emergency response",
      lastUsed: "2024-11-30",
      maintenanceHistory: [
        {
          date: "2024-12-01",
          type: "Inspection",
          description: "Checked and restocked all kits",
          technician: "Medical Officer Cruz",
        },
      ],
      checkoutHistory: [
        {
          date: "2024-11-30",
          user: "Field Team",
          purpose: "Community Outreach",
          returnDate: "2024-11-30",
        },
      ],
    },

    // Tools & Equipment
    {
      id: "16",
      name: "Water Pump",
      category: "tools",
      quantity: 1,
      available: 0,
      inUse: 0,
      maintenance: 1,
      condition: "Poor",
      location: "Equipment Storage",
      lastInspection: "2024-10-15",
      nextInspection: "2025-01-15",
      description: "Water pump for flood response",
      notes: "NEEDS REPAIR - MAINTENANCE - UNSERVICEABLE",
      lastUsed: "2024-09-15",
      maintenanceHistory: [
        {
          date: "2024-10-15",
          type: "Inspection",
          description: "Found motor issues, sent for repair",
          technician: "Mechanic Reyes",
        },
        {
          date: "2024-09-15",
          type: "Usage",
          description: "Used in flood response, reported issues with motor",
          technician: "Team Bravo",
        },
      ],
      checkoutHistory: [
        {
          date: "2024-09-15",
          user: "Team Bravo",
          purpose: "Flood Response",
          returnDate: "2024-09-16",
        },
      ],
    },

    // Safety Equipment
    {
      id: "28",
      name: "Life Reflective Vest",
      category: "safety",
      quantity: 42,
      available: 42,
      inUse: 0,
      maintenance: 0,
      condition: "Good",
      location: "Safety Equipment Storage",
      lastInspection: "2024-12-01",
      nextInspection: "2025-06-01",
      description: "Reflective vests for visibility",
      notes: "42 PCS",
      lastUsed: "2024-11-20",
      maintenanceHistory: [
        {
          date: "2024-12-01",
          type: "Inspection",
          description: "Regular inspection and cleaning",
          technician: "Safety Officer Garcia",
        },
      ],
      checkoutHistory: [
        {
          date: "2024-11-20",
          user: "Night Patrol Team",
          purpose: "Evening Operations",
          returnDate: "2024-11-21",
        },
      ],
    },

    // Logistics Equipment
    {
      id: "32",
      name: "Combi Tool",
      category: "logistics",
      quantity: 1,
      available: 1,
      inUse: 0,
      maintenance: 0,
      condition: "Good",
      location: "Logistics Storage",
      lastInspection: "2024-12-01",
      nextInspection: "2025-06-01",
      description: "Combination tool for rescue operations",
      notes: "SERVICEABLE FIRM",
      lastUsed: "2024-10-05",
      maintenanceHistory: [
        {
          date: "2024-12-01",
          type: "Inspection",
          description: "Regular inspection and lubrication",
          technician: "Logistics Officer Tan",
        },
      ],
      checkoutHistory: [
        {
          date: "2024-10-05",
          user: "Rescue Team",
          purpose: "Vehicle Extrication Training",
          returnDate: "2024-10-05",
        },
      ],
    },
  ]

  // Get URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get("category")
    const itemId = urlParams.get("itemId")

    if (category) {
      setSelectedCategory(category)
    }

    if (itemId) {
      const item = equipmentData.find((item) => item.id === itemId)
      if (item) {
        setSelectedItem(item)
      }
    }
  }, [])

  const filteredEquipment = equipmentData.filter((item) => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCondition = filterCondition === "all" ? true : item.condition === filterCondition

    return matchesCategory && matchesSearch && matchesCondition
  })

  const getStatusIcon = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (percentage >= 50) return <Clock className="w-4 h-4 text-yellow-600" />
    return <AlertTriangle className="w-4 h-4 text-red-600" />
  }

  const handleBackToInventory = () => {
    // Navigate back to main inventory
    window.location.href = "/inventory"
  }

  const handleItemClick = (item: EquipmentItem) => {
    setSelectedItem(item)
    // Update URL without refreshing the page
    const url = new URL(window.location.href)
    url.searchParams.set("itemId", item.id)
    window.history.pushState({}, "", url.toString())
  }

  const handleBackToList = () => {
    setSelectedItem(null)
    // Remove itemId from URL
    const url = new URL(window.location.href)
    url.searchParams.delete("itemId")
    window.history.pushState({}, "", url.toString())
  }

  // Render item details view
  const renderItemDetails = () => {
    if (!selectedItem) return null

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={handleBackToList} className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">{selectedItem.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Clipboard className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-[#1B2560] text-[#1B2560]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "maintenance"
                  ? "border-[#1B2560] text-[#1B2560]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Maintenance History
            </button>
            <button
              onClick={() => setActiveTab("checkout")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "checkout"
                  ? "border-[#1B2560] text-[#1B2560]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Checkout History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quantity Information</h3>
                  <div className="mt-1 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-lg font-medium text-gray-900">{selectedItem.quantity}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Available</p>
                      <p className="text-lg font-medium text-green-700">{selectedItem.available}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">In Use</p>
                      <p className="text-lg font-medium text-blue-700">{selectedItem.inUse}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Maintenance</p>
                      <p className="text-lg font-medium text-yellow-700">{selectedItem.maintenance}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Condition</h3>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getConditionColor(selectedItem.condition)}`}
                    >
                      {selectedItem.condition}
                    </span>
                  </div>
                </div>

                {selectedItem.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.notes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedItem.location}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Inspection Information</h3>
                  <div className="mt-1 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Inspection:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(selectedItem.lastInspection).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Next Inspection:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(selectedItem.nextInspection).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedItem.lastUsed && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Last Used:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(selectedItem.lastUsed).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Actions</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                      Check Out
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                      Check In
                    </button>
                    <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700">
                      Schedule Maintenance
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Maintenance History</h3>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  Add Maintenance Record
                </button>
              </div>

              {selectedItem.maintenanceHistory && selectedItem.maintenanceHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Technician
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedItem.maintenanceHistory.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.type}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{record.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.technician}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No maintenance records found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "checkout" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Checkout History</h3>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                  New Checkout
                </button>
              </div>

              {selectedItem.checkoutHistory && selectedItem.checkoutHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purpose
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Return Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedItem.checkoutHistory.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.user}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{record.purpose}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.returnDate ? new Date(record.returnDate).toLocaleDateString() : "Not returned"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {record.returnDate ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Returned
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Checked Out
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No checkout records found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-[#1B2560] tracking-wide">
              {selectedItem
                ? selectedItem.name.toUpperCase()
                : selectedCategory
                  ? categoryNames[selectedCategory].toUpperCase()
                  : "INVENTORY DETAILS"}
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
                  {selectedCategory ? categoryNames[selectedCategory] : "All Equipment"}
                </h2>
              </div>
              <span className="text-sm text-gray-600">{filteredEquipment.length} items</span>
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
                  value={filterCondition}
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
              data={items.data}
              noData={(
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
              )}
              getRowHref={(row) => `/inventory/item/${row.id}`}
            />
            {/* <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Inspection
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleItemClick(item)}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(item.available, item.quantity)}
                        <span className="ml-2 text-sm text-gray-900">
                          {item.available}/{item.quantity} Available
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>Total: {item.quantity}</div>
                        <div className="text-xs text-gray-500">
                          Available: {item.available} | In Use: {item.inUse}
                          {item.maintenance > 0 && ` | Maintenance: ${item.maintenance}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(item.condition)}`}
                      >
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(item.nextInspection).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        </div>
      </div>
    </div>
  )
}

ListInventory.layout = (e: React.JSX.Element) => <Authenticated children={e} />
