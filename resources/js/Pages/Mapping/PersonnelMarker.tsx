import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PersonnelMarkerDetails } from "@/types";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Marker, Popup } from "react-leaflet";

export default function PersonnelMarker({marker}: {marker: PersonnelMarkerDetails}) {
    const [ isOpen, setOpen ] = useState(false);
    const [ position, setPosition ] = useState(marker.position);
     

    function onMarkerClick() {
        setOpen(true);
    }

    return (
        <div>
            <Marker position={marker.position} eventHandlers={{click: onMarkerClick}}/>
            <Dialog open={isOpen} onOpenChange={setOpen}>
                <DialogContent className="w-2/3">
                    <DialogHeader>
                        <DialogTitle className="flex flex-row items-center">
                            <Clock />
                            <span className="pl-2">Recent Activity</span>
                            
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-row w-full justify-between">
                        <div className="flex flex-col w-full items-center pt-5 pr-5">
                            <Avatar className="w-20 h-20">
                                <AvatarFallback>PS</AvatarFallback>
                            </Avatar>
                            <p>{marker.personnel.first_name} {marker.personnel.surname}</p>
                            <p>Supervisor</p>
                            <p>{marker.personnel.email}</p>
                        </div>
                        <div className="w-0.5 bg-blue-900" />
                        <div className="w-full">
                            locations
                        </div>
                    </div>
                </DialogContent>
            </Dialog>            
        </div>
    );
}