import * as L from "leaflet"
import { MapContainer, TileLayer } from "react-leaflet"

// const initialBounds = L.latLngBounds([24, -126], [50, -66])
const initialView: L.LatLngExpression = { lat: 49.1895166, lng: -123.004237 }

export function Map() {
  return (
    <MapContainer
      center={initialView}
      zoom={11}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={14}
      />
    </MapContainer>
  )
}
