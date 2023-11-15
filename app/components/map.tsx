import React, { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from '../styles/map.module.css'

const Map = (communityMarker: CommunityMarker) => {
    const [map, setMap] = useState(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && !map) {
            const map = L.map('map').setView(
                [communityMarker.latitude, communityMarker.longitude],
                13
            )
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(map)

            var greenIcon = new L.Icon({
                iconUrl:
                    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                shadowUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            })

            L.marker([communityMarker.latitude, communityMarker.longitude], {
                icon: greenIcon,
            })
                .addTo(map)
                .bindPopup(communityMarker.name)
                .openPopup()

            L.circle([communityMarker.latitude, communityMarker.longitude], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: communityMarker.radius,
            }).addTo(map)

            setMap(map)
        }
    }, [])

    return <div id="map" className={styles.map} />
}

export default Map

export type CommunityMarker = {
    name: string
    latitude: number
    longitude: number
    radius: number
}
