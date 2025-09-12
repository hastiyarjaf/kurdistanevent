
import React, { useEffect, useRef } from 'react';
import type { Event, Language } from '../types';

declare const L: any;

interface EventMapProps {
  events: Event[];
  lang: Language;
  onSelectEvent: (event: Event) => void;
}

export const EventMap: React.FC<EventMapProps> = ({ events, lang, onSelectEvent }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any>(null);

  useEffect(() => {
    if (typeof L === 'undefined' || !mapContainerRef.current) {
      return;
    }

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([33.3152, 44.3661], 6); // Centered on Iraq

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }
    
    // Clear previous markers
    if (markersRef.current) {
        mapRef.current.removeLayer(markersRef.current);
    }
    
    markersRef.current = L.markerClusterGroup();
    const validEvents = events.filter(e => e.coordinates);

    validEvents.forEach(event => {
      const marker = L.marker([event.coordinates!.lat, event.coordinates!.lon]);
      marker.on('click', () => onSelectEvent(event));
      markersRef.current.addLayer(marker);
    });

    mapRef.current.addLayer(markersRef.current);

    if (validEvents.length > 0) {
        const bounds = L.latLngBounds(validEvents.map(e => [e.coordinates!.lat, e.coordinates!.lon]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // No cleanup function needed for markersRef as we manage it at the start of the effect.
  }, [events, lang, onSelectEvent]);

  return <div ref={mapContainerRef} className="h-[60vh] w-full rounded-lg z-0 container mx-auto" />;
};