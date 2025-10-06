"use client"

import { useState, useMemo, useCallback } from "react"
import { Search, Package, Plus, Minus, ChevronDown, ChevronRight, Wrench, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ConsumableItem, EquipmentGroup, EquipmentItem } from "@/types/inventory"

export type EquipmentItemWithAvailability = { items: (EquipmentItem & { is_available: boolean })[] };
type ConsumableSelection = { id: number; count: number; }

export interface InventoryItems {
  equipment: (EquipmentGroup & EquipmentItemWithAvailability)[];
  consumables: (ConsumableItem & { count: number })[];
}

export interface ItemSelection {
  equipment: number[];
  consumables: ConsumableSelection[];
}

interface ItemSelectionDialogProps {
  items: InventoryItems;
  selected: ItemSelection;
  onConfirm: (selections: ItemSelection) => void
  onClose: () => void
  isOpen: boolean
}


export function ItemSelectionDialog({ items, onConfirm, onClose, selected, isOpen }: ItemSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const {
    selections,
    updateEquipmentSelection,
    updateConsumableSelection,
    getConsumableSelection,
    clearSelections,
    totalCount,
  } = useInventorySelection(selected)


  const filteredItems = {
    equipment: items.equipment.filter(entry => entry.name.toLowerCase().includes(searchQuery.toLowerCase())),
    consumables: items.consumables.filter(entry =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }

  const handleConfirm = () => {
    onConfirm(selections)
    onClose()
    setSearchQuery("")
  }

  const handleCancel = () => {
    onClose()
    setSearchQuery("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Items for Task</DialogTitle>
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
              <EquipmentGroupSection
                key={i}
                groupName={group.name}
                equipment={group.items}
                selections={selections}
                onSelectionChange={updateEquipmentSelection}
              />
            ))}

            {items.consumables.length > 0 && (
              <div className="space-y-2">
                {items.consumables.length > 0 && items.equipment.length > 0 && (
                  <h3 className="font-medium text-sm text-muted-foreground">Consumables</h3>
                )}
                {items.consumables.map((item) => {
                  const selection = getConsumableSelection(item.id)
                  const isSelected = !!selection

                  return (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-3 transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          </div>

                          {item.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{item.description}</p>
                          )}

                          <Badge variant="secondary" className="text-xs">
                            {item.count} available
                          </Badge>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentAmount = selection?.count || 0
                                const newAmount = Math.max(0, currentAmount - 1)
                                updateConsumableSelection(item.id, newAmount > 0 ? { id: item.id, count: newAmount } : null)
                              }}
                              disabled={!selection?.count}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {selection?.count || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const currentAmount = selection?.count || 0
                                const newAmount = Math.min(item.count, currentAmount + 1)
                                updateConsumableSelection(item.id, { id: item.id, count: newAmount })
                              }}
                              disabled={(selection?.count || 0) >= item.count}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={totalCount === 0}>
            Confirm Selection ({totalCount})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface EquipmentGroupProps {
  groupName: string;
  equipment: (EquipmentItem & { is_available: boolean })[];
  selections: ItemSelection;
  onSelectionChange: (itemId: number, selection: number | null) => void;
}

function EquipmentGroupSection({ groupName, equipment, selections, onSelectionChange }: EquipmentGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const selectedCount = equipment.filter((item) => selections.equipment.some((id) => id === item.id)).length
  const availableCount = equipment.filter((item) => item.is_available).length

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

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{selectedCount} selected</span>
            <span>{availableCount} available</span>
          </div>
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="p-2 space-y-2">
        {equipment.map((item) => {
          const isSelected = selections.equipment.some((id) => id === item.id)

          return (
            <div
              key={item.id}
              className={`border rounded-lg p-3 transition-colors ${
                isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              } ${!item.is_available ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    {!item.is_available && (
                      <Badge variant="destructive" className="text-xs">
                        In Use
                      </Badge>
                    )}
                  </div>

                  {item.description && <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>}
                </div>

                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isSelected) {
                      onSelectionChange(item.id, null)
                    } else {
                      onSelectionChange(item.id, item.id)
                    }
                  }}
                  disabled={!item.is_available}
                  className="w-8 h-8 p-0"
                >
                  {isSelected && <Check className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )
        })}
      </CollapsibleContent>
    </Collapsible>
  )
}

const useInventorySelection = (initial: ItemSelection) => {
  const [selections, setSelections] = useState<ItemSelection>(initial);

  const updateEquipmentSelection = useCallback((itemID: number, selection: number | null) => {
    setSelections((prev) => {
      const filtered = prev.equipment.filter((s) => s !== itemID);
      return {
        ...prev,
        equipment: selection ? [...filtered, selection] : filtered
      };
    });
  }, []);

  const updateConsumableSelection = useCallback(( itemID: number, selection: ConsumableSelection | null ) => {
    setSelections((prev) => {
      const filtered = prev.consumables.filter((s) => s.id !== itemID);
      return {
        ...prev,
        consumables: selection ? [...filtered, selection] : filtered,
      };
    });
  }, []);

  const getConsumableSelection = useCallback(
    (itemId: number) => {
      return selections.consumables.find((s) => s.id === itemId)
    },
    [selections],
  )

  const clearSelections = useCallback(() => {
    setSelections({ equipment: [], consumables: [] });
  }, []);

  const totalCount = selections.equipment.length + selections.consumables.length;

  return {
    selections,
    updateEquipmentSelection,
    updateConsumableSelection,
    getConsumableSelection,
    clearSelections,
    totalCount,
  }
}
