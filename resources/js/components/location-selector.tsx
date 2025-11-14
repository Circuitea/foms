import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ZoomControl from "@/Pages/Mapping/Partials/ZoomControl";
import { PropsWithChildren, useRef, useState } from "react";
import { TileLayer, GeoJSON, Marker, useMapEvent, Polyline, Polygon, Rectangle } from "react-leaflet";
import { MapContainer, MapRef } from "react-leaflet/MapContainer";
import SanJuanBoundary from '../Pages/Mapping/sanjuan-boundary.json';
import { Icon, icon, latLng, LatLng, latLngBounds } from "leaflet";
import { geojsonToPoints } from "@/lib/utils";

const bounds = latLngBounds(geojsonToPoints(SanJuanBoundary)).pad(0.05)

export function LocationSelector({ onSetLocation } : { onSetLocation: (loc: LatLng) => void }) {
  const [open, setOpen] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState<LatLng | null>(null);
  const map = useRef<MapRef>(null);

  const handleConfirm = () => {
    if (!!pinnedLocation) {
      onSetLocation(pinnedLocation)
      setOpen(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button type="button">Select Location</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex">
          <MapContainer
            ref={map}
            className='flex-1 min-h-0 h-full z-0'
            center={[14.6034363, 121.0389469]}
            zoom={15}
            scrollWheelZoom={false}
            zoomControl={false}
            doubleClickZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl />
            <GeoJSON
              style={{color: '#0000CC', weight: 4}}
              // @ts-ignore
              data={SanJuanBoundary}
            />

            {/* <Polyline pathOptions={{ color: 'blue' }} positions={geojsonToPoints(SanJuanBoundary)} /> */}
            {/* <Polyline pathOptions={{ color: 'blue' }} positions={sanJuanBoundary} /> */}
            {/* <Rectangle bounds={bounds} /> */}

            <PinnedLocation location={pinnedLocation} onLocationChange={setPinnedLocation}/>
          </MapContainer>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="flex gap-2">
            <span>Pinned Location:</span>
            <span>Lat: {pinnedLocation?.lat.toFixed(6)}</span>
            <span>Long: {pinnedLocation?.lng.toFixed(6)}</span>
          </div>
          <div>
            {!!pinnedLocation ? bounds.contains(pinnedLocation) ? (
              <Button
                disabled={!pinnedLocation}
                onClick={handleConfirm}
              >
                Set Location
              </Button>
            ) : (
              <ConfirmLocationDialog onConfirm={handleConfirm}>
                <Button
                  disabled={!pinnedLocation}
                >
                  Set Location
                </Button>
              </ConfirmLocationDialog>
            ) : null}
            
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PinnedLocation({ location, onLocationChange }: { location: LatLng | null, onLocationChange: (loc: LatLng | null) => void }) {
  const map = useMapEvent('click', (e) => {
    onLocationChange(e.latlng);
  });

  return location === null ? null : (
    <Marker position={location} />
  )
}

function ConfirmLocationDialog({ onConfirm, children }: PropsWithChildren<{ onConfirm: () => void }>) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Location</DialogTitle>
        </DialogHeader>
        <span>Are you sure you want to use this location? The location you set is outside San Juan city.</span>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            onConfirm();
            setOpen(false);
          }}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}