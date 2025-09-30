import { useContext, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { useSidebar } from "./ui/sidebar";
import axios, { AxiosResponse } from "axios";
import { Status } from "@/types";
import { usePage } from "@inertiajs/react";
import { StatusContext, StatusDispatchContext, useStatus, useStatusDispatch } from "@/context/status-context";

export function StatusSelector() {
  const status = useStatus();
  const dispatch = useStatusDispatch();
  
  const { open } = useSidebar();


  const statusOptions = [
    {
      value: 'available',
      label: 'Available',
    },
    {
      value: 'assigned',
      label: 'Assigned to Task',
      disabled: true
    },
    {
      value: 'on leave',
      label: 'On Leave',
    },
    {
      value: 'emergency',
      label: 'In Emergency',  
    }
  ];

  const handleStatusChange = async (newStatus: string) => {
    const response: AxiosResponse<{ status: Status | null }> = await axios.post('/api/status', {
      status: newStatus
    });

    if (response.status === 200 && response.data) {
      dispatch({
        type: 'set',
        status: response.data.status ?? 'on leave',
      });
    }
  }

  return open ? (
    <div className="flex gap-2 items-baseline">
      <Label htmlFor="status">Status</Label>
      <Select disabled={status === 'assigned'} value={status ?? ''} onValueChange={handleStatusChange}>
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
      </Select>
    </div>
  ) : null;
}