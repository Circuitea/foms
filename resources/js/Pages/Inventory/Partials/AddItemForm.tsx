import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageProps } from "@/types";
import { ItemType } from "@/types/inventory";
import { usePage } from "@inertiajs/react";
import { useForm } from "laravel-precognition-react-inertia";
import { Package, Plus } from "lucide-react";
import { FormEventHandler, useState } from "react";
import Select from 'react-select';

export default function AddItemForm() {
  const { types } = usePage<PageProps<{ types: ItemType[] }>>().props;
  const [isOpen, setOpen] = useState(false);
  const { data, setData, submit } = useForm<{
    name: string
    description: string
    type_id?: number
    location: string,
    image?: File,
    initial_quantity: number
  }>('post', '/inventory/item/new', {
    name: '',
    description: '',
    location: '',
    initial_quantity: 0,
  });

  const typeOptions = types.map((type) => {
    return {
      value: type.id,
      label: `${type.icon} ${type.name}`,
    };
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    console.log(data);
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
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-6 h-6 text-[#1B2560]" />
            Add New Equipment
          </DialogTitle>
        </DialogHeader>
        {/* <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-[#1B2560]" />
                <span className="text-lg font-semibold text-gray-900">Add New Equipment</span>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter equipment name..."
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="rescue">Rescue Equipment</option>
                    <option value="medical">Medical Equipment</option>
                    <option value="tools">Tools & Equipment</option>
                    <option value="shelter">Shelter & Supply</option>
                    <option value="safety">Safety Equipment</option>
                    <option value="logistics">Logistics Equipment</option>
                  </select>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quantity..."
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter location..."
                  />
                </div>
  
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter description..."
                  />
                </div>
  
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter notes..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div> */}

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
                  onChange={(e) => setData('image', e.target.files?.[0])}
                  hidden
                  required
                />
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Type <span className="text-red-500">*</span>
                </Label>
                {/* <Input
                  id="type"
                  value={data.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Chainsaw"
                  onChange={(e) => setData('name', e.target.value)}
                  /> */}
                <Select
                  options={typeOptions}
                  value={typeOptions.find(option => option.value === data.type_id)}
                  onChange={(newType) => setData('type_id', newType?.value)}
                  isClearable
                />
              </div>
              <div>
                <Label htmlFor="initial_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="initial_quantity"
                  type="number"
                  value={data.initial_quantity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1"
                  onChange={(e) => setData('initial_quantity', parseInt(e.target.value))}
                />
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
                />
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
                  placeholder="Example description"
                  />
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            type="submit"
            form="addInventoryItem"
            className="px-6 py-3 bg-[#1B2560] text-white rounded-md hover:bg-[#2A3B70] transition-colors font-medium"
          >Add Inventory Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}