import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn } from "@/lib/utils";
import { PageProps, Personnel } from "@/types";
import { Task, TaskPriority, TaskType } from "@/types/tasks";
import { Link } from "@inertiajs/react";
import dayjs from "dayjs";
import { useForm } from "laravel-precognition-react-inertia";
import { AlertCircle, ArrowLeft, CheckCheck, ChevronDown, Clipboard, Info, MinusCircle, Plus, PlusCircle, Truck, Users, XCircle } from "lucide-react";
import { FormEventHandler, useState } from "react";
import Select from 'react-select';
import { InventoryItems, ItemSelection, ItemSelectionDialog } from "./ItemSelectionDialog";
import { Badge } from "@/components/ui/badge";

type NewTaskEntry = Pick<Task, 'title' | 'description' | 'location' | 'due_date' | 'duration'> & {
  creator_id?: number;
  type_id?: number;
  priority_id?: number;
  items: {
    equipment: number[];
    consumables: ({ id: number; count: number; })[];
  };
  personnel?: number[];
};

type CreateTaskProps = PageProps<{
  types: TaskType[],
  priorities: TaskPriority[],
  personnel: Personnel[],
  items: InventoryItems,
}>;

export default function NewTask({ types, priorities, items, personnel }: CreateTaskProps) {
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isItemSelectionDialogOpen, setItemSelectionDialogOpen] = useState(false);
  const { data, setData, submit, invalid, validate, errors, processing } = useForm<NewTaskEntry>('post', '/tasks/new', {
    title: '',
    description: '',
    location: '',

    due_date: dayjs().second(0).millisecond(0).toJSON(),
    duration: 120,

    items: {
      equipment: [],
      consumables: [],
    },

    personnel: [],
  });

  const totalCount = data.items.equipment.length + data.items.consumables.length;

  const typeOptions = types.map((type) => {
    return {
      value: type.id,
      label: type.name,
    };
  });

  const priorityOptions = priorities.map((priority) => {
    return {
      value: priority.id,
      label: priority.name,
    };
  });

  const personnelOptions = personnel.map(person => ({
    value: person.id,
    label: `${person.first_name} ${person.surname.charAt(0)}.`,
  }))

  const submitForm: FormEventHandler = (e) => {
    e.preventDefault();

    submit()
  }

  const equipmentItems = items.equipment
    .map(group => group.items)
    .flat();

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#1B2560] flex items-center gap-2">
            <CheckCheck className="w-6 h-6 text-[#1B2560]" />
            Create New Task
          </h1>
        </div>

        <form onSubmit={submitForm} className="space-y-6">
          <Card className="border-gray-200 shadow-xs">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-[#1B2560]">
                <Clipboard className="w-5 h-5" />
                Task Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type_id" className="text-gray-700 font-medium">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    inputId="type_id"
                    value={typeOptions.find(option => option.value === data.type_id)}
                    options={typeOptions}
                    onChange={(newType) => setData('type_id', newType?.value)}
                    onBlur={() => validate('type_id')}
                    isClearable
                    required
                  />
                  {invalid('type_id') && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span className="break-words">{errors.type_id}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority_id" className="text-gray-700 font-medium">
                    Priority <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    inputId="priority_id"
                    value={priorityOptions.find(priority => priority.value === data.priority_id)}
                    options={priorityOptions}
                    onChange={(newPriority) => setData('priority_id', newPriority?.value)}
                    onBlur={() => validate('priority_id')}
                    isClearable
                    required
                  />

                  {invalid('priority_id') && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span className="break-words">{errors.priority_id}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 font-medium">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    required
                    placeholder="e.g. Flood Response - Brgy. Kabayanan"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    onBlur={() => validate('title')}
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                  {invalid('title') && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span className="break-words">{errors.title}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 font-medium">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="description"
                    required
                    placeholder="e.g. Respond to Emergency Call of Flooding in Brgy. Kabayanan"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    onBlur={() => validate('description')}
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                  {invalid('description') && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span className="break-words">{errors.description}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-medium">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    required
                    placeholder="F. Manalo St. cor. F. Bluementritt"
                    value={data.location}
                    onChange={(e) => setData('location', e.target.value)}
                    onBlur={() => validate('location')}
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                  {invalid('description') && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span className="break-words">{errors.description}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-xs">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="flex items-end gap-2 text-[#1B2560]">
                <Truck className="w-5 h-5" />
                Task Due Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="due_date" className="text-gray-700 font-medium">
                    Due Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        className="w-full bg-white text-black border-gray-300 focus:border-[#1B2560] focus:ring-[$1B2560] justify-between hover:bg-gray-50"
                      >
                        {dayjs(data.due_date).format('MMM DD, YYYY hh:mm A')}
                        <ChevronDown className={cn(
                          'transition-transform duration-300',
                          isDatePickerOpen ? "rotate-180" : "rotate-0"
                        )} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-2" align="start">
                      <Calendar
                        mode="single"
                        className="w-full"
                        selected={dayjs(data.due_date).toDate()}
                        onSelect={(newDate) => {
                          const {years, months, date} = dayjs(newDate).toObject();
                          const due_date = dayjs(data.due_date).year(years).month(months).date(date);

                          setData('due_date', due_date.toJSON());
                        }}
                        required
                      />
                      <Label htmlFor="due_time" className="text-gray-700 font-medium">
                        Time <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="due_time"
                        type="time"
                        required
                        value={dayjs(data.due_date).format('HH:mm')}
                        onChange={(e) => {
                          const {hours, minutes} = dayjs(e.target.value, 'HH:mm').toObject();
                          const due_date = dayjs(data.due_date).hour(hours).minute(minutes);

                          setData('due_date', due_date.toJSON());
                        }}
                      />
                    </PopoverContent>
                  </Popover>

                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-700 font-medium">
                    Duration <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={data.duration}
                    onChange={(e) => setData('duration', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>

          </Card>
          <Card className="border-gray-200 shadow-xs">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-[1fr_2%_1fr] gap-2">
              <div className="space-y-4">
                <div className="bg-gray-50/50">
                  <h1 className="font-bold flex items-end gap-2 text-[#1B2560]">
                    <Truck className="w-5 h-5" />
                    Task Equipment
                  </h1>
                </div>
                <Button type="button" onClick={() => setItemSelectionDialogOpen(true)}>
                  Select Inventory Items
                </Button>
                <ItemSelectionDialog
                  items={items}
                  selected={data.items}
                  onConfirm={(selected) => {
                    setData('items', selected);
                    validate('items');
                  }}
                  onClose={() => setItemSelectionDialogOpen(false)}
                  isOpen={isItemSelectionDialogOpen}
                />

                {totalCount > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="font-medium text-sm mb-2">Selected Items ({totalCount})</h4>
                    <div className="flex flex-wrap gap-1">
                      {data.items.equipment.map((selection) => (
                        <Badge key={selection} variant="secondary">
                          {equipmentItems.find(item => item.id === selection)?.name}
                        </Badge>
                      ))}
                      {data.items.consumables.map((selection) => (
                        <Badge key={selection.id} variant="secondary">
                          {items.consumables.find(item => item.id === selection.id)?.name}
                          {selection.count && ` (${selection.count})`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="col-start-3">
                <div className="bg-gray-50/50 mb-4">
                  <h1 className="font-bold flex items-end gap-2 text-[#1B2560]">
                    <Users className="w-5 h-5" />
                    Task Personnel
                  </h1>
                </div>

                <Label htmlFor="personnel">Personnel</Label>
                <Select
                  inputId="personnel"
                  isSearchable
                  isMulti
                  options={personnelOptions}
                  closeMenuOnSelect={false}
                  menuPlacement="top"
                  value={personnelOptions.filter(option => data.personnel?.includes(option.value))}
                  onChange={(newPersonnel) =>
                    setData('personnel', newPersonnel?.map(newPerson => newPerson.value))
                  }
                />
              </div>

            </CardContent>
          </Card>
          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/tasks">
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={processing}>Submit</Button>
          </div>
        </form>
      </div>
    </>
  );
}

NewTask.layout = (e: JSX.Element) => <Authenticated PageIcon={CheckCheck} pageTitle="New Task" children={e} />