import dayjs, { Dayjs } from "dayjs"
import { Personnel } from "."
import Item, { ConsumableItem, ConsumableTransactionEntry, EquipmentGroup, EquipmentItem, EquipmentTransactionEntry, Transaction } from "./inventory"

export interface Task {
  id: number
  title: string
  description: string
  location: string
  
  due_date: string
  finished_at: string;

  type_id: number
  priority_id: number
  creator_id: number

  type: TaskType
  priority: TaskPriority
  creator: Personnel

  personnel: PersonnelWithPivot[]
  
  transaction?: Transaction & {
    equipment?: (EquipmentTransactionEntry & { item: (ConsumableItem & {group: EquipmentGroup}) })[];
    consumables?: (ConsumableTransactionEntry & { item: ConsumableItem })[];
  }

  pivot: {
    personnel_id: number
    started_at?: number
    finished_at?: number
    additional_notes?: string,
  }
  
  created_at: string
  updated_at: string
  finished_at?: string
}

export type PersonnelWithPivot = Personnel & {
  pivot: {
    started_at?: string;
    finished_at?: string;
    additional_notes?: string;
  }
}

export interface TaskType {
  id: number,
  name: string,
}

export interface TaskPriority {
  id: number,
  name: string,
}

export interface TaskAttachment {
  personnel_id: number;
  task_id: number;
  file_path: string;
  file_name: string;
}

export type TaskWithAttachments = Task & {
  attachments: TaskAttachment[];
}