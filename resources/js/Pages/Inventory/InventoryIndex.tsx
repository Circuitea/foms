"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Calendar,
  MapPin,
  User,
  Wrench,
  History,
  Check,
  X,
  Plus,
} from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type React from "react"

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
  thresholds?: {
    excellent: number
    good: number
    fair: number
  }
  maintenanceHistory?: {
    date: string
    type: string
    description: string
    technician: string
  }[]
  deploymentHistory?: {
    date: string
    user: string
    purpose: string
  }[]
}

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return `${formatDate(currentTime)}, ${formatTime(currentTime)}`
}

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
    serialNumber: "RH-2024-001",
    lastUsed: "2024-11-28",
    thresholds: { excellent: 10, good: 5, fair: 2 },
    maintenanceHistory: [
      {
        date: "2024-12-01",
        type: "Inspection",
        description: "Routine safety inspection completed",
        technician: "John Smith",
      },
      {
        date: "2024-06-01",
        type: "Cleaning",
        description: "Deep cleaning and sanitization",
        technician: "Maria Garcia",
      },
    ],
    deploymentHistory: [
      {
        date: "2024-11-28",
        user: "Emergency Team Alpha",
        purpose: "Training Exercise",
      },
      {
        date: "2024-11-15",
        user: "Rescue Squad 2",
        purpose: "Emergency Response",
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
    serialNumber: "BS-2024-002",
    thresholds: { excellent: 3, good: 2, fair: 1 },
    maintenanceHistory: [
      {
        date: "2024-12-05",
        type: "Inspection",
        description: "Safety check and weight test",
        technician: "David Wilson",
      },
    ],
    deploymentHistory: [
      {
        date: "2024-11-20",
        user: "Mountain Rescue Team",
        purpose: "Search and Rescue Operation",
      },
    ],
  },
  {
    id: "3",
    name: "Rescue Harness",
    category: "rescue",
    quantity: 12,
    available: 12,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Storage Room A",
    lastInspection: "2024-11-15",
    nextInspection: "2025-05-15",
    description: "Full body harness for rescue operations",
    notes: "1 PCS damaged, 11 PCS operational",
    serialNumber: "RH-2024-003",
    thresholds: { excellent: 10, good: 5, fair: 2 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "4",
    name: "Paddle",
    category: "rescue",
    quantity: 30,
    available: 30,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Storage Room B",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Paddles for water rescue operations",
    serialNumber: "PD-2024-004",
    thresholds: { excellent: 20, good: 10, fair: 5 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "5",
    name: "Goggles",
    category: "rescue",
    quantity: 12,
    available: 12,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Storage Room A",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Safety goggles for rescue operations",
    serialNumber: "GG-2024-005",
    thresholds: { excellent: 10, good: 5, fair: 2 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "6",
    name: "Bag Mat",
    category: "rescue",
    quantity: 8,
    available: 8,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Storage Room B",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    description: "Rescue bag mats for patient transport",
    serialNumber: "BM-2024-006",
    thresholds: { excellent: 6, good: 3, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "7",
    name: "Snowshoes",
    category: "rescue",
    quantity: 6,
    available: 6,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Storage Room B",
    lastInspection: "2024-12-10",
    nextInspection: "2025-06-10",
    description: "Snowshoes for winter rescue operations",
    serialNumber: "SS-2024-007",
    thresholds: { excellent: 4, good: 2, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "53",
    name: "Shuttle Pulley",
    category: "rescue",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Shuttle pulley for rope rescue operations",
    serialNumber: "SP-2024-053",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "54",
    name: "Single Pulley",
    category: "rescue",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Single pulley for rope rescue operations",
    serialNumber: "SP-2024-054",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "55",
    name: "Swift Water Pulley",
    category: "rescue",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Swift water pulley for water rescue operations",
    serialNumber: "SWP-2024-055",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "56",
    name: "Hand Ascender",
    category: "rescue",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    description: "Hand ascender for rope climbing operations",
    serialNumber: "HA-2024-056",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "57",
    name: "Cam Clean",
    category: "rescue",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Cam clean device for rope rescue operations",
    serialNumber: "CC-2024-057",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "58",
    name: "Flat Webbing",
    category: "rescue",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-11-15",
    nextInspection: "2025-05-15",
    description: "Flat webbing for rescue operations",
    serialNumber: "FW-2024-058",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "59",
    name: "Utility or Water Rope",
    category: "rescue",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Utility or water rope for rescue operations",
    serialNumber: "UWR-2024-059",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "61",
    name: "Anchor System",
    category: "rescue",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Anchor system for rope rescue operations",
    serialNumber: "AS-2024-061",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "62",
    name: "Kernmantle Rope",
    category: "rescue",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    description: "Kernmantle rope for rescue operations",
    serialNumber: "KR-2024-062",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "65",
    name: "Steel Carabiner",
    category: "rescue",
    quantity: 3,
    available: 3,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Rescue Equipment Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Steel carabiners for rope rescue operations",
    serialNumber: "SC-2024-065",
    thresholds: { excellent: 5, good: 2, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
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
    serialNumber: "FAK-2024-008",
    thresholds: { excellent: 15, good: 8, fair: 3 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "9",
    name: "Gauze Pad",
    category: "medical",
    quantity: 150,
    available: 150,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Medical Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-12-01",
    description: "Sterile gauze pads for wound dressing",
    serialNumber: "GP-2024-009",
    thresholds: { excellent: 100, good: 50, fair: 20 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "10",
    name: "Oxygen Tank (Small)",
    category: "medical",
    quantity: 11,
    available: 11,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Medical Storage",
    lastInspection: "2024-11-15",
    nextInspection: "2025-02-15",
    description: "Portable oxygen tanks with regulators",
    serialNumber: "OT-2024-010",
    thresholds: { excellent: 8, good: 4, fair: 2 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "11",
    name: "BVM Mask",
    category: "medical",
    quantity: 8,
    available: 8,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Medical Storage",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Bag valve mask for emergency ventilation",
    serialNumber: "BVM-2024-011",
    thresholds: { excellent: 6, good: 3, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "12",
    name: "Trauma Bandage",
    category: "medical",
    quantity: 30,
    available: 30,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Medical Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Trauma bandages for severe bleeding control",
    serialNumber: "TB-2024-012",
    thresholds: { excellent: 20, good: 10, fair: 5 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "13",
    name: "Elastic Bandage",
    category: "medical",
    quantity: 120,
    available: 120,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Medical Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-12-01",
    description: "Elastic bandages for sprains and strains",
    serialNumber: "EB-2024-013",
    thresholds: { excellent: 80, good: 40, fair: 15 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "14",
    name: "Mask",
    category: "medical",
    quantity: 200,
    available: 200,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Medical Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-12-01",
    description: "Disposable face masks",
    serialNumber: "M-2024-014",
    thresholds: { excellent: 150, good: 75, fair: 25 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "15",
    name: "Gloves",
    category: "medical",
    quantity: 500,
    available: 500,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Medical Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-12-01",
    description: "Disposable medical gloves",
    serialNumber: "G-2024-015",
    thresholds: { excellent: 300, good: 150, fair: 50 },
    maintenanceHistory: [],
    deploymentHistory: [],
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
    serialNumber: "WP-2024-016",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "17",
    name: "Saw",
    category: "tools",
    quantity: 2,
    available: 2,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Tool Storage",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Hand saw for cutting operations",
    serialNumber: "S-2024-017",
    thresholds: { excellent: 3, good: 2, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "18",
    name: "Bolt Cutter",
    category: "tools",
    quantity: 7,
    available: 7,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Tool Storage",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    description: "Bolt cutters for cutting metal",
    serialNumber: "BC-2024-018",
    thresholds: { excellent: 5, good: 3, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "19",
    name: "Rope Nylon",
    category: "tools",
    quantity: 5,
    available: 5,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Equipment Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Nylon rope for rescue operations",
    serialNumber: "RN-2024-019",
    thresholds: { excellent: 4, good: 2, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "20",
    name: "Pala (Shovel)",
    category: "tools",
    quantity: 22,
    available: 22,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Tool Storage",
    lastInspection: "2024-11-15",
    nextInspection: "2025-05-15",
    description: "Shovels for digging operations",
    serialNumber: "PS-2024-020",
    thresholds: { excellent: 15, good: 8, fair: 3 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "21",
    name: "Piko (Pick)",
    category: "tools",
    quantity: 15,
    available: 15,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Tool Storage",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Picks for breaking ground",
    serialNumber: "PP-2024-021",
    thresholds: { excellent: 10, good: 5, fair: 2 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "22",
    name: "Fire Axe",
    category: "tools",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Tool Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Fire axe for emergency response",
    serialNumber: "FA-2024-022",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "23",
    name: "Axe Small",
    category: "tools",
    quantity: 3,
    available: 3,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Tool Storage",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    description: "Small axes for cutting operations",
    serialNumber: "AS-2024-023",
    thresholds: { excellent: 4, good: 2, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "24",
    name: "Sledge Hammer",
    category: "tools",
    quantity: 28,
    available: 25,
    inUse: 3,
    maintenance: 0,
    condition: "Good",
    location: "Tool Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Sledge hammers for breaking operations",
    notes: "BIG: 25 PCS, SMALL: 3 PCS",
    serialNumber: "SH-2024-024",
    thresholds: { excellent: 20, good: 10, fair: 5 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },

  // Shelter & Supply
  {
    id: "25",
    name: "Double Deck Bed",
    category: "shelter",
    quantity: 7,
    available: 7,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Supply Warehouse",
    lastInspection: "2024-11-30",
    nextInspection: "2025-05-30",
    description: "Double deck beds for emergency shelters",
    notes: "7 PCS, GOOD CONDITION",
    serialNumber: "DDB-2024-025",
    thresholds: { excellent: 5, good: 3, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "26",
    name: "Skeleton Steel Shelves",
    category: "shelter",
    quantity: 3,
    available: 3,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Supply Warehouse",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Steel shelves for storage",
    notes: "3 PCS, GOOD CONDITION",
    serialNumber: "SSS-2024-026",
    thresholds: { excellent: 4, good: 2, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "27",
    name: "Steel Locker",
    category: "shelter",
    quantity: 8,
    available: 8,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Supply Warehouse",
    lastInspection: "2024-11-15",
    nextInspection: "2025-05-15",
    description: "Steel lockers for secure storage",
    notes: "8 PCS, IN GOOD CONDITION",
    serialNumber: "SL-2024-027",
    thresholds: { excellent: 6, good: 4, fair: 2 },
    maintenanceHistory: [],
    deploymentHistory: [],
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
    serialNumber: "LRV-2024-028",
    thresholds: { excellent: 30, good: 15, fair: 5 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "29",
    name: "Boots",
    category: "safety",
    quantity: 10,
    available: 10,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Safety Equipment Storage",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Safety boots for protection",
    notes: "10 PCS",
    serialNumber: "B-2024-029",
    thresholds: { excellent: 8, good: 4, fair: 2 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "30",
    name: "Utility Gloves",
    category: "safety",
    quantity: 117,
    available: 117,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Safety Equipment Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Utility gloves for hand protection",
    notes: "117 PCS",
    serialNumber: "UG-2024-030",
    thresholds: { excellent: 80, good: 40, fair: 15 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "31",
    name: "Construction Helmet",
    category: "safety",
    quantity: 12,
    available: 12,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Safety Equipment Storage",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    description: "Construction helmets for head protection",
    notes: "12 PCS",
    serialNumber: "CH-2024-031",
    thresholds: { excellent: 10, good: 5, fair: 2 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "60",
    name: "Rappelling Gloves",
    category: "safety",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Safety Equipment Storage",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Rappelling gloves for rope operations",
    serialNumber: "RG-2024-060",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "63",
    name: "Harness Full Body",
    category: "safety",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Safety Equipment Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Full body harness for safety operations",
    serialNumber: "HFB-2024-063",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "64",
    name: "Harness Half Body",
    category: "safety",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Safety Equipment Storage",
    lastInspection: "2024-11-15",
    nextInspection: "2025-05-15",
    description: "Half body harness for safety operations",
    serialNumber: "HHB-2024-064",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
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
    serialNumber: "CT-2024-032",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "33",
    name: "Tripod",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-11-15",
    nextInspection: "2025-05-15",
    description: "Tripod for rescue operations",
    notes: "IN GOOD CONDITION",
    serialNumber: "T-2024-033",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "34",
    name: "Hydraulic Jack",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Hydraulic jack for lifting operations",
    notes: "NEVER BEEN OPEN BEFORE",
    serialNumber: "HJ-2024-034",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "35",
    name: "Manual Hydraulic Pump",
    category: "logistics",
    quantity: 2,
    available: 2,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Manual hydraulic pump for rescue operations",
    notes: "FIRM/SERVICEABLE",
    serialNumber: "MHP-2024-035",
    thresholds: { excellent: 3, good: 2, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "36",
    name: "Ultra Scope",
    category: "logistics",
    quantity: 1,
    available: 0,
    inUse: 0,
    maintenance: 1,
    condition: "Poor",
    location: "Logistics Storage",
    lastInspection: "2024-10-10",
    nextInspection: "2025-01-10",
    description: "Ultra scope for search operations",
    notes: "UNSERVICEABLE",
    serialNumber: "US-2024-036",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "37",
    name: "Portable Speaker",
    category: "logistics",
    quantity: 2,
    available: 1,
    inUse: 0,
    maintenance: 1,
    condition: "Fair",
    location: "Logistics Storage",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    description: "Portable speaker for communication",
    notes: "1 WORKING, 1 UNSERVICEABLE",
    serialNumber: "PS-2024-037",
    thresholds: { excellent: 3, good: 2, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "38",
    name: "V-Strut Stabilizer",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "V-strut stabilizer for rescue operations",
    notes: "FIRM/SERVICEABLE",
    serialNumber: "VSS-2024-038",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "39",
    name: "Generator Set",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-11-15",
    nextInspection: "2025-05-15",
    description: "Generator set for power supply",
    notes: "GOOD SERVICEABLE",
    serialNumber: "GS-2024-039",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "40",
    name: "VHF Phone",
    category: "logistics",
    quantity: 1,
    available: 0,
    inUse: 0,
    maintenance: 1,
    condition: "Poor",
    location: "Logistics Storage",
    lastInspection: "2024-10-05",
    nextInspection: "2025-01-05",
    description: "VHF phone for communication",
    notes: "UNSERVICEABLE",
    serialNumber: "VP-2024-040",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "41",
    name: "Fish Rod Tripod",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Fish rod tripod for water rescue",
    notes: "IN GOOD CONDITION",
    serialNumber: "FRT-2024-041",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "42",
    name: "Hydraulic Hose",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Hydraulic hose for rescue operations",
    notes: "IN GOOD CONDITION",
    serialNumber: "HH-2024-042",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "43",
    name: "Spreader",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Spreader for rescue operations",
    notes: "SERVICEABLE",
    serialNumber: "S-2024-043",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "44",
    name: "SecuNet",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    description: "Security net for rescue operations",
    serialNumber: "SN-2024-044",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "45",
    name: "Pinbar",
    category: "logistics",
    quantity: 7,
    available: 7,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Pinbar for rescue operations",
    notes: "7 PCS",
    serialNumber: "PB-2024-045",
    thresholds: { excellent: 5, good: 3, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "46",
    name: "Work Light",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-11-15",
    nextInspection: "2025-05-15",
    description: "Work light for illumination",
    notes: "GOOD",
    serialNumber: "WL-2024-046",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "47",
    name: "Rotary Hammer",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Rotary hammer for breaking operations",
    notes: "GOOD",
    serialNumber: "RH-2024-047",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "48",
    name: "Angle Grinder",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-11-20",
    nextInspection: "2025-05-20",
    description: "Angle grinder for cutting operations",
    notes: "GOOD",
    serialNumber: "AG-2024-048",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "49",
    name: "Toolbox",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-12-05",
    nextInspection: "2025-06-05",
    description: "Toolbox with various tools",
    notes: "GOOD",
    serialNumber: "TB-2024-049",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "50",
    name: "Metal Cutter",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-11-25",
    nextInspection: "2025-05-25",
    description: "Metal cutter for cutting operations",
    notes: "GOOD",
    serialNumber: "MC-2024-050",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "51",
    name: "Power Cutter",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-12-01",
    nextInspection: "2025-06-01",
    description: "Power cutter for cutting operations",
    notes: "GOOD",
    serialNumber: "PC-2024-051",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
  {
    id: "52",
    name: "Recipro",
    category: "logistics",
    quantity: 1,
    available: 1,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "Logistics Storage",
    lastInspection: "2024-11-15",
    nextInspection: "2025-05-15",
    description: "Reciprocating saw for cutting operations",
    notes: "GOOD",
    serialNumber: "R-2024-052",
    thresholds: { excellent: 2, good: 1, fair: 1 },
    maintenanceHistory: [],
    deploymentHistory: [],
  },
]

export default function InventoryIndex() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCondition, setFilterCondition] = useState<string>("all")
  const currentTime = useRealTimeClock()
  const [showCategoryDetail, setShowCategoryDetail] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null)
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null)
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(equipmentData)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [showDeploymentModal, setShowDeploymentModal] = useState(false)
  const [showAddMaintenanceForm, setShowAddMaintenanceForm] = useState(false)
  const [showAddDeploymentForm, setShowAddDeploymentForm] = useState(false)
  const [newMaintenanceRecord, setNewMaintenanceRecord] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "",
    description: "",
    technician: "",
  })
  const [newDeploymentRecord, setNewDeploymentRecord] = useState({
    date: new Date().toISOString().split("T")[0],
    user: "",
    purpose: "",
  })

  const [showBulkDeploymentModal, setShowBulkDeploymentModal] = useState(false)
  const [showBulkMaintenanceModal, setShowBulkMaintenanceModal] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [bulkDeploymentData, setBulkDeploymentData] = useState({
    user: "",
    purpose: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [bulkMaintenanceData, setBulkMaintenanceData] = useState({
    technician: "",
    type: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Success notification state
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Function to show success notification
  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setShowSuccessNotification(true)
  }

  // Categories based on the provided images
  const categories = [
    {
      id: "rescue",
      name: "Rescue Equipment",
      icon: "rescue",
    },
    {
      id: "medical",
      name: "Medical Equipment",
      icon: "medical",
    },
    {
      id: "tools",
      name: "Tools & Equipment",
      icon: "tools",
    },
    {
      id: "shelter",
      name: "Shelter & Supply",
      icon: "shelter",
    },
    {
      id: "safety",
      name: "Safety Equipment",
      icon: "safety",
    },
    {
      id: "logistics",
      name: "Logistics Equipment",
      icon: "logistics",
    },
  ]

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCondition = filterCondition === "all" ? true : item.condition === filterCondition

    return matchesCategory && matchesSearch && matchesCondition
  })

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

  const getStatusIcon = (available: number, total: number) => {
    const percentage = (available / total) * 100
    if (percentage >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (percentage >= 50) return <Clock className="w-4 h-4 text-yellow-600" />
    return <AlertTriangle className="w-4 h-4 text-red-600" />
  }

  const renderIcon = (categoryId: string) => {
    const iconMap: Record<string, string> = {
      rescue: "👥",
      medical: "🏥",
      tools: "⚙️",
      shelter: "🏠",
      safety: "🦺",
      logistics: "🚛",
    }

    return (
      <div className="w-20 h-20 flex items-center justify-center">
        <div className="text-4xl text-[#1B2560]">{iconMap[categoryId] || "📦"}</div>
      </div>
    )
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setShowCategoryDetail(true)
  }

  const handleItemClick = (item: EquipmentItem) => {
    setSelectedItem(item)
    setShowDetailModal(true)
  }

  const handleBackToMain = () => {
    setShowCategoryDetail(false)
    setSelectedCategory(null)
  }

  const generateItemCode = (category: string, index: number) => {
    const categoryPrefixes: Record<string, string> = {
      rescue: "RES",
      medical: "MED",
      tools: "TOL",
      shelter: "SHE",
      safety: "SAF",
      logistics: "LOG",
    }
    return `${categoryPrefixes[category] || "ITM"}-${String(index + 1).padStart(3, "0")}`
  }

  const handleEditClick = (item: EquipmentItem, event: React.MouseEvent) => {
    event.stopPropagation()
    setEditingItem(item)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingItem(null)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedItem(null)
  }

  const getAutomaticCondition = (
    quantity: number,
    thresholds: { excellent: number; good: number; fair: number },
  ): "Excellent" | "Good" | "Fair" | "Poor" | "Unserviceable" => {
    if (quantity === 0) return "Unserviceable"
    if (quantity >= thresholds.excellent) return "Excellent"
    if (quantity >= thresholds.good) return "Good"
    if (quantity >= thresholds.fair) return "Fair"
    return "Poor"
  }

  const handleApplyChanges = () => {
    if (!editingItem) return

    const updatedList = equipmentList.map((item) => (item.id === editingItem.id ? { ...editingItem } : item))
    setEquipmentList(updatedList)

    setShowEditModal(false)
    setEditingItem(null)
  }

  const handleAddMaintenanceRecord = () => {
    if (
      !editingItem ||
      !newMaintenanceRecord.type ||
      !newMaintenanceRecord.description ||
      !newMaintenanceRecord.technician
    ) {
      alert("Please fill in all required fields")
      return
    }

    const updatedItem = {
      ...editingItem,
      maintenanceHistory: [...(editingItem.maintenanceHistory || []), { ...newMaintenanceRecord }],
    }

    setEditingItem(updatedItem)

    const updatedList = equipmentList.map((item) => (item.id === editingItem.id ? updatedItem : item))
    setEquipmentList(updatedList)

    setNewMaintenanceRecord({
      date: new Date().toISOString().split("T")[0],
      type: "",
      description: "",
      technician: "",
    })
    setShowAddMaintenanceForm(false)
  }

  const handleAddDeploymentRecord = () => {
    if (!editingItem || !newDeploymentRecord.user || !newDeploymentRecord.purpose) {
      alert("Please fill in all required fields")
      return
    }

    const deploymentQuantity = 1

    if (editingItem.available < deploymentQuantity) {
      alert("Not enough items available for deployment")
      return
    }

    const updatedItem = {
      ...editingItem,
      available: editingItem.available - deploymentQuantity,
      inUse: editingItem.inUse + deploymentQuantity,
      deploymentHistory: [...(editingItem.deploymentHistory || []), { ...newDeploymentRecord }],
    }

    setEditingItem(updatedItem)

    const updatedList = equipmentList.map((item) => (item.id === editingItem.id ? updatedItem : item))
    setEquipmentList(updatedList)

    setNewDeploymentRecord({
      date: new Date().toISOString().split("T")[0],
      user: "",
      purpose: "",
    })
    setShowAddDeploymentForm(false)
  }

  const [bulkDeploymentSearchTerm, setBulkDeploymentSearchTerm] = useState("")
  const [bulkMaintenanceSearchTerm, setBulkMaintenanceSearchTerm] = useState("")

  const handleBulkDeployment = () => {
    if (!bulkDeploymentData.user || !bulkDeploymentData.purpose || selectedItems.length === 0) {
      alert("Please fill in all required fields and select at least one item")
      return
    }

    const updatedList = equipmentList.map((item) => {
      if (selectedItems.includes(item.id) && item.available > 0) {
        const deploymentQuantity = Math.min(1, item.available)
        const newDeploymentRecord = {
          date: bulkDeploymentData.date,
          user: bulkDeploymentData.user,
          purpose: bulkDeploymentData.purpose,
        }

        return {
          ...item,
          available: item.available - deploymentQuantity,
          inUse: item.inUse + deploymentQuantity,
          deploymentHistory: [...(item.deploymentHistory || []), newDeploymentRecord],
        }
      }
      return item
    })

    setEquipmentList(updatedList)
    setSelectedItems([])
    setBulkDeploymentData({
      user: "",
      purpose: "",
      date: new Date().toISOString().split("T")[0],
    })
    setShowBulkDeploymentModal(false)
    setBulkDeploymentSearchTerm("")

    // Show success notification
    showSuccess(
      `Successfully deployed ${selectedItems.length} equipment items to ${bulkDeploymentData.user} for ${bulkDeploymentData.purpose}.`,
    )
  }

  const handleBulkMaintenance = () => {
    if (
      !bulkMaintenanceData.technician ||
      !bulkMaintenanceData.type ||
      !bulkMaintenanceData.description ||
      selectedItems.length === 0
    ) {
      alert("Please fill in all required fields and select at least one item")
      return
    }

    const updatedList = equipmentList.map((item) => {
      if (selectedItems.includes(item.id) && item.available > 0) {
        const maintenanceQuantity = Math.min(1, item.available)
        const newMaintenanceRecord = {
          date: bulkMaintenanceData.date,
          type: bulkMaintenanceData.type,
          description: bulkMaintenanceData.description,
          technician: bulkMaintenanceData.technician,
        }

        return {
          ...item,
          available: item.available - maintenanceQuantity,
          maintenance: item.maintenance + maintenanceQuantity,
          maintenanceHistory: [...(item.maintenanceHistory || []), newMaintenanceRecord],
        }
      }
      return item
    })

    setEquipmentList(updatedList)
    const itemCount = selectedItems.length
    const technicianName = bulkMaintenanceData.technician
    const maintenanceType = bulkMaintenanceData.type

    setSelectedItems([])
    setBulkMaintenanceData({
      technician: "",
      type: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
    setShowBulkMaintenanceModal(false)
    setBulkMaintenanceSearchTerm("")

    // Show success notification
    showSuccess(
      `Successfully scheduled ${maintenanceType.toLowerCase()} maintenance for ${itemCount} equipment items. Assigned to ${technicianName}.`,
    )
  }

  const renderDetailModal = () => {
    if (!showDetailModal || !selectedItem) return null

    const itemCode = generateItemCode(
      selectedItem.category,
      equipmentList
        .filter((item) => item.category === selectedItem.category)
        .findIndex((item) => item.id === selectedItem.id),
    )

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-[#1B2560]" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedItem.name}</h2>
                <p className="text-sm text-gray-600 capitalize">{selectedItem.category} Equipment</p>
              </div>
            </div>
            <button onClick={handleCloseDetailModal} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="w-full h-80 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="text-8xl mb-4">
                      {selectedItem.category === "safety" && selectedItem.name.toLowerCase().includes("vest")
                        ? "🦺"
                        : selectedItem.category === "rescue" && selectedItem.name.toLowerCase().includes("helmet")
                          ? "⛑️"
                          : selectedItem.category === "medical"
                            ? "🏥"
                            : selectedItem.category === "tools"
                              ? "🔧"
                              : selectedItem.category === "shelter"
                                ? "🏠"
                                : selectedItem.category === "logistics"
                                  ? "⚙️"
                                  : "📦"}
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Item Code</label>
                      <p className="text-sm text-gray-900 font-mono">{itemCode}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                      <p className="text-sm text-gray-900 font-mono">{selectedItem.serialNumber || "N/A"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="text-sm text-gray-900 capitalize">{selectedItem.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Condition</label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(
                          selectedItem.condition,
                        )}`}
                      >
                        {selectedItem.condition}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedItem.location}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Used</label>
                      <p className="text-sm text-gray-900">{selectedItem.lastUsed || "Never"}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{selectedItem.description}</p>
                  </div>
                  {selectedItem.notes && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="text-sm text-gray-900">{selectedItem.notes}</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Quantity & Availability
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedItem.quantity}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedItem.available}</div>
                      <div className="text-sm text-gray-600">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedItem.inUse}</div>
                      <div className="text-sm text-gray-600">In Use</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{selectedItem.maintenance}</div>
                      <div className="text-sm text-gray-600">Maintenance</div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Inspection Schedule
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Inspection</label>
                      <p className="text-sm text-gray-900">{selectedItem.lastInspection}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Next Inspection</label>
                      <p className="text-sm text-gray-900">{selectedItem.nextInspection}</p>
                    </div>
                  </div>
                </div>

                {selectedItem.maintenanceHistory && selectedItem.maintenanceHistory.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Maintenance History
                    </h3>
                    <div className="space-y-3">
                      {selectedItem.maintenanceHistory.map((record, index) => (
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
                )}

                {selectedItem.deploymentHistory && selectedItem.deploymentHistory.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Deployment History
                    </h3>
                    <div className="space-y-3">
                      {selectedItem.deploymentHistory.map((record, index) => (
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
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={handleCloseDetailModal}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setEditingItem(selectedItem)
                setShowDetailModal(false)
                setShowEditModal(true)
              }}
              className="px-8 py-3 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
            >
              Edit Equipment
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderEditModal = () => {
    if (!showEditModal || !editingItem) return null

    const itemCode = generateItemCode(
      editingItem.category,
      equipmentList
        .filter((item) => item.category === editingItem.category)
        .findIndex((item) => item.id === editingItem.id),
    )

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600">📦</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Edit Equipment</span>
            </div>
            <button onClick={handleCloseEditModal} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex gap-8">
              <div className="w-96 flex-shrink-0">
                <div className="w-full h-80 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="text-8xl mb-4">
                      {editingItem.category === "safety" && editingItem.name.toLowerCase().includes("vest")
                        ? "🦺"
                        : editingItem.category === "rescue" && editingItem.name.toLowerCase().includes("helmet")
                          ? "⛑️"
                          : editingItem.category === "medical"
                            ? "🏥"
                            : editingItem.category === "tools"
                              ? "🔧"
                              : editingItem.category === "shelter"
                                ? "🏠"
                                : editingItem.category === "logistics"
                                  ? "⚙️"
                                  : "📦"}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Equipment Image</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => setShowMaintenanceModal(true)}
                    className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Wrench className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Maintenance History</div>
                        <div className="text-sm text-gray-600">
                          {editingItem.maintenanceHistory?.length || 0} records
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setShowDeploymentModal(true)}
                    className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <History className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Deployment History</div>
                        <div className="text-sm text-gray-600">
                          {editingItem.deploymentHistory?.length || 0} records
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Item name:</label>
                      <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Item code:</label>
                      <input
                        type="text"
                        value={itemCode}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
                      <input
                        type="number"
                        value={editingItem.quantity.toString()}
                        onChange={(e) => {
                          const inputValue = e.target.value
                          if (inputValue === "") {
                            setEditingItem({
                              ...editingItem,
                              quantity: 0,
                              available: 0,
                              condition: getAutomaticCondition(0, editingItem.thresholds!),
                            })
                            return
                          }

                          const newQuantity = Number.parseInt(inputValue, 10)
                          if (!isNaN(newQuantity) && newQuantity >= 0) {
                            const newCondition = getAutomaticCondition(newQuantity, editingItem.thresholds!)
                            const newAvailable = Math.max(0, newQuantity - editingItem.inUse - editingItem.maintenance)
                            setEditingItem({
                              ...editingItem,
                              quantity: newQuantity,
                              available: newAvailable,
                              condition: newCondition,
                            })
                          }
                        }}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Condition:</label>
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-between">
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getConditionColor(
                            editingItem.condition,
                          )}`}
                        >
                          {editingItem.condition}
                        </span>
                        <span className="text-sm text-gray-500">(Auto-determined by quantity)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location:</label>
                      <input
                        type="text"
                        value={editingItem.location}
                        onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Status</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available:</label>
                      <input
                        type="number"
                        value={editingItem.available.toString()}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-600 text-base font-semibold"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-calculated: Total - Deployed - Maintenance ={" "}
                        {editingItem.quantity - editingItem.inUse - editingItem.maintenance}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deployed:</label>
                      <input
                        type="number"
                        value={editingItem.inUse.toString()}
                        onChange={(e) => {
                          const inputValue = e.target.value
                          if (inputValue === "") {
                            const newAvailable = editingItem.quantity - 0 - editingItem.maintenance
                            setEditingItem({ ...editingItem, inUse: 0, available: Math.max(0, newAvailable) })
                            return
                          }

                          const newInUse = Number.parseInt(inputValue, 10)
                          if (!isNaN(newInUse) && newInUse >= 0) {
                            const maxInUse = editingItem.quantity - editingItem.maintenance
                            const clampedInUse = Math.min(newInUse, maxInUse)
                            const newAvailable = editingItem.quantity - clampedInUse - editingItem.maintenance
                            setEditingItem({
                              ...editingItem,
                              inUse: clampedInUse,
                              available: Math.max(0, newAvailable),
                            })
                          }
                        }}
                        min="0"
                        max={editingItem.quantity - editingItem.maintenance}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance:</label>
                      <input
                        type="number"
                        value={editingItem.maintenance.toString()}
                        onChange={(e) => {
                          const inputValue = e.target.value
                          if (inputValue === "") {
                            const newAvailable = editingItem.quantity - editingItem.inUse - 0
                            setEditingItem({ ...editingItem, maintenance: 0, available: Math.max(0, newAvailable) })
                            return
                          }

                          const newMaintenance = Number.parseInt(inputValue, 10)
                          if (!isNaN(newMaintenance) && newMaintenance >= 0) {
                            const maxMaintenance = editingItem.quantity - editingItem.inUse
                            const clampedMaintenance = Math.min(newMaintenance, maxMaintenance)
                            const newAvailable = editingItem.quantity - editingItem.inUse - clampedMaintenance
                            setEditingItem({
                              ...editingItem,
                              maintenance: clampedMaintenance,
                              available: Math.max(0, newAvailable),
                            })
                          }
                        }}
                        min="0"
                        max={editingItem.quantity - editingItem.inUse}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Condition Thresholds (Admin Configurable):
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Excellent (≥)</label>
                      <input
                        type="number"
                        value={editingItem.thresholds?.excellent || 0}
                        onChange={(e) => {
                          const newThresholds = {
                            ...editingItem.thresholds!,
                            excellent: Number.parseInt(e.target.value) || 0,
                          }
                          const newCondition = getAutomaticCondition(editingItem.quantity, newThresholds)
                          setEditingItem({
                            ...editingItem,
                            thresholds: newThresholds,
                            condition: newCondition,
                          })
                        }}
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">Good (≥)</label>
                      <input
                        type="number"
                        value={editingItem.thresholds?.good || 0}
                        onChange={(e) => {
                          const newThresholds = {
                            ...editingItem.thresholds!,
                            good: Number.parseInt(e.target.value) || 0,
                          }
                          const newCondition = getAutomaticCondition(editingItem.quantity, newThresholds)
                          setEditingItem({
                            ...editingItem,
                            thresholds: newThresholds,
                            condition: newCondition,
                          })
                        }}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-yellow-700 mb-2">Fair (≥)</label>
                      <input
                        type="number"
                        value={editingItem.thresholds?.fair || 0}
                        onChange={(e) => {
                          const newThresholds = {
                            ...editingItem.thresholds!,
                            fair: Number.parseInt(e.target.value) || 0,
                          }
                          const newCondition = getAutomaticCondition(editingItem.quantity, newThresholds)
                          setEditingItem({
                            ...editingItem,
                            thresholds: newThresholds,
                            condition: newCondition,
                          })
                        }}
                        className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-base"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 bg-white p-3 rounded-md border border-gray-200">
                    <strong>Note:</strong> Set custom thresholds for this item. Below Fair = Poor, 0 = Unserviceable
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
                  <textarea
                    value={editingItem.notes || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                    placeholder="Add any additional notes about this equipment..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={handleCloseEditModal}
              className="px-8 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyChanges}
              className="px-8 py-3 bg-[#1B2560] text-white rounded-lg hover:bg-[#2A3B70] transition-colors font-medium shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderMaintenanceHistoryModal = () => {
    if (!showMaintenanceModal || !editingItem) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Wrench className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Maintenance History</h2>
                <p className="text-sm text-gray-600">{editingItem.name}</p>
              </div>
            </div>
            <button
              onClick={() => setShowMaintenanceModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {editingItem.maintenanceHistory && editingItem.maintenanceHistory.length > 0 ? (
              <div className="space-y-4">
                {editingItem.maintenanceHistory.map((record, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{record.type}</h3>
                      <span className="text-sm text-gray-500">{record.date}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{record.description}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Technician: {record.technician}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Maintenance Records</h3>
                <p className="text-gray-600 mb-4">This equipment has no maintenance history yet.</p>
              </div>
            )}
          </div>

          <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={() => setShowMaintenanceModal(false)}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setShowAddMaintenanceForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Maintenance Record
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderDeploymentHistoryModal = () => {
    if (!showDeploymentModal || !editingItem) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <History className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Deployment History</h2>
                <p className="text-sm text-gray-600">{editingItem.name}</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeploymentModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {editingItem.deploymentHistory && editingItem.deploymentHistory.length > 0 ? (
              <div className="space-y-4">
                {editingItem.deploymentHistory.map((record, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{record.user}</h3>
                      <span className="text-sm text-gray-500">{record.date}</span>
                    </div>
                    <p className="text-gray-700 mb-2">Purpose: {record.purpose}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Deployed: {record.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Deployment Records</h3>
                <p className="text-gray-600 mb-4">This equipment has no deployment history yet.</p>
              </div>
            )}
          </div>

          <div className="flex justify-between p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={() => setShowDeploymentModal(false)}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setShowAddDeploymentForm(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add Deployment Record
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderAddMaintenanceForm = () => {
    if (!showAddMaintenanceForm) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add Maintenance Record</h3>
            <button onClick={() => setShowAddMaintenanceForm(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newMaintenanceRecord.date}
                onChange={(e) => setNewMaintenanceRecord({ ...newMaintenanceRecord, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={newMaintenanceRecord.type}
                onChange={(e) => setNewMaintenanceRecord({ ...newMaintenanceRecord, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select type...</option>
                <option value="Inspection">Inspection</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Repair">Repair</option>
                <option value="Replacement">Replacement</option>
                <option value="Calibration">Calibration</option>
                <option value="Testing">Testing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={newMaintenanceRecord.description}
                onChange={(e) => setNewMaintenanceRecord({ ...newMaintenanceRecord, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the maintenance performed..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technician *</label>
              <input
                type="text"
                value={newMaintenanceRecord.technician}
                onChange={(e) => setNewMaintenanceRecord({ ...newMaintenanceRecord, technician: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Technician name..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowAddMaintenanceForm(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMaintenanceRecord}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Record
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderAddDeploymentForm = () => {
    if (!showAddDeploymentForm) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add Deployment Record</h3>
            <button onClick={() => setShowAddDeploymentForm(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deployment Date</label>
              <input
                type="date"
                value={newDeploymentRecord.date}
                onChange={(e) => setNewDeploymentRecord({ ...newDeploymentRecord, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Response Team/Unit *</label>
              <input
                type="text"
                value={newDeploymentRecord.user}
                onChange={(e) => setNewDeploymentRecord({ ...newDeploymentRecord, user: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Response team or unit name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mission/Operation Purpose *</label>
              <textarea
                value={newDeploymentRecord.purpose}
                onChange={(e) => setNewDeploymentRecord({ ...newDeploymentRecord, purpose: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Purpose of deployment..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowAddDeploymentForm(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddDeploymentRecord}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Record
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderBulkDeploymentModal = () => {
    if (!showBulkDeploymentModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Bulk Equipment Deployment</h2>
            <button onClick={() => setShowBulkDeploymentModal(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Deployment Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response Team/Unit *</label>
                  <input
                    type="text"
                    value={bulkDeploymentData.user}
                    onChange={(e) => setBulkDeploymentData({ ...bulkDeploymentData, user: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter response team or unit name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mission/Operation Purpose *</label>
                  <textarea
                    value={bulkDeploymentData.purpose}
                    onChange={(e) => setBulkDeploymentData({ ...bulkDeploymentData, purpose: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the mission or operation purpose..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deployment Date</label>
                  <input
                    type="date"
                    value={bulkDeploymentData.date}
                    onChange={(e) => setBulkDeploymentData({ ...bulkDeploymentData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Equipment ({selectedItems.length} selected)
                </h3>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={bulkDeploymentSearchTerm}
                    onChange={(e) => setBulkDeploymentSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div className="h-96 overflow-y-auto border border-gray-200 rounded-md">
                  {equipmentList
                    .filter((item) => item.available > 0)
                    .filter((item) =>
                      bulkDeploymentSearchTerm
                        ? item.name.toLowerCase().includes(bulkDeploymentSearchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(bulkDeploymentSearchTerm.toLowerCase()) ||
                          (item.location &&
                            item.location.toLowerCase().includes(bulkDeploymentSearchTerm.toLowerCase())) ||
                          (item.serialNumber &&
                            item.serialNumber.toLowerCase().includes(bulkDeploymentSearchTerm.toLowerCase()))
                        : true,
                    )
                    .map((item) => (
                      <div key={item.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, item.id])
                              } else {
                                setSelectedItems(selectedItems.filter((id) => id !== item.id))
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">
                              Available: {item.available} | Location: {item.location}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowBulkDeploymentModal(false)}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDeployment}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Deploy Selected Items ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderBulkMaintenanceModal = () => {
    if (!showBulkMaintenanceModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Bulk Equipment Maintenance</h2>
            <button onClick={() => setShowBulkMaintenanceModal(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Maintenance Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technician *</label>
                  <input
                    type="text"
                    value={bulkMaintenanceData.technician}
                    onChange={(e) => setBulkMaintenanceData({ ...bulkMaintenanceData, technician: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter technician name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Type *</label>
                  <select
                    value={bulkMaintenanceData.type}
                    onChange={(e) => setBulkMaintenanceData({ ...bulkMaintenanceData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select type...</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Repair">Repair</option>
                    <option value="Replacement">Replacement</option>
                    <option value="Calibration">Calibration</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={bulkMaintenanceData.description}
                    onChange={(e) => setBulkMaintenanceData({ ...bulkMaintenanceData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Describe the maintenance to be performed..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Date</label>
                  <input
                    type="date"
                    value={bulkMaintenanceData.date}
                    onChange={(e) => setBulkMaintenanceData({ ...bulkMaintenanceData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Equipment ({selectedItems.length} selected)
                </h3>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={bulkMaintenanceSearchTerm}
                    onChange={(e) => setBulkMaintenanceSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  />
                </div>
                <div className="h-96 overflow-y-auto border border-gray-200 rounded-md">
                  {equipmentList
                    .filter((item) => item.available > 0)
                    .filter((item) =>
                      bulkMaintenanceSearchTerm
                        ? item.name.toLowerCase().includes(bulkMaintenanceSearchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(bulkMaintenanceSearchTerm.toLowerCase()) ||
                          (item.location &&
                            item.location.toLowerCase().includes(bulkMaintenanceSearchTerm.toLowerCase())) ||
                          (item.serialNumber &&
                            item.serialNumber.toLowerCase().includes(bulkMaintenanceSearchTerm.toLowerCase()))
                        : true,
                    )
                    .map((item) => (
                      <div key={item.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, item.id])
                              } else {
                                setSelectedItems(selectedItems.filter((id) => id !== item.id))
                              }
                            }}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">
                              Available: {item.available} | Location: {item.location}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowBulkMaintenanceModal(false)}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkMaintenance}
              className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Schedule Maintenance ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderCategoryDetailView = () => {
    if (!selectedCategory) return null

    const categoryEquipment = equipmentList.filter((item) => item.category === selectedCategory)
    const categoryName = categories.find((c) => c.id === selectedCategory)?.name || "Equipment"

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-40 bg-[#1B2560] border-b border-gray-300 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3">
              <button onClick={handleBackToMain} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Package className="w-6 h-6 text-white" />
              <h1 className="text-xl font-semibold text-white">{categoryName}</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#A8D0F0] px-6 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-sm font-bold text-[#1B2560] uppercase">Item name</div>
                <div className="text-sm font-bold text-[#1B2560] uppercase">Item code</div>
                <div className="text-sm font-bold text-[#1B2560] uppercase">Quantity</div>
                <div className="text-sm font-bold text-[#1B2560] uppercase">Actions</div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {categoryEquipment.map((item, index) => (
                <div
                  key={item.id}
                  className={`px-6 py-4 grid grid-cols-4 gap-4 items-center ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F0F8FF]"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-700">{generateItemCode(item.category, index)}</div>
                  <div className="text-sm text-gray-700">{item.quantity}</div>
                  <div>
                    <button
                      onClick={(e) => handleEditClick(item, e)}
                      className="px-4 py-2 bg-[#1B2560] text-white text-sm font-medium rounded-md hover:bg-[#2A3B70] transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {categoryEquipment.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment found</h3>
                <p className="mt-1 text-sm text-gray-500">No items in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [newItem, setNewItem] = useState<Omit<EquipmentItem, "id">>({
    name: "",
    category: "rescue",
    quantity: 0,
    available: 0,
    inUse: 0,
    maintenance: 0,
    condition: "Good",
    location: "",
    lastInspection: new Date().toISOString().split("T")[0],
    nextInspection: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0],
    serialNumber: "",
    description: "",
    notes: "",
    lastUsed: "",
    thresholds: {
      excellent: 10,
      good: 5,
      fair: 2,
    },
    maintenanceHistory: [],
    deploymentHistory: [],
  })

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.location) {
      alert("Please fill in all required fields")
      return
    }

    const newId = String(equipmentList.length + 1)
    const newItemWithId: EquipmentItem = { id: newId, ...newItem }

    setEquipmentList([...equipmentList, newItemWithId])
    setNewItem({
      name: "",
      category: "rescue",
      quantity: 0,
      available: 0,
      inUse: 0,
      maintenance: 0,
      condition: "Good",
      location: "",
      lastInspection: new Date().toISOString().split("T")[0],
      nextInspection: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split("T")[0],
      serialNumber: "",
      description: "",
      notes: "",
      lastUsed: "",
      thresholds: {
        excellent: 10,
        good: 5,
        fair: 2,
      },
      maintenanceHistory: [],
      deploymentHistory: [],
    })
    setShowAddItemModal(false)

    showSuccess(`Successfully added new equipment item: ${newItemWithId.name}.`)
  }

  const renderAddItemModal = () => {
    if (!showAddItemModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-[#1B2560]" />
              <span className="text-lg font-semibold text-gray-900">Add New Equipment</span>
            </div>
            <button
              onClick={() => setShowAddItemModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter equipment name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      category: e.target.value as "rescue" | "medical" | "tools" | "shelter" | "safety" | "logistics",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="rescue">Rescue Equipment</option>
                  <option value="medical">Medical Equipment</option>
                  <option value="tools">Tools & Equipment</option>
                  <option value="shelter">Shelter & Supply</option>
                  <option value="safety">Safety Equipment</option>
                  <option value="logistics">Logistics Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: Number(e.target.value), available: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quantity..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter location..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                <input
                  type="text"
                  value={newItem.serialNumber}
                  onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter serial number..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Inspection Date</label>
                <input
                  type="date"
                  value={newItem.lastInspection}
                  onChange={(e) => setNewItem({ ...newItem, lastInspection: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Inspection Date</label>
                <input
                  type="date"
                  value={newItem.nextInspection}
                  onChange={(e) => setNewItem({ ...newItem, nextInspection: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter notes..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={() => setShowAddItemModal(false)}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              className="px-6 py-3 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
            >
              Add Equipment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SuccessNotification
        show={showSuccessNotification}
        message={successMessage}
        onClose={() => setShowSuccessNotification(false)}
      />

      {showCategoryDetail ? (
        renderCategoryDetailView()
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="sticky top-0 z-40 bg-[#1B2560] border-b border-gray-300 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-white" />
                  <h1 className="text-xl font-semibold text-white">Emergency Equipment Inventory</h1>
                </div>
                <div className="text-sm font-mono text-white">{currentTime}</div>
              </div>
              <div className="mt-2 text-sm text-gray-300">CDRRMO Staff Portal › Equipment Management</div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Categories grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {categories.map((category) => {
                const categoryCount = equipmentList.filter((item) => item.category === category.id).length

                return (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`bg-[#E8F4FD] border-2 border-gray-300 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-[#1B2560] hover:scale-105 ${
                      selectedCategory === category.id ? "ring-2 ring-[#1B2560] border-[#1B2560] shadow-md" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="text-[#1B2560] mb-2">{renderIcon(category.id)}</div>
                      <h3 className="text-lg font-bold text-[#1B2560]">{category.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{categoryCount} items</p>
                    </div>
                  </div>
                )
              })}
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
                <button
                  onClick={() => {
                    setSelectedItems([])
                    setShowBulkDeploymentModal(true)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Bulk Deployment
                </button>
                <button
                  onClick={() => {
                    setSelectedItems([])
                    setShowBulkMaintenanceModal(true)
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Wrench className="w-4 h-4" />
                  Bulk Maintenance
                </button>
                <button
                  onClick={() => setShowAddItemModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
            </div>

            {/* Equipment table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Equipment Inventory
                    {selectedCategory && (
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        - {categories.find((c) => c.id === selectedCategory)?.name}
                      </span>
                    )}
                  </h2>
                  <span className="text-sm text-gray-600">
                    {filteredEquipment.length} of {equipmentList.length} items
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
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
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEquipment.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                            {item.serialNumber && (
                              <div className="text-xs text-gray-400 mt-1">S/N: {item.serialNumber}</div>
                            )}
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
                              Available: {item.available} | Deployed: {item.inUse}
                              {item.maintenance > 0 && ` | Maintenance: ${item.maintenance}`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(
                              item.condition,
                            )}`}
                          >
                            {item.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{item.notes ? item.notes : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEquipment.length === 0 && (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
              {filteredEquipment.length > 0 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    💡 Click on any equipment row to view detailed information, maintenance history, and deployment
                    records.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {renderDetailModal()}
      {renderEditModal()}
      {renderMaintenanceHistoryModal()}
      {renderDeploymentHistoryModal()}
      {renderAddMaintenanceForm()}
      {renderAddDeploymentForm()}
      {renderBulkDeploymentModal()}
      {renderBulkMaintenanceModal()}
      {renderAddItemModal()}
    </>
  )
}

InventoryIndex.layout = (e: React.JSX.Element) => <Authenticated children={e} />
