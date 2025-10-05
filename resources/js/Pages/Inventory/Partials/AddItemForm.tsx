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

  const typeOptions = types.map((type) => {
    return {
      value: type.id,
      label: `${type.icon} ${type.name}`,
    };
  });

  const handleConsumableSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    consumableForm.submit({
      onSuccess: () => {
        consumableForm.reset();
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
          {/* <TabsContent value="equipment">
            <form onSubmit={handleSubmit} id="addInventoryItem">
              <div className="overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="row-span-2 flex flex-col items-center justify-center">
                    <p className="block text-sm font-medium text-gray-700 mb-2">Item Photo</p>
                    <Label htmlFor="image" className="cursor-pointer">
                      <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 hover:border-blue-400 transition-colors">
                      {data.image ? (
                        <img className="max-w-full max-h-full" src={URL.createObjectURL(data.image)} />
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
                        setData('image', e.target.files?.[0]);
                        validate('image');
                      }}
                      hidden
                    />
                    <InputError invalid={invalid('image')} message={errors.image} />
                  </div>
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={data.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Chainsaw"
                      onChange={(e) => setData('name', e.target.value)}
                      onBlur={() => validate('name')}
                      />
                    <InputError invalid={invalid('name')} message={errors.name} />
                  </div>
                  <div>
                    <Label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      options={typeOptions}
                      value={typeOptions.find(option => option.value === data.type_id)}
                      onChange={(newType) => {
                        setData('type_id', newType?.value)
                        validate('type_id')
                      }}
                      isClearable
                    />
                    <InputError invalid={invalid('type_id')} message={errors.type_id} />
                  </div>

                  <div>
                    <Label htmlFor="initial_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Initial Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="initial_quantity"
                      type="number"
                      value={data.initial_quantity}
                      min={0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1"
                      onChange={(e) => setData('initial_quantity', parseInt(e.target.value))}
                      onBlur={() => validate('initial_quantity')}
                    />
                    <InputError invalid={invalid('initial_quantity')} message={errors.initial_quantity} />
                  </div>
                  <div>
                    <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={data.location}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Storage Area A"
                      onChange={(e) => setData('location', e.target.value)}
                      onBlur={() => validate('location')}
                    />
                    <InputError invalid={invalid('location')} message={errors.location} />
                  </div>
                  <div className="col-span-2">
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
                </div>
              </div>
            </form>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                disabled={processing}
                type="submit"
                form="addInventoryItem"
                className="px-6 py-3 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
              >
                Add Consumable Item
              </Button>
            </DialogFooter>
          </TabsContent> */}
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

