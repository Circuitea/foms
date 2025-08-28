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
  finished_at: string;

  type_id: number
  priority_id: number
  creator_id: number

  type: TaskType
  priority: TaskPriority
  creator: Personnel

  personnel: Personnel[]
  items: {
    item: Item,
    amount: number,
  }[],

  pivot: {
    personnel_id: number
    started_at?: number
    finished_at?: number
  }
  
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