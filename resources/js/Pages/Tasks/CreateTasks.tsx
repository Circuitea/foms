"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ClipboardList, Plus, Users, FileText, AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"

interface Task {
  id: string
  title: string
  description: string
  type: "Emergency Response" | "Maintenance" | "Training" | "Assessment" | "Patrol" | "Meeting" | "Equipment Check"
  priority: "urgent" | "high" | "normal" | "low"
  status: "pending" | "in-progress" | "on-hold" | "completed" | "cancelled"
  assignedTo: string[]
  assignedBy: string
  department: string
  location: string
  dueDate: string
  createdAt: string
  completedAt?: string
  estimatedDuration: string
  requiredResources: string[]
  notes: string[]
}

interface Personnel {
  id: string
  name: string
  role: string
  department: string
  contact: string
  status: "available" | "busy" | "off-duty"
  currentTasks: number
}

interface TaskTemplate {
  id: string
  name: string
  type: string
  title: string
  description: string
  priority: "urgent" | "high" | "normal" | "low"
  estimatedDuration: string
  requiredResources: string[]
  department: string
}

export default function TaskManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [tasks, setTasks] = useState<Task[]>([])
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [templates, setTemplates] = useState<TaskTemplate[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [showEditTaskModal, setShowEditTaskModal] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false)
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false)
  const [showUseTemplateModal, setShowUseTemplateModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<TaskTemplate | null>(null)
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({})

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "Emergency Response",
    title: "",
    description: "",
    priority: "normal" as const,
    estimatedDuration: "",
    requiredResources: [] as string[],
    department: "Operations",
  })

  // Form states
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    type: "Emergency Response" as const,
    priority: "normal" as const,
    assignedTo: [] as string[],
    department: "Operations",
    location: "",
    dueDate: "",
    estimatedDuration: "",
    requiredResources: [] as string[],
  })

  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<TaskTemplate | null>(null)
  const [showEditPersonnelModal, setShowEditPersonnelModal] = useState(false)
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false)
  const [showRemovePersonnelModal, setShowRemovePersonnelModal] = useState(false)
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null)
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null)
  const [personnelToRemove, setPersonnelToRemove] = useState<Personnel | null>(null)

  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  useEffect(() => {
    loadSampleData()
  }, [])

  const loadSampleData = () => {
    // Sample tasks
    const sampleTasks: Task[] = [
      {
        id: "1",
        title: "Flood Response - Barangay Greenhills",
        description:
          "Deploy emergency response team to assist with flood evacuation and rescue operations in Barangay Greenhills.",
        type: "Emergency Response",
        priority: "urgent",
        status: "in-progress",
        assignedTo: ["1", "2"],
        assignedBy: "Operations Chief Martinez",
        department: "Emergency Operations",
        location: "Barangay Greenhills",
        dueDate: "2024-01-15T18:00:00Z",
        createdAt: "2024-01-15T08:30:00Z",
        estimatedDuration: "6 hours",
        requiredResources: ["Rescue boats", "Life vests", "Communication radios", "First aid kits"],
        notes: ["Team deployed at 08:45", "15 residents evacuated", "Water level rising"],
      },
      {
        id: "2",
        title: "Equipment Maintenance - Rescue Vehicle Unit 3",
        description:
          "Perform scheduled maintenance on Rescue Vehicle Unit 3 including engine check and equipment inventory.",
        type: "Maintenance",
        priority: "normal",
        status: "pending",
        assignedTo: ["4"],
        assignedBy: "Fleet Manager",
        department: "Vehicle Maintenance",
        location: "CDRRMO Motor Pool",
        dueDate: "2024-01-16T16:00:00Z",
        createdAt: "2024-01-15T09:15:00Z",
        estimatedDuration: "4 hours",
        requiredResources: ["Maintenance tools", "Replacement parts", "Diagnostic equipment"],
        notes: [],
      },
      {
        id: "3",
        title: "Risk Assessment - Little Baguio Area",
        description: "Conduct geological risk assessment in Little Baguio area following recent landslide warnings.",
        type: "Assessment",
        priority: "high",
        status: "in-progress",
        assignedTo: ["5"],
        assignedBy: "Risk Assessment Chief",
        department: "Risk Assessment Unit",
        location: "Barangay Little Baguio",
        dueDate: "2024-01-17T12:00:00Z",
        createdAt: "2024-01-15T10:00:00Z",
        estimatedDuration: "8 hours",
        requiredResources: ["Geological equipment", "Safety gear", "Documentation materials"],
        notes: ["Initial survey completed", "Soil samples collected"],
      },
      {
        id: "4",
        title: "Weekly Team Training - Water Rescue",
        description: "Conduct weekly water rescue training for Emergency Response Team Alpha and Bravo.",
        type: "Training",
        priority: "normal",
        status: "completed",
        assignedTo: ["1", "2", "3"],
        assignedBy: "Training Coordinator",
        department: "Training Division",
        location: "CDRRMO Training Facility",
        dueDate: "2024-01-14T16:00:00Z",
        createdAt: "2024-01-14T08:00:00Z",
        completedAt: "2024-01-14T15:30:00Z",
        estimatedDuration: "4 hours",
        requiredResources: ["Training equipment", "Safety gear", "Training materials"],
        notes: ["All personnel attended", "Skills assessment completed", "Certification updated"],
      },
    ]

    // Sample personnel
    const samplePersonnel: Personnel[] = [
      {
        id: "1",
        name: "Team Alpha Leader",
        role: "Team Leader",
        department: "Emergency Response",
        contact: "(02) 8-725-1002",
        status: "busy",
        currentTasks: 2,
      },
      {
        id: "2",
        name: "Rescue Specialist Santos",
        role: "Rescue Specialist",
        department: "Emergency Response",
        contact: "(02) 8-725-1003",
        status: "busy",
        currentTasks: 1,
      },
      {
        id: "3",
        name: "Medical Officer Cruz",
        role: "Medical Officer",
        department: "Medical Unit",
        contact: "(02) 8-725-1004",
        status: "available",
        currentTasks: 0,
      },
      {
        id: "4",
        name: "Mechanic Reyes",
        role: "Vehicle Mechanic",
        department: "Vehicle Maintenance",
        contact: "(02) 8-725-1005",
        status: "available",
        currentTasks: 1,
      },
      {
        id: "5",
        name: "Geologist Dr. Fernandez",
        role: "Risk Assessment Specialist",
        department: "Risk Assessment Unit",
        contact: "(02) 8-725-1006",
        status: "busy",
        currentTasks: 1,
      },
    ]

    // Expanded sample templates
    const sampleTemplates: TaskTemplate[] = [
      {
        id: "1",
        name: "Flood Response Deployment",
        type: "Emergency Response",
        title: "Flood Response - {LOCATION}",
        description:
          "Deploy emergency response team to {LOCATION} for flood response operations. Coordinate with local Barangay officials and assess situation.",
        priority: "urgent",
        estimatedDuration: "6 hours",
        requiredResources: ["Rescue boats", "Life vests", "Communication radios", "First aid kits"],
        department: "Emergency Operations",
      },
      {
        id: "2",
        name: "Vehicle Maintenance Check",
        type: "Maintenance",
        title: "Equipment Maintenance - {VEHICLE}",
        description:
          "Perform scheduled maintenance on {VEHICLE} including engine check, equipment inventory, and safety inspection.",
        priority: "normal",
        estimatedDuration: "4 hours",
        requiredResources: ["Maintenance tools", "Replacement parts", "Diagnostic equipment"],
        department: "Vehicle Maintenance",
      },
      {
        id: "3",
        name: "Risk Assessment Survey",
        type: "Assessment",
        title: "Risk Assessment - {AREA}",
        description:
          "Conduct comprehensive risk assessment in {AREA} including geological survey and hazard identification.",
        priority: "high",
        estimatedDuration: "8 hours",
        requiredResources: ["Assessment equipment", "Safety gear", "Documentation materials"],
        department: "Risk Assessment Unit",
      },
      {
        id: "4",
        name: "Fire Emergency Response",
        type: "Emergency Response",
        title: "Fire Response - {LOCATION}",
        description:
          "Immediate fire response deployment to {LOCATION}. Coordinate with Bureau of Fire Protection and establish incident command post. Ensure civilian evacuation and provide emergency medical support.",
        priority: "urgent",
        estimatedDuration: "4 hours",
        requiredResources: [
          "Fire suppression equipment",
          "Medical supplies",
          "Evacuation vehicles",
          "Communication devices",
          "Safety barriers",
        ],
        department: "Emergency Operations",
      },
      {
        id: "5",
        name: "Earthquake Response Protocol",
        type: "Emergency Response",
        title: "Earthquake Response - Magnitude {MAGNITUDE}",
        description:
          "Activate earthquake response protocol for magnitude {MAGNITUDE} earthquake. Deploy search and rescue teams, establish emergency shelters, and coordinate with regional disaster management council.",
        priority: "urgent",
        estimatedDuration: "12 hours",
        requiredResources: [
          "Search and rescue equipment",
          "Emergency shelters",
          "Medical supplies",
          "Heavy machinery",
          "Communication systems",
        ],
        department: "Emergency Operations",
      },
      {
        id: "6",
        name: "Medical Emergency Response",
        type: "Emergency Response",
        title: "Medical Emergency - {TYPE}",
        description:
          "Deploy medical emergency response team for {TYPE} incident. Provide immediate medical assistance, coordinate with hospitals, and ensure proper patient transport.",
        priority: "urgent",
        estimatedDuration: "3 hours",
        requiredResources: ["Medical equipment", "Ambulances", "Medical personnel", "Emergency medications"],
        department: "Medical Unit",
      },
      {
        id: "7",
        name: "Search and Rescue Operation",
        type: "Emergency Response",
        title: "Search and Rescue - {LOCATION}",
        description:
          "Conduct search and rescue operation in {LOCATION}. Deploy specialized rescue teams, establish command center, and coordinate with other emergency services.",
        priority: "urgent",
        estimatedDuration: "8 hours",
        requiredResources: [
          "Rescue equipment",
          "Search dogs",
          "Communication radios",
          "Medical supplies",
          "Transportation vehicles",
        ],
        department: "Emergency Operations",
      },
      {
        id: "8",
        name: "Evacuation Procedure",
        type: "Emergency Response",
        title: "Evacuation - {AREA} to {DESTINATION}",
        description:
          "Execute evacuation procedure for residents of {AREA} to {DESTINATION}. Coordinate transportation, ensure safety protocols, and maintain communication with evacuees.",
        priority: "high",
        estimatedDuration: "6 hours",
        requiredResources: [
          "Transportation vehicles",
          "Communication devices",
          "Emergency supplies",
          "Security personnel",
        ],
        department: "Emergency Operations",
      },
      {
        id: "9",
        name: "Equipment Inspection Routine",
        type: "Equipment Check",
        title: "Monthly Inspection - {EQUIPMENT_TYPE}",
        description:
          "Conduct monthly inspection of {EQUIPMENT_TYPE}. Check functionality, perform maintenance, update inventory records, and report any deficiencies.",
        priority: "normal",
        estimatedDuration: "3 hours",
        requiredResources: [
          "Inspection checklists",
          "Maintenance tools",
          "Replacement parts",
          "Documentation materials",
        ],
        department: "Operations",
      },
      {
        id: "10",
        name: "Emergency Drill Training",
        type: "Training",
        title: "{DRILL_TYPE} Emergency Drill",
        description:
          "Conduct {DRILL_TYPE} emergency drill for all personnel. Evaluate response times, assess procedures, and provide feedback for improvement.",
        priority: "normal",
        estimatedDuration: "4 hours",
        requiredResources: ["Training materials", "Stopwatches", "Evaluation forms", "Safety equipment"],
        department: "Training Division",
      },
      {
        id: "11",
        name: "Community Preparedness Program",
        type: "Training",
        title: "Community Preparedness - {BARANGAY}",
        description:
          "Conduct disaster preparedness training for residents of {BARANGAY}. Cover emergency procedures, evacuation routes, and basic first aid training.",
        priority: "normal",
        estimatedDuration: "6 hours",
        requiredResources: ["Training materials", "Projector", "First aid kits", "Educational pamphlets"],
        department: "Community Relations",
      },
      {
        id: "12",
        name: "Weather Monitoring Setup",
        type: "Assessment",
        title: "Weather Monitoring - {LOCATION}",
        description:
          "Establish weather monitoring station at {LOCATION}. Install equipment, calibrate instruments, and establish data transmission protocols.",
        priority: "high",
        estimatedDuration: "5 hours",
        requiredResources: [
          "Weather monitoring equipment",
          "Installation tools",
          "Communication devices",
          "Calibration instruments",
        ],
        department: "Weather Monitoring Unit",
      },
      {
        id: "13",
        name: "Infrastructure Assessment",
        type: "Assessment",
        title: "Infrastructure Assessment - {STRUCTURE}",
        description:
          "Conduct structural assessment of {STRUCTURE} for disaster resilience. Evaluate structural integrity, identify vulnerabilities, and recommend improvements.",
        priority: "high",
        estimatedDuration: "6 hours",
        requiredResources: ["Assessment tools", "Measuring equipment", "Documentation materials", "Safety gear"],
        department: "Engineering Unit",
      },
      {
        id: "14",
        name: "Communication System Test",
        type: "Equipment Check",
        title: "Communication Test - {SYSTEM}",
        description:
          "Test {SYSTEM} communication system functionality. Verify signal strength, check backup systems, and ensure interoperability with other agencies.",
        priority: "normal",
        estimatedDuration: "2 hours",
        requiredResources: ["Testing equipment", "Communication devices", "Technical manuals", "Backup power"],
        department: "Communications",
      },
      {
        id: "15",
        name: "Supply Inventory Management",
        type: "Assessment",
        title: "Inventory Check - {SUPPLY_TYPE}",
        description:
          "Conduct inventory assessment of {SUPPLY_TYPE} supplies. Count items, check expiration dates, and update inventory management system.",
        priority: "normal",
        estimatedDuration: "4 hours",
        requiredResources: ["Inventory sheets", "Barcode scanners", "Computer access", "Storage labels"],
        department: "Logistics",
      },
      {
        id: "16",
        name: "Inter-Agency Coordination Meeting",
        type: "Meeting",
        title: "Coordination Meeting - {TOPIC}",
        description:
          "Conduct inter-agency coordination meeting regarding {TOPIC}. Discuss protocols, share information, and establish collaborative procedures.",
        priority: "normal",
        estimatedDuration: "3 hours",
        requiredResources: ["Meeting room", "Presentation materials", "Documentation", "Communication devices"],
        department: "Operations",
      },
      {
        id: "17",
        name: "Public Information Campaign",
        type: "Training",
        title: "Information Campaign - {TOPIC}",
        description:
          "Launch public information campaign about {TOPIC}. Distribute educational materials, conduct media briefings, and engage with community leaders.",
        priority: "normal",
        estimatedDuration: "8 hours",
        requiredResources: ["Educational materials", "Media equipment", "Transportation", "Communication tools"],
        department: "Public Information",
      },
      {
        id: "18",
        name: "Hazard Mapping Survey",
        type: "Assessment",
        title: "Hazard Mapping - {AREA}",
        description:
          "Conduct hazard mapping survey in {AREA}. Identify potential risks, document geographical features, and create detailed hazard maps.",
        priority: "high",
        estimatedDuration: "10 hours",
        requiredResources: ["GPS equipment", "Surveying tools", "Mapping software", "Documentation materials"],
        department: "Risk Assessment Unit",
      },
      {
        id: "19",
        name: "Emergency Shelter Setup",
        type: "Emergency Response",
        title: "Emergency Shelter - {LOCATION}",
        description:
          "Establish emergency shelter at {LOCATION}. Set up facilities, organize supplies, and coordinate with social services for evacuee support.",
        priority: "high",
        estimatedDuration: "5 hours",
        requiredResources: ["Shelter materials", "Bedding supplies", "Food and water", "Sanitation facilities"],
        department: "Emergency Operations",
      },
      {
        id: "20",
        name: "Damage Assessment Survey",
        type: "Assessment",
        title: "Damage Assessment - {INCIDENT}",
        description:
          "Conduct post-incident damage assessment for {INCIDENT}. Document damages, estimate costs, and prepare reports for recovery planning.",
        priority: "high",
        estimatedDuration: "6 hours",
        requiredResources: ["Assessment forms", "Cameras", "Measuring tools", "Transportation"],
        department: "Assessment Unit",
      },
    ]

    setTasks(sampleTasks)
    setPersonnel(samplePersonnel)
    setTemplates(sampleTemplates)
  }

  const handleCreateTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: "pending",
      createdAt: new Date().toISOString(),
      assignedBy: "Current User",
      notes: [],
    }

    setTasks((prev) => [task, ...prev])
    setShowCreateModal(false)
    setNewTask({
      title: "",
      description: "",
      type: "Emergency Response",
      priority: "normal",
      assignedTo: [],
      department: "Operations",
      location: "",
      dueDate: "",
      estimatedDuration: "",
      requiredResources: [],
    })
  }

  const handleEmergencyTask = (title: string, description: string) => {
    const task: Task = {
      id: Date.now().toString(),
      title,
      description,
      type: "Emergency Response",
      priority: "urgent",
      status: "pending",
      assignedTo: ["1", "2"], // Auto-assign to available emergency personnel
      assignedBy: "Emergency System",
      department: "Emergency Operations",
      location: "To be determined",
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      createdAt: new Date().toISOString(),
      estimatedDuration: "4 hours",
      requiredResources: ["Emergency equipment", "Communication devices"],
      notes: ["EMERGENCY TASK - Immediate response required"],
    }

    setTasks((prev) => [task, ...prev])
    setShowEmergencyModal(false)
  }

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completedAt: newStatus === "completed" ? new Date().toISOString() : undefined,
            }
          : task,
      ),
    )
  }

  const updateTaskProgress = (taskId: string, progress: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
            }
          : task,
      ),
    )
  }

  const addNoteToTask = (taskId: string, note: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              notes: [...task.notes, `${new Date().toLocaleString()}: ${note}`],
            }
          : task,
      ),
    )
  }

  const handleAddNote = () => {
    if (selectedTask && newNote.trim()) {
      addNoteToTask(selectedTask.id, newNote.trim())
      setNewNote("")
      setShowAddNoteModal(false)
      // Update selectedTask to reflect the new note
      setSelectedTask((prev) =>
        prev
          ? {
              ...prev,
              notes: [...prev.notes, `${new Date().toLocaleString()}: ${newNote.trim()}`],
            }
          : null,
      )
    }
  }

  const handleEditTask = () => {
    if (editingTask) {
      setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? editingTask : task)))
      setShowEditTaskModal(false)
      setEditingTask(null)
      // Update selectedTask if it's the same task being edited
      if (selectedTask?.id === editingTask.id) {
        setSelectedTask(editingTask)
      }
    }
  }

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{([^}]+)\}/g)
    return matches ? matches.map((match) => match.slice(1, -1)) : []
  }

  const replaceVariables = (text: string, variables: Record<string, string>): string => {
    let result = text
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value)
    })
    return result
  }

  const handleCreateTemplate = () => {
    const template: TaskTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
    }

    setTemplates((prev) => [template, ...prev])
    setShowCreateTemplateModal(false)
    setNewTemplate({
      name: "",
      type: "Emergency Response",
      title: "",
      description: "",
      priority: "normal",
      estimatedDuration: "",
      requiredResources: [],
      department: "Operations",
    })
  }

  const handleEditTemplate = () => {
    if (editingTemplate) {
      setTemplates((prev) => prev.map((template) => (template.id === editingTemplate.id ? editingTemplate : template)))
      setShowEditTemplateModal(false)
      setEditingTemplate(null)
    }
  }

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      const allVariables = [
        ...extractVariables(selectedTemplate.title),
        ...extractVariables(selectedTemplate.description),
      ]
      const uniqueVariables = [...new Set(allVariables)]

      if (uniqueVariables.length > 0) {
        setTemplateVariables({})
        setShowUseTemplateModal(true)
      } else {
        createTaskFromTemplate(selectedTemplate, {})
      }
    }
  }

  const createTaskFromTemplate = (template: TaskTemplate, variables: Record<string, string>) => {
    const task: Task = {
      id: Date.now().toString(),
      title: replaceVariables(template.title, variables),
      description: replaceVariables(template.description, variables),
      type: template.type as Task["type"],
      priority: template.priority,
      status: "pending",
      assignedTo: [],
      assignedBy: "Current User",
      department: template.department,
      location: variables.LOCATION || variables.AREA || "To be determined",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      createdAt: new Date().toISOString(),
      estimatedDuration: template.estimatedDuration,
      requiredResources: template.requiredResources,
      notes: [`Created from template: ${template.name}`],
    }

    setTasks((prev) => [task, ...prev])
    setShowUseTemplateModal(false)
    setSelectedTemplate(null)
    setTemplateVariables({})
  }

  const handleDeleteTemplate = (template: TaskTemplate) => {
    setTemplateToDelete(template)
    setShowDeleteTemplateModal(true)
  }

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      setTemplates((prev) => prev.filter((template) => template.id !== templateToDelete.id))
      setShowDeleteTemplateModal(false)
      setTemplateToDelete(null)
    }
  }

  const handleAssignTask = (person: Personnel) => {
    setSelectedPersonnel(person)
    setShowAssignTaskModal(true)
  }

  const handleEditPersonnel = (person: Personnel) => {
    setEditingPersonnel(person)
    setShowEditPersonnelModal(true)
  }

  const handleRemovePersonnel = (person: Personnel) => {
    setPersonnelToRemove(person)
    setShowRemovePersonnelModal(true)
  }

  const confirmRemovePersonnel = () => {
    if (personnelToRemove) {
      setPersonnel((prev) => prev.filter((person) => person.id !== personnelToRemove.id))
      setShowRemovePersonnelModal(false)
      setPersonnelToRemove(null)
    }
  }

  const saveEditedPersonnel = () => {
    if (editingPersonnel) {
      setPersonnel((prev) => prev.map((person) => (person.id === editingPersonnel.id ? editingPersonnel : person)))
      setShowEditPersonnelModal(false)
      setEditingPersonnel(null)
    }
  }

  const assignTaskToPersonnel = (taskId: string) => {
    if (selectedPersonnel) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                assignedTo: [...task.assignedTo, selectedPersonnel.id],
              }
            : task,
        ),
      )
      setPersonnel((prev) =>
        prev.map((person) =>
          person.id === selectedPersonnel.id
            ? {
                ...person,
                currentTasks: person.currentTasks + 1,
                status: "busy" as const,
              }
            : person,
        ),
      )
      setShowAssignTaskModal(false)
      setSelectedPersonnel(null)
    }
  }

  const generateTaskReport = (task: Task) => {
    const reportContent = `
CDRRMO TASK REPORT
==================

Task ID: ${task.id}
Title: ${task.title}
Type: ${task.type}
Priority: ${task.priority.toUpperCase()}
Status: ${task.status.toUpperCase()}

Description:
${task.description}

Details:
- Location: ${task.location}
- Department: ${task.department}
- Assigned By: ${task.assignedBy}
- Due Date: ${new Date(task.dueDate).toLocaleString()}
- Created: ${new Date(task.createdAt).toLocaleString()}
- Estimated Duration: ${task.estimatedDuration}
${task.completedAt ? `- Completed: ${new Date(task.completedAt).toLocaleString()}` : ""}

Assigned Personnel:
${task.assignedTo
  .map((personId) => {
    const person = personnel.find((p) => p.id === personId)
    return person ? `- ${person.name} (${person.role})` : `- Unknown Personnel (ID: ${personId})`
  })
  .join("\n")}

Required Resources:
${task.requiredResources.map((resource) => `- ${resource}`).join("\n")}

Task Notes:
${task.notes.length > 0 ? task.notes.map((note) => `- ${note}`).join("\n") : "No notes available"}

Report Generated: ${new Date().toLocaleString()}
Generated by: CDRRMO Task Management System
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `CDRRMO_Task_Report_${task.id}_${new Date().toISOString().split("T")[0]}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "on-hold":
        return <XCircle className="w-4 h-4 text-orange-600" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-700 text-white animate-pulse rounded-md"
      case "high":
        return "bg-red-600 text-white rounded-md"
      case "normal":
        return "bg-[#1B2560] text-white rounded-md"
      case "low":
        return "bg-gray-500 text-white rounded-md"
      default:
        return "bg-gray-500 text-white rounded-md"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "on-hold":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task)
    setShowDeleteTaskModal(true)
  }

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete.id))
      setShowDeleteTaskModal(false)
      setTaskToDelete(null)
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#1B2560" }}>
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#1B2560" }}>
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter((t) => t.status === "in-progress").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#1B2560" }}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter((t) => t.priority === "urgent").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "#1B2560" }}>
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Tasks</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {tasks
            .filter((task) => task.status === "in-progress" || task.status === "pending")
            .slice(0, 5)
            .map((task) => (
              <div
                key={task.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedTask(task)
                  setShowTaskDetails(true)
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">{task.type}</span>
                    {getStatusIcon(task.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{task.description.substring(0, 100)}...</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>📍 {task.location}</span>
                    <span>⏱️ {task.estimatedDuration}</span>
                    <span>👥 {task.assignedTo.length} assigned</span>
                    <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderAllTasks = () => (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">All Tasks</h3>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="">All Types</option>
              <option value="Emergency Response">Emergency Response</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Training">Training</option>
              <option value="Assessment">Assessment</option>
              <option value="Patrol">Patrol</option>
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.description.substring(0, 60)}...</div>
                    <div className="text-xs text-gray-400 mt-1">📍 {task.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(task.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedTask(task)
                      setShowTaskDetails(true)
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setEditingTask(task)
                      setShowEditTaskModal(true)
                    }}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderPersonnel = () => (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Personnel Management</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Personnel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Tasks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {personnel.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      person.status === "available"
                        ? "bg-green-100 text-green-800"
                        : person.status === "busy"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {person.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{person.currentTasks}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleAssignTask(person)} className="text-blue-600 hover:text-blue-900 mr-3">
                    Assign Task
                  </button>
                  <button
                    onClick={() => handleEditPersonnel(person)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Edit
                  </button>
                  <button onClick={() => handleRemovePersonnel(person)} className="text-red-600 hover:text-red-900">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderTemplates = () => (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Task Templates</h3>
          <button
            onClick={() => setShowCreateTemplateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Template
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {templates.map((template) => (
          <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
              <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${getPriorityColor(template.priority)}`}>
                {template.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{template.type}</p>
            <p className="text-sm text-gray-700 mb-3">{template.title}</p>
            <p className="text-xs text-gray-600 mb-4">{template.description.substring(0, 100)}...</p>
            <div className="text-xs text-gray-500 mb-4">
              <p>⏱️ Duration: {template.estimatedDuration}</p>
              <p>🏢 Department: {template.department}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedTemplate(template)
                  handleUseTemplate()
                }}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Use Template
              </button>
              <button
                onClick={() => {
                  setEditingTemplate(template)
                  setShowEditTemplateModal(true)
                }}
                className="px-3 py-2 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTemplate(template)}
                className="px-3 py-2 border border-red-300 rounded text-xs text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 shadow border-b border-gray-200" style={{ backgroundColor: "#1B2560" }}>
        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white bg-opacity-20">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Task Management</h1>
                <p className="text-sm text-gray-200">CDRRMO Operations Center</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Emergency Task
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: ClipboardList },
                { id: "all", label: "All Tasks", icon: FileText },
                { id: "personnel", label: "Personnel", icon: Users },
                { id: "templates", label: "Templates", icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-400 text-blue-300"
                      : "border-transparent text-gray-300 hover:text-white hover:border-gray-400"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "all" && renderAllTasks()}
        {activeTab === "personnel" && renderPersonnel()}
        {activeTab === "templates" && renderTemplates()}
      </div>

      {/* All the existing modals remain the same - Create Task Modal, Emergency Task Modal, etc. */}
      {/* I'll keep all the existing modal code unchanged for brevity */}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Create New Task</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, type: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Emergency Response">Emergency Response</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Training">Training</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Patrol">Patrol</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Equipment Check">Equipment Check</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={newTask.location}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, location: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={newTask.department}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, department: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Emergency Response">Emergency Response</option>
                    <option value="Medical">Medical</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Communications">Communications</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
                  <input
                    type="text"
                    value={newTask.estimatedDuration}
                    onChange={(e) => setNewTask((prev) => ({ ...prev, estimatedDuration: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4 hours"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {personnel.map((person) => (
                    <label key={person.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newTask.assignedTo.includes(person.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewTask((prev) => ({
                              ...prev,
                              assignedTo: [...prev.assignedTo, person.id],
                            }))
                          } else {
                            setNewTask((prev) => ({
                              ...prev,
                              assignedTo: prev.assignedTo.filter((id) => id !== person.id),
                            }))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">
                        {person.name} - {person.role} ({person.status})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleCreateTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Task
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Task Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Create Emergency Task</h3>
              </div>
              <button onClick={() => setShowEmergencyModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  This will create a high-priority emergency task and automatically assign available emergency
                  personnel.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Title</label>
                <input
                  type="text"
                  id="emergency-title"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter emergency task title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Description</label>
                <textarea
                  id="emergency-description"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describe the emergency situation and required response..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  const title = (document.getElementById("emergency-title") as HTMLInputElement)?.value
                  const description = (document.getElementById("emergency-description") as HTMLTextAreaElement)?.value
                  if (title?.trim() && description?.trim()) {
                    handleEmergencyTask(title, description)
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Create Emergency Task
              </button>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Task Details</h3>
              <button onClick={() => setShowTaskDetails(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Task Header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-3 py-1.5 rounded-md text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}
                  >
                    {selectedTask.priority.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">{selectedTask.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedTask.title}</h2>
                <p className="text-gray-600 mt-2">{selectedTask.description}</p>
              </div>

              {/* Task Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{selectedTask.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="text-gray-900">{selectedTask.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned By</label>
                    <p className="text-gray-900">{selectedTask.assignedBy}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Due Date</label>
                    <p className="text-gray-900">{new Date(selectedTask.dueDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Estimated Duration</label>
                    <p className="text-gray-900">{selectedTask.estimatedDuration}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-gray-900">{new Date(selectedTask.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Required Resources */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Required Resources</label>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.requiredResources.map((resource, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Personnel */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Assigned Personnel</label>
                <div className="space-y-2">
                  {selectedTask.assignedTo.map((personId) => {
                    const person = personnel.find((p) => p.id === personId)
                    return person ? (
                      <div key={personId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{person.name}</p>
                          <p className="text-sm text-gray-600">
                            {person.role} - {person.department}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            person.status === "available"
                              ? "bg-green-100 text-green-800"
                              : person.status === "busy"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {person.status}
                        </span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>

              {/* Task Notes */}
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">Task Notes</label>
                <div className="space-y-2">
                  {selectedTask.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <select
                  value={selectedTask.status}
                  onChange={(e) => updateTaskStatus(selectedTask.id, e.target.value as Task["status"])}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => setShowAddNoteModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Note
                </button>
                <button
                  onClick={() => {
                    setEditingTask(selectedTask)
                    setShowEditTaskModal(true)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => generateTaskReport(selectedTask)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Add Note to Task</h3>
              <button onClick={() => setShowAddNoteModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your note here..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
              <button
                onClick={() => {
                  setShowAddNoteModal(false)
                  setNewNote("")
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Edit Task</h3>
              <button onClick={() => setShowEditTaskModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={editingTask.type}
                    onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, type: e.target.value as any } : null))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Emergency Response">Emergency Response</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Training">Training</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Patrol">Patrol</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Equipment Check">Equipment Check</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask((prev) => (prev ? { ...prev, priority: e.target.value as any } : null))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editingTask.location}
                    onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, location: e.target.value } : null))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={editingTask.department}
                    onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, department: e.target.value } : null))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Emergency Response">Emergency Response</option>
                    <option value="Medical">Medical</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Communications">Communications</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="datetime-local"
                    value={editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().slice(0, 16) : ""}
                    onChange={(e) => setEditingTask((prev) => (prev ? { ...prev, dueDate: e.target.value } : null))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
                  <input
                    type="text"
                    value={editingTask.estimatedDuration}
                    onChange={(e) =>
                      setEditingTask((prev) => (prev ? { ...prev, estimatedDuration: e.target.value } : null))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleEditTask}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditTaskModal(false)
                  setEditingTask(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Create New Template</h3>
              <button onClick={() => setShowCreateTemplateModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newTemplate.type}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Emergency Response">Emergency Response</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Training">Training</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Patrol">Patrol</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Equipment Check">Equipment Check</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (use {"{VARIABLE}"} for placeholders)
                </label>
                <input
                  type="text"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Emergency Response - {LOCATION}"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (use {"{VARIABLE}"} for placeholders)
                </label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Deploy emergency response team to {LOCATION} for flood response operations..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTemplate.priority}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
                  <input
                    type="text"
                    value={newTemplate.estimatedDuration}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, estimatedDuration: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 4 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={newTemplate.department}
                    onChange={(e) => setNewTemplate((prev) => ({ ...prev, department: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Emergency Response">Emergency Response</option>
                    <option value="Medical">Medical</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Communications">Communications</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Resources (one per line)
                </label>
                <textarea
                  value={newTemplate.requiredResources.join("\n")}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      requiredResources: e.target.value.split("\n").filter((r) => r.trim()),
                    }))
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Emergency equipment&#10;Communication devices&#10;Safety gear"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleCreateTemplate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Template
              </button>
              <button
                onClick={() => setShowCreateTemplateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditTemplateModal && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Edit Template</h3>
              <button onClick={() => setShowEditTemplateModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={editingTemplate.type}
                    onChange={(e) => setEditingTemplate((prev) => (prev ? { ...prev, type: e.target.value } : null))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Emergency Response">Emergency Response</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Training">Training</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Patrol">Patrol</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Equipment Check">Equipment Check</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (use {"{VARIABLE}"} for placeholders)
                </label>
                <input
                  type="text"
                  value={editingTemplate.title}
                  onChange={(e) => setEditingTemplate((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (use {"{VARIABLE}"} for placeholders)
                </label>
                <textarea
                  value={editingTemplate.description}
                  onChange={(e) =>
                    setEditingTemplate((prev) => (prev ? { ...prev, description: e.target.value } : null))
                  }
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editingTemplate.priority}
                    onChange={(e) =>
                      setEditingTemplate((prev) => (prev ? { ...prev, priority: e.target.value as any } : null))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
                  <input
                    type="text"
                    value={editingTemplate.estimatedDuration}
                    onChange={(e) =>
                      setEditingTemplate((prev) => (prev ? { ...prev, estimatedDuration: e.target.value } : null))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={editingTemplate.department}
                    onChange={(e) =>
                      setEditingTemplate((prev) => (prev ? { ...prev, department: e.target.value } : null))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Emergency Response">Emergency Response</option>
                    <option value="Medical">Medical</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Communications">Communications</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Resources (one per line)
                </label>
                <textarea
                  value={editingTemplate.requiredResources.join("\n")}
                  onChange={(e) =>
                    setEditingTemplate((prev) =>
                      prev
                        ? {
                            ...prev,
                            requiredResources: e.target.value.split("\n").filter((r) => r.trim()),
                          }
                        : null,
                    )
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={handleEditTemplate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditTemplateModal(false)
                  setEditingTemplate(null)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Use Template Modal */}
      {showUseTemplateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Use Template: {selectedTemplate.name}</h3>
              <button onClick={() => setShowUseTemplateModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">Please provide values for the template variables:</p>
              </div>

              {[
                ...new Set([
                  ...extractVariables(selectedTemplate.title),
                  ...extractVariables(selectedTemplate.description),
                ]),
              ].map((variable) => (
                <div key={variable}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{variable}</label>
                  <input
                    type="text"
                    value={templateVariables[variable] || ""}
                    onChange={(e) =>
                      setTemplateVariables((prev) => ({
                        ...prev,
                        [variable]: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${variable.toLowerCase()}`}
                  />
                </div>
              ))}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Preview:</h4>
                <p className="text-sm text-gray-700">
                  <strong>Title:</strong> {replaceVariables(selectedTemplate.title, templateVariables)}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Description:</strong>{" "}
                  {replaceVariables(selectedTemplate.description, templateVariables).substring(0, 100)}...
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => createTaskFromTemplate(selectedTemplate, templateVariables)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Task
              </button>
              <button
                onClick={() => {
                  setShowUseTemplateModal(false)
                  setSelectedTemplate(null)
                  setTemplateVariables({})
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Template Confirmation Modal */}
      {showDeleteTemplateModal && templateToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Template</h3>
              </div>
              <button onClick={() => setShowDeleteTemplateModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Are you sure you want to delete the template "{templateToDelete.name}"? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={confirmDeleteTemplate}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Template
              </button>
              <button
                onClick={() => setShowDeleteTemplateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Personnel Modal */}
      {showEditPersonnelModal && editingPersonnel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Edit Personnel</h3>
              <button onClick={() => setShowEditPersonnelModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editingPersonnel.name}
                  onChange={(e) => setEditingPersonnel((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={editingPersonnel.role}
                  onChange={(e) => setEditingPersonnel((prev) => (prev ? { ...prev, role: e.target.value } : null))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={editingPersonnel.department}
                  onChange={(e) =>
                    setEditingPersonnel((prev) => (prev ? { ...prev, department: e.target.value } : null))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Emergency Response">Emergency Response</option>
                  <option value="Medical Unit">Medical Unit</option>
                  <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                  <option value="Risk Assessment Unit">Risk Assessment Unit</option>
                  <option value="Operations">Operations</option>
                  <option value="Communications">Communications</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  value={editingPersonnel.contact}
                  onChange={(e) => setEditingPersonnel((prev) => (prev ? { ...prev, contact: e.target.value } : null))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editingPersonnel.status}
                  onChange={(e) =>
                    setEditingPersonnel((prev) =>
                      prev ? { ...prev, status: e.target.value as Personnel["status"] } : null,
                    )
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="off-duty">Off Duty</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={saveEditedPersonnel}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditPersonnelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showAssignTaskModal && selectedPersonnel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Assign Task to {selectedPersonnel.name}</h3>
              <button onClick={() => setShowAssignTaskModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Select a task to assign to {selectedPersonnel.name} ({selectedPersonnel.role})
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {tasks
                  .filter((task) => task.status === "pending" && !task.assignedTo.includes(selectedPersonnel.id))
                  .map((task) => (
                    <div
                      key={task.id}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => assignTaskToPersonnel(task.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                          <p className="text-xs text-gray-500">
                            {task.type} • {task.priority.toUpperCase()}
                          </p>
                        </div>
                        <span className="text-xs text-blue-600">Click to assign</span>
                      </div>
                    </div>
                  ))}
                {tasks.filter((task) => task.status === "pending" && !task.assignedTo.includes(selectedPersonnel.id))
                  .length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No available tasks to assign</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => setShowAssignTaskModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Personnel Confirmation Modal */}
      {showRemovePersonnelModal && personnelToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Remove Personnel</h3>
              </div>
              <button onClick={() => setShowRemovePersonnelModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Are you sure you want to remove {personnelToRemove.name} from the personnel list?
                  {personnelToRemove.currentTasks > 0 && (
                    <span className="block mt-2 font-medium">
                      Warning: This person currently has {personnelToRemove.currentTasks} active task(s).
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={confirmRemovePersonnel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Remove Personnel
              </button>
              <button
                onClick={() => setShowRemovePersonnelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Modal */}
      {showDeleteTaskModal && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Delete Task</h3>
              </div>
              <button onClick={() => setShowDeleteTaskModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Are you sure you want to delete the task "{taskToDelete.title}"? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={confirmDeleteTask}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Task
              </button>
              <button
                onClick={() => setShowDeleteTaskModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

TaskManagement.layout = (e: React.JSX.Element) => <Authenticated children={e} />
