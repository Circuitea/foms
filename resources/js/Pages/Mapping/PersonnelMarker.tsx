import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PersonnelMarkerDetails } from "@/types";
import { Clock, MapPin, User, X } from "lucide-react";
import { useState } from "react";
import { Marker, Popup } from "react-leaflet";

export default function PersonnelMarker({ marker, isClickable }: { marker: PersonnelMarkerDetails, isClickable: boolean}) {
    const [ isOpen, setOpen ] = useState(false);
    const [ position, setPosition ] = useState(marker.position);
     

    function onMarkerClick() {
        if (isClickable) {
            setOpen(true);
        }
    }

    return (
        <div>
            <Marker position={marker.position} eventHandlers={{click: onMarkerClick}}/>
            <Dialog open={isOpen} onOpenChange={setOpen}>
                <DialogContent className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <User className="w-6 h-6 text-blue-600" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{marker.personnel.first_name} {marker.personnel.surname}</h3>
                                <p className="text-sm text-gray-600">Sex Master</p>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Current Status */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Current Status</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <div
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}
                            >
                                <div
                                className={`w-2 h-2 rounded-full mr-1`}
                                ></div>
                                {"Active"}
                            </div>
                            </div>
                            <div>
                            <p className="text-sm text-gray-600">Current Location</p>
                            <div className="flex items-center text-sm font-medium text-gray-900">
                                <MapPin className="w-4 h-4 mr-1" />
                                {"On-site"}
                            </div>
                            </div>
                        </div>
                        </div>
        
                        {/* Location History */}
                        <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Recent Location History</h4>
                        <div className="space-y-3">
                            {(['1', '2', '3']).map((location, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex-shrink-0 mt-1">
                                <div className={`w-3 h-3 rounded-full ${index === 0 ? "bg-green-500" : "bg-gray-400"}`}></div>
                                </div>
                                <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-medium text-gray-900">1</h5>
                                    <span className="text-xs text-gray-500">2</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Location: 3</p>
                                {index === 0 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                                    Current Location
                                    </span>
                                )}
                                </div>
                            </div>
                            ))}
                            {/* {(!mockLocationHistory[selectedPersonnelForDetail.id] ||}
                            mockLocationHistory[selectedPersonnelForDetail.id].length === 0) && (
                            <div className="text-center py-8">
                                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500">No location history available</p>
                            </div>
                            ) */}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <button
                            onClick={() => setOpen(false)}
                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                        Close
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>            
        </div>
    );
}