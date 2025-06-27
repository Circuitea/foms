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