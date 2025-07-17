import dayjs, { Dayjs } from "dayjs"
import { Personnel } from "."
import Item from "./inventory"

export interface Task {
  id: number
  title: string
  description: string
  location: string
  
  due_date: string
  duration: number
  status: TaskStatus
  
  type_id: number
  priority_id: number
  creator_id: number

  type: TaskType
  priority: TaskPriority
  creator: Personnel

  personnel: Personnel[]
  equipments: {
    item: Item,
    quantity: number,
  }[]
  
  created_at: string
  updated_at: string
}

export interface TaskType {
  id: number,
  name: string,
}

export interface TaskPriority {
  id: number,
  name: string,
}

export type TaskStatus = 'ongoing' | 'pending' | 'finished';