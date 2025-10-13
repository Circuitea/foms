import { useContext, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { useSidebar } from "./ui/sidebar";
import axios, { AxiosResponse } from "axios";
import { Status } from "@/types";
import { usePage } from "@inertiajs/react";
import { StatusContext, StatusDispatchContext, useStatus, useStatusDispatch } from "@/context/status-context";
import { Button } from "./ui/button";
import { AlarmClockOff, CircleCheck, Coffee, LucideIcon, ShieldAlert } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface StatusOption {
  value: Status;
  label: string;
  buttonStyle: string;
  tooltipStyle: string;
  selectedStyle: string;
  icon: LucideIcon;
}

export function StatusSelector() {
  const status = useStatus();
  const dispatch = useStatusDispatch();
  
  const { open } = useSidebar();

  const statusOptions: StatusOption[] = [
    {
      value: 'available',
      label: 'Available',
      buttonStyle: 'hover:bg-green-200',
      tooltipStyle: 'bg-green-800',
      selectedStyle: 'bg-green-200 text-black',
      icon: CircleCheck,
    },
    {
      value: 'on break',
      label: 'On Break',
      buttonStyle: 'hover:bg-yellow-200',
      tooltipStyle: 'bg-yellow-500 text-black',
      selectedStyle: 'bg-yellow-200 text-black',
      icon: Coffee,
    },
    {
      value: 'unavailable',
      label: 'Off Duty',
      buttonStyle: 'hover:bg-gray-200',
      tooltipStyle: 'bg-gray-500',
      selectedStyle: 'bg-gray-200 text-black',
      icon: AlarmClockOff,
    },
    {
      value: 'emergency',
      label: 'Emergency',
      buttonStyle: 'hover:bg-red-200',
      tooltipStyle: 'bg-red-800',
      selectedStyle: 'bg-red-200 text-black',
      icon: ShieldAlert,
    },
  ];

  const handleStatusChange = async (newStatus: string) => {
    const response: AxiosResponse<{ status: Status | null }> = await axios.post('/api/status', {
      status: newStatus
    });

    if (response.status === 200 && response.data) {
      dispatch({
        type: 'set',
        status: response.data.status ?? 'unavailable',
      });
    }
  }

  return open ? (
    <div className="flex gap-2 items-baseline w-full">
      {/* <Label htmlFor="status">Status</Label> */}
      {/* <Select disabled={status === 'assigned'} value={status ?? ''} onValueChange={handleStatusChange}>
        <SelectTrigger className="bg-white text-black">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(option => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >{option.label}</SelectItem>
          ))}        
        </SelectContent>
      </Select> */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {statusOptions.map(option => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-10 h-10",
                  option.buttonStyle,
                  status === option.value && option.selectedStyle,
                )}
                onClick={() => handleStatusChange(option.value)}
              >
                <option.icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent className={option.tooltipStyle}>{option.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  ) : null;
}