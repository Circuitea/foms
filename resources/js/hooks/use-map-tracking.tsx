import { PageProps, PersonnelLocation, Status } from "@/types";
import { usePage } from "@inertiajs/react";
import { useEcho } from "@laravel/echo-react";
import { id } from "date-fns/locale";
import { useState } from "react";

export const ALL_STATUSES: Status[] = ['available', 'on break', 'unavailable', 'emergency'];

export function useMapTracking() {
  const { locations: initialLocations } = usePage<PageProps<{ locations: Record<number, PersonnelLocation> }>>().props;
  const [locations, setLocations] = useState<Record<number, PersonnelLocation>>(initialLocations);
  const [hiddenPersonnel, setHiddenPersonnel] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>(ALL_STATUSES);

  const personnel = Object.entries(locations).map(([_, location]) => location.personnel);
  const visiblePersonnel = personnel.filter(person => !hiddenPersonnel.includes(person.id) && selectedStatuses.includes(person.status));

  useEcho<{ location: PersonnelLocation }>('location', 'LocationUpdated', ({ location }) => {
    setLocations({
      ...locations,
      [location.id]: location,
    });
  });

  useEcho<{ locations: PersonnelLocation[] }>('location', 'LocationSynced', ({ locations }) => {
      console.log(locations);
      let newLocations: Record<number, PersonnelLocation> = {};
  
      locations.forEach(location => {
        newLocations = {
          ... newLocations,
          [location.id]: location,
        };
      });
      setLocations(newLocations);
    });

  function togglePersonnelHide(id: number) {
    if (hiddenPersonnel.includes(id)) {
      setHiddenPersonnel(hiddenPersonnel.filter(hiddenID => hiddenID !== id));
    } else {
      setHiddenPersonnel([...hiddenPersonnel, id ]);
    }
  }

  return {
    locations: Object.fromEntries(Object.entries(locations).filter(([_, location]) => !hiddenPersonnel.includes(location.personnel.id) && selectedStatuses.includes(location.personnel.status))),
    selectedStatuses,
    personnel,
    visiblePersonnel,
    togglePersonnelHide,
    setSelectedStatuses,

  }
}