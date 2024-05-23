import { useState, useCallback, useEffect } from 'react';
import { Hotspot3D } from './DataStructures';

export type VisitedState = Record<string, Record<string, boolean>>;

export function useVisitedState(initialHotspots: Record<string, Hotspot3D[]>) {

  // Function to initialize state from local storage or initial hotspots
  function initializeVisitedState(): VisitedState {
    const storedState: string | null = localStorage.getItem('visitedState');
    const parsedStoredState: VisitedState = storedState ? JSON.parse(storedState) as VisitedState : {};
    
    const initialVisitedState: VisitedState = {};
    
    for (const [psId, hotspots] of Object.entries(initialHotspots)) {
      initialVisitedState[psId] = Object.fromEntries(
        hotspots.map((hotspot) => [
          hotspot.id,
          parsedStoredState[psId][hotspot.id] || false,
        ])
      );
    }

    //if a hotspot is deleted, we want to make sure its psID is not in the visited list anymore
   /* const cleanState: VisitedState = {};

    for (const psId in parsedStoredState) {
      if (initialHotspots[psId]) {
        cleanState[psId] = {};
        for (const hotspotId in parsedStoredState[psId]) {
          if (initialHotspots[psId].some(hotspot => hotspot.id === hotspotId)) {
            cleanState[psId][hotspotId] = parsedStoredState[psId][hotspotId];
          }
        }
      }
    }*/
    return initialVisitedState;
  }

  // State to manage visited hotspots
  const [visited, setVisited] = useState<VisitedState>(initializeVisitedState());

  // Store state in local storage 
  useEffect(() => {
    localStorage.setItem('visitedState', JSON.stringify(visited));
  }, [visited]);

  // Function to mark hotspot as visited
  const handleVisit = useCallback((photosphereId: string, hotspotId: string) => {
    setVisited((prevState) => ({
      ...prevState,
      [photosphereId]: {
        ...prevState[photosphereId],
        [hotspotId]: true,
      },
    }));
  }, []);

  return [visited, handleVisit] as const;
}
