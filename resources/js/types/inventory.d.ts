export interface EquipmentGroup {
  id: number;
  name: string;
  type: ItemType;
}

export interface EquipmentItem {
  id: number;
  name: string;
  description: string;
  image_path?: string;
  location: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConsumableItem {
  id: number;
  name: string;
  description: string;
  image_path?: string;
  location: string;

  type: ItemType;

  created_at?: string;
  updated_at?: string;
}

export interface EquipmentTransactionEntry {
  id: number;
}

export interface ConsumableTransactionEntry {
  id: number;
  quantity: number;
  transaction: Transaction;
}

export interface ItemType {
  id: number,
  name: string,
  icon: string,
};

export interface Transaction {
  id: number;
  title: string;
  description: string;
  created_at: string;
}