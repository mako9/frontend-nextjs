import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/map.module.css';

const Map = (communityMarker: CommunityMarker) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !map) {
      const map = L.map('map').setView([communityMarker.latitude, communityMarker.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

      const greenIcon = L.icon({
        iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    
        iconSize:     [38, 95], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });

      L.marker([communityMarker.latitude, communityMarker.longitude], {icon: greenIcon})
      .addTo(map)
      .bindPopup(communityMarker.name)
      .openPopup();
  
      L.circle([communityMarker.latitude, communityMarker.longitude], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: communityMarker.radius
      }).addTo(map);

      setMap(
        map
      );
    }
  }, []);

  return (<div id="map" className={styles.map} />);
};

export default Map;

export type CommunityMarker = {
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
}