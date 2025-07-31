import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useRealTimeClock } from "@/hooks/use-clock";
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

type NewTaskEntry = Pick<Task, 'title' | 'description' | 'location' | 'due_date' | 'duration'> & {
  creator_id?: number,
  type_id?: number,
  priority_id?: number,
  equipment_items: {
    id?: number,
    quantity: number,
  }[]
  personnel?: number[],
};

interface ItemEntry {
  id: number;
  name: string;
  description: string;
  amount: number;
}

type CreateTaskProps = PageProps<{
  types: TaskType[],
  priorities: TaskPriority[],
  items: ItemEntry[],
  personnel: Personnel[],
}>;

export default function NewTask({ types, priorities, items, personnel }: CreateTaskProps) {
  const currentDateTime = useRealTimeClock();
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const { data, setData, submit, invalid, validate, errors, processing } = useForm<NewTaskEntry>('post', '/tasks/new', {
    title: '',
    description: '',
    location: '',

    due_date: dayjs().second(0).millisecond(0).toJSON(),
    duration: 120,

    equipment_items: [{quantity: 0}],
  });

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

  const itemOptions = items.map(item => ({
    value: item.id,
    label: `${item.name} (Available: ${item.amount})`,
  }));

  const personnelOptions = personnel.map(person => ({
    value: person.id,
    label: `${person.first_name} ${person.surname.charAt(0)}.`,
  }))

  const submitForm: FormEventHandler = (e) => {
    e.preventDefault();

    submit()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-[#1B2560] px-4 md:px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
              <Link href='/tasks'>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tasks
              </Link>
            </Button>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-white">{currentDateTime} </div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-300">TODO: Proper Breadcrumbing</div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#1B2560] flex items-center gap-2">
            <CheckCheck className="w-6 h-6 text-[#1B2560]" />
            Create New Task
          </h1>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
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
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
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
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
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
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
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
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words">{errors.description}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
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
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="flex items-end gap-2 text-[#1B2560]">
                <Truck className="w-5 h-5" />
                Task Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.equipment_items.map((item, i) => (
                <div key={i+1} className="flex items-end gap-2 w-full">
                  <div className="flex-[8]">
                    <Label htmlFor={`equipment_item_${i+1}`}>Equipment Item</Label>
                    <Select
                      inputId={`equipment_item_${i+1}`}
                      options={itemOptions.filter(option => !data.equipment_items.some(item => item.id === option.value && data.equipment_items.indexOf(item) !== i))}
                      value={itemOptions.find(option => option.value === data.equipment_items[i].id)}
                      onChange={(newItem) => {
                        const equipment_items = data.equipment_items;
                        equipment_items[i] = { ...equipment_items[i], id: newItem?.value || 0 }
                        setData('equipment_items', equipment_items);
                      }}
                      isClearable
                    />
                  </div>
                  <div className="w-20 flex-shrink-0">
                    <Label htmlFor={`equipment_item_quantity_${i+1}`}>Quantity</Label>
                    <Input
                      id={`equipment_item_quantity_${i+1}`}
                      type="number"
                      value={item.quantity}
                      max={data.equipment_items[i].id ? items.find(item => item.id === data.equipment_items[i].id)?.amount : 0}
                      min={0}
                      onChange={(e) => {
                        const equipment_items = data.equipment_items;
                        equipment_items[i] = {...equipment_items[i], quantity: parseInt(e.target.value) };
                        setData('equipment_items', equipment_items);
                      }}
                      disabled={!data.equipment_items[i].id}
                    />
                  </div>
                  {data.equipment_items.length > 1 && (
                    <Button
                      type="button"
                      variant='outline'
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => {
                        setData('equipment_items', data.equipment_items.filter((_, index) => index !== i ))
                      }}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={() => setData('equipment_items', [...data.equipment_items, {id: 0, quantity: 0}])} variant="outline" className="mt-2 w-full">
                <PlusCircle className="w-4 h-4" />
                Add
              </Button>
            </CardContent>
          </Card>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="flex items-end gap-2 text-[#1B2560]">
                <Users className="w-5 h-5" />
                Task Personnel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                isMulti
                options={personnelOptions}
                closeMenuOnSelect={false}
                menuPlacement="top"
              />
            </CardContent>
          </Card>
          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/tasks">
                Cancel
              </Link>
            </Button>
            <Button disabled={processing}>Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

NewTask.layout = (e: JSX.Element) => <Authenticated children={e} />