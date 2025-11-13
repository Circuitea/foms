"use client"

import { useState, useCallback } from "react"
import { Search, Package, ChevronDown, ChevronRight, Wrench, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ConsumableItem, EquipmentGroup, EquipmentItem } from "@/types/inventory"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"

export type SingleItemSelection = EmptyItemSelection | ItemSelection;

type EmptyItemSelection = {
  type: null;
}

type ItemSelection = {
  type: 'equipment' | 'consumable';
  id: number;
}


export interface SimpleInventoryItems {
  equipment: (EquipmentGroup & { items: EquipmentItem[] })[];
  consumables: ConsumableItem[];
}

interface SingleItemSelectionDialogProps {
  items: SimpleInventoryItems;
  value: SingleItemSelection
  onSelect: (selection: SingleItemSelection) => void

}

export function ItemSelectionDialog({ items, onSelect }: SingleItemSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<SingleItemSelection>({type: null});

  const filteredItems = {
    equipment: items.equipment.filter(entry => entry.name.toLowerCase().includes(searchQuery.toLowerCase())),
    consumables: items.consumables.filter(entry =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  }

  const handleSelection = (itemSelected: SingleItemSelection) => {
    onSelect(itemSelected)
    setSearchQuery("")
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Select Item</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Item</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {filteredItems.equipment.map((group, i) => (
              <SingleEquipmentGroupSection
                key={i}
                groupName={group.name}
                equipment={group.items}
                selection={selection}
                onSelectionChange={(selectedEquipment) => handleSelection({ type: 'equipment', id: selectedEquipment })}
              />
            ))}

            {items.consumables.length > 0 && (
              <div className="space-y-2">
                {items.consumables.length > 0 && items.equipment.length > 0 && (
                  <h3 className="font-medium text-sm text-muted-foreground">Consumables</h3>
                )}
                {filteredItems.consumables.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{item.description}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleSelection({ type: 'consumable', id: item.id })}
                          className="h-8 p-2"
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => handleSelection({ type: null })}>
            Clear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SingleEquipmentGroupProps {
  groupName: string;
  equipment: EquipmentItem[];
  selection: SingleItemSelection;
  onSelectionChange: (itemId: number) => void;
}

function SingleEquipmentGroupSection({ groupName, equipment, selection, onSelectionChange }: SingleEquipmentGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="border rounded-lg overflow-hidden">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between h-auto"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <Wrench className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{groupName}</span>
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="p-2 space-y-2">
        {equipment.map((item) => {
          const isSelected = selection.type === "equipment" && selection.id === item.id
          return (
            <div
              key={item.id}
              className={`border rounded-lg p-3 transition-colors ${
                isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                  </div>
                  {item.description && <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>}
                </div>
                <Button
                  size="sm"
                  onClick={() => onSelectionChange(item.id)}
                  className="h-8 p-2"
                >
                  Select
                </Button>
              </div>
            </div>
          )
        })}
      </CollapsibleContent>
    </Collapsible>
  )
}