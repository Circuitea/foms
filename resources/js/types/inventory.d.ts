export default interface Item {
    id: number;
    name: string;
    description: string;
    imagePath: string;
    type: ItemType,
}

export interface ItemType {
  id: number,
  name: string,
  icon: string,
};

export interface ItemCondition {
  id: number;
  name: ItemConditionValue;
  label: string;
  amount: number;
}

export type ItemEntry = Item & {
  conditions: ItemCondition[];
}

export type ItemConditionValue = 'available' | 'deployed' | 'in_maintenance';
