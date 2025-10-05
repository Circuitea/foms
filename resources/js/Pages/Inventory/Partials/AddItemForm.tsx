import InputError from "@/components/InputError";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageProps } from "@/types";
import { ItemType } from "@/types/inventory";
import { usePage } from "@inertiajs/react";
import { useForm } from "laravel-precognition-react-inertia";
import { Package, Plus } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import Select from 'react-select';

export default function AddItemForm() {
  const { types } = usePage<PageProps<{ types: ItemType[] }>>().props;
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    consumableForm.reset();
    equipmentForm.reset();
  }, [isOpen]);

  const consumableForm = useForm<{
    name: string
    description: string
    type_id?: number
    location: string,
    image?: File,
    initial_quantity: string
  }>('post', '/inventory/consumable/new', {
    name: '',
    description: '',
    location: '',
    initial_quantity: '',
  });

  const equipmentForm = useForm<{
    name: string;
    description: string;
    location: string;
    image?: File;

    group_id?: 'new' | number;
    group_name: string;
    group_type_id?: number;


  }>('post', '/inventory/equipment/new', {
    name: '',
    description: '',
    location: '',

    group_id: 'new',
    group_name: '',
  });

  const typeOptions = types.map((type) => {
    return {
      value: type.id,
      label: `${type.icon} ${type.name}`,
    };
  });

  const groupOptions = [
    {value: 'new', label: 'New Group'},
    {value: 1, label: 'RAOJGFOAJGFA'},
  ]

  const handleConsumableSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    consumableForm.submit({
      onSuccess: () => {
        consumableForm.reset();
        setOpen(false);
      },
    });
  }

  const handleEquipmentSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    equipmentForm.submit({
      onSuccess: () => {
        equipmentForm.reset();
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <Tabs defaultValue="consumable">

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-6 h-6 text-[#1B2560]" />
              Add New Item
            </DialogTitle>
            <DialogDescription>Form to Add New Inventory Item</DialogDescription>
            <TabsList>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="consumable">Consumable</TabsTrigger>
            </TabsList>
          </DialogHeader>
          <TabsContent value="equipment">
            <form onSubmit={handleEquipmentSubmit} id="addInventoryItem">
              <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="row-span-2 flex flex-col items-center justify-center">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Item Photo</p>
                    <Label htmlFor="image" className="cursor-pointer">
                      <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 hover:border-blue-400 transition-colors">
                      {equipmentForm.data.image ? (
                        <img className="max-w-full max-h-full" src={URL.createObjectURL(equipmentForm.data.image)} />
                      ): (
                        <div className="text-center">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 font-medium">Upload Photo</p>
                          <p className="text-xs text-gray-400">Click to browse</p>
                        </div>
                      )}
                      </div>
                    </Label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        equipmentForm.setData('image', e.target.files?.[0]);
                        equipmentForm.validate('image');
                      }}
                      hidden
                    />
                    <InputError invalid={equipmentForm.invalid('image')} message={equipmentForm.errors.image} />
                  </div>
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={equipmentForm.data.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Small Chainsaw"
                      onChange={(e) => equipmentForm.setData('name', e.target.value)}
                      onBlur={() => equipmentForm.validate('name')}
                      />
                    <InputError invalid={equipmentForm.invalid('name')} message={equipmentForm.errors.name} />
                  </div>
                  <div>
                    <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={equipmentForm.data.location}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Storage Area A"
                      onChange={(e) => equipmentForm.setData('location', e.target.value)}
                      onBlur={() => equipmentForm.validate('location')}
                    />
                    <InputError invalid={equipmentForm.invalid('location')} message={equipmentForm.errors.location} />
                  </div>

                  <div>
                    <Label htmlFor="equipment-group" className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Group <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={groupOptions}
                      value={groupOptions.find(option => option.value === equipmentForm.data.group_id)}
                      onChange={(newValue) => equipmentForm.setData('group_id', newValue?.value !== 'new' ? Number(newValue?.value) : 'new')}
                      isClearable
                      isSearchable
                    />
                    <InputError invalid={equipmentForm.invalid('location')} message={equipmentForm.errors.location} />
                  </div>
                  {equipmentForm.data.group_id === 'new' && (
                    <div className="flex flex-col gap-2">
                      <div>
                        <Label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-2">
                          Group Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="group-name"
                          value={equipmentForm.data.group_name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Chainsaw"
                          onChange={(e) => equipmentForm.setData('group_name', e.target.value)}
                          onBlur={() => equipmentForm.validate('group_name')}
                          />
                        <InputError invalid={equipmentForm.invalid('name')} message={equipmentForm.errors.name} />
                      </div>
                      <div>
                        <Label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                          Group Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          options={typeOptions}
                          value={typeOptions.find(option => option.value === equipmentForm.data.group_type_id)}
                          onChange={(newType) => {
                            equipmentForm.setData('group_type_id', newType?.value)
                            equipmentForm.validate('group_type_id')
                          }}
                          isClearable
                        />
                        <InputError invalid={consumableForm.invalid('type_id')} message={consumableForm.errors.type_id} />
                      </div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={equipmentForm.data.description}
                      onChange={(e) => equipmentForm.setData('description', e.target.value)}
                      onBlur={() => equipmentForm.validate('description')}
                      placeholder="Example description"
                    />
                    <InputError invalid={equipmentForm.invalid('description')} message={equipmentForm.errors.description} />
                  </div>
                </div>
              </div>
            </form>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                disabled={equipmentForm.processing}
                type="submit"
                form="addInventoryItem"
                className="px-6 py-3 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
              >
                Add Equipment Item
              </Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="consumable">
            <form onSubmit={handleConsumableSubmit} id="addInventoryItem">
              <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="row-span-2 flex flex-col items-center justify-center">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Item Photo</p>
                    <Label htmlFor="image" className="cursor-pointer">
                      <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 hover:border-blue-400 transition-colors">
                      {consumableForm.data.image ? (
                        <img className="max-w-full max-h-full" src={URL.createObjectURL(consumableForm.data.image)} />
                      ): (
                        <div className="text-center">
                          <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 font-medium">Upload Photo</p>
                          <p className="text-xs text-gray-400">Click to browse</p>
                        </div>
                      )}
                      </div>
                    </Label>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        consumableForm.setData('image', e.target.files?.[0]);
                        consumableForm.validate('image');
                      }}
                      hidden
                    />
                    <InputError invalid={consumableForm.invalid('image')} message={consumableForm.errors.image} />
                  </div>
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={consumableForm.data.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Chainsaw"
                      onChange={(e) => consumableForm.setData('name', e.target.value)}
                      onBlur={() => consumableForm.validate('name')}
                      />
                    <InputError invalid={consumableForm.invalid('name')} message={consumableForm.errors.name} />
                  </div>
                  <div>
                    <Label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Item Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={typeOptions}
                      value={typeOptions.find(option => option.value === consumableForm.data.type_id)}
                      onChange={(newType) => {
                        consumableForm.setData('type_id', newType?.value)
                        consumableForm.validate('type_id')
                      }}
                      isClearable
                    />
                    <InputError invalid={consumableForm.invalid('type_id')} message={consumableForm.errors.type_id} />
                  </div>

                  <div>
                    <Label htmlFor="initial_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="initial_quantity"
                      type="number"
                      value={consumableForm.data.initial_quantity}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1"
                      onChange={(e) => consumableForm.setData('initial_quantity', e.target.value)}
                      onBlur={() => consumableForm.validate('initial_quantity')}
                    />
                    <InputError invalid={consumableForm.invalid('initial_quantity')} message={consumableForm.errors.initial_quantity} />
                  </div>
                  <div>
                    <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={consumableForm.data.location}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Storage Area A"
                      onChange={(e) => consumableForm.setData('location', e.target.value)}
                      onBlur={() => consumableForm.validate('location')}
                    />
                    <InputError invalid={consumableForm.invalid('location')} message={consumableForm.errors.location} />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      rows={3}
                      value={consumableForm.data.description}
                      onChange={(e) => consumableForm.setData('description', e.target.value)}
                      onBlur={() => consumableForm.validate('description')}
                      placeholder="Example description"
                    />
                    <InputError invalid={consumableForm.invalid('description')} message={consumableForm.errors.description} />
                  </div>
                </div>
              </div>
            </form>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                disabled={consumableForm.processing}
                type="submit"
                form="addInventoryItem"
                className="px-6 py-3 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
              >
                Add Inventory Item
              </Button>
            </DialogFooter>
          </TabsContent>
          
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

