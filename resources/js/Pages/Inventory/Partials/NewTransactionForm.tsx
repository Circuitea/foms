import InputError from "@/components/InputError";
import { ItemSelectionDialog } from "@/components/SimpleItemSelectionDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageProps } from "@/types";
import { ConsumableItem, EquipmentGroup, EquipmentItem } from "@/types/inventory";
import { usePage } from "@inertiajs/react";
import { useForm } from "laravel-precognition-react-inertia";
import { ClipboardPlus, Package, Plus, User } from "lucide-react";
import { FormEventHandler, useState } from "react";

type NewTransactionEntry = {
  type: 'equipment' | 'consumable' | null;
  item_id?: number;
  quantity?: string;
};

type EquipmentEntry = EquipmentGroup & { items: EquipmentItem[] };

export default function NewTransactionForm() {
  const { equipment, consumables } = usePage<PageProps<{
    items: { equipment: EquipmentEntry[], consumables: ConsumableItem[] };
  }>>().props.items;
  const [isOpen, setOpen] = useState(false);
  const [isItemSelectOpen, setItemSelectOpen] = useState(false);
  
  const equipmentItems = equipment.map(group => group.items).flat();

  const { data, setData, submit, reset, validate, invalid, errors } = useForm<{
    title: string;
    description: string;
    entries: NewTransactionEntry[];
  }>('post', '/inventory/transaction/new', {
    title: '',
    description: '',

    entries: [{ type: null }],
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    submit({
      onSuccess: () => {
        reset();
        setOpen(false);
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <ClipboardPlus className="w-4 h-4" />
          New Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#1B2560]" />
            New Transaction
          </DialogTitle>
          <DialogDescription>Form for Creating New Inventory Transaction</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="newTransaction">
          <div className="overflow-y-auto p-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={data.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Small Chainsaw"
                  onChange={(e) => setData('title', e.target.value)}
                  onBlur={() => validate('title')}
                  />
                <InputError invalid={invalid('title')} message={errors.title} />
              </div>
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  onBlur={() => validate('description')}
                  placeholder="Example description"
                />
                <InputError invalid={invalid('description')} message={errors.description} />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Transaction Entries</h3>
                </div>
                {data.entries.map((entry, index) => (
                  <>
                    <div className="p-2 bg-gray-100 flex items-center gap-2 w-full rounded-lg shadow-sm">
                      <div className="h-6 w-6 rounded-full bg-[#1B2560] text-white flex items-center justify-center">
                        <span>{index+1}</span>
                      </div>
                      <div className="grid grid-cols-[10%_1fr_1fr_1fr] gap-2 w-full items-center">
                        <ItemSelectionDialog
                          items={{
                            equipment,
                            consumables,
                          }}

                          value={entry.type === null
                            ? {
                              type: null
                            } : {
                              type: entry.type,
                              id: entry.item_id ?? 0,
                            }}

                          onSelect={(selected) => {
                            const entries = [...data.entries];

                            if (selected.type === null) {
                              entries[index] = { type: null };
                            } else {
                              entries[index] = { type: selected.type, item_id: selected.id };
                            }

                            setData('entries', entries)
                          }}
                        />
                        {entry.type !== null && (
                          <>
                            <div className="bg-white px-4 py-2 flex justify-between items-center rounded-lg">
                              <span>{entry.type === "equipment" ? equipmentItems.find(item => item.id === entry.item_id)?.name : consumables.find(item => item.id === entry.item_id)?.name}</span>
                              <span className="text-gray-400 text-xs">{entry.type === 'equipment' ? 'Equipment Item' : 'Consumable Item'}</span>
                            </div>

                            {entry.type === 'consumable' && (
                              <Input
                                id="title"
                                value={data.entries[index].quantity}
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Amount"
                                onChange={(e) => {
                                  const entries = data.entries;
                                  entries[index].quantity = e.target.value
                                  setData('entries', entries);  
                                }}
                              />
                            )}
                          </>
                        )}

                        <Button
                          type="button"
                          className="col-start-4"
                          disabled={data.entries.length <= 1}
                          onClick={() => setData(
                            'entries',
                            data.entries.filter((_, i) => i !== index)
                          )}
                        >
                          Remove
                        </Button>

                      </div>
                    </div>
                  </>
                ))}
                <Button
                  type="button"
                  className="bg-[#1B2560]"
                  onClick={() => setData('entries', [
                    ...data.entries,
                    { type: null },
                  ])}
                >Add Entry</Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#1B2560]"
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}