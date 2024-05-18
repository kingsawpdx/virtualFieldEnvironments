import { useState, useCallback } from 'react';
import { Hotspot3D } from './DataStructures';

// Change type to interface
export type VisitedState = Record<string, Hotspot3D[]>;

export function useVisitedState(initialHotspots: VisitedState) {
  // Change to function declaration
  function initializeVisitedState() {
    // Use Record instead of inline type declaration
    const initialVisitedState: Record<string, Record<string, boolean>> = {};

    console.log('initial', initialVisitedState);

    // Simplify initialization without unnecessary conditional
    for (const [psId, hotspots] of Object.entries(initialHotspots)) {
      initialVisitedState[psId] = Object.fromEntries(
        hotspots.map((hotspot) => [hotspot.id, false])
      );
    }
    return initialVisitedState;
  }

  const [visited, setVisited] = useState<Record<string, Record<string, boolean>>>(
    initializeVisitedState()
  );

  console.log('visited', visited);

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
