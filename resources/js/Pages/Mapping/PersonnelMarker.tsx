import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PersonnelMarkerDetails } from "@/types";
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{marker.personnel.first_name}'s Location</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>            
        </div>
    );
}