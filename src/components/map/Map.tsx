import * as L from 'leaflet'
import { useState } from 'react'
import { MapContainer, Polygon, TileLayer, useMapEvent } from 'react-leaflet'

// const initialBounds = L.latLngBounds([24, -126], [50, -66])
const initialView: L.LatLngExpression = { lat: 49.1895166, lng: -123.004237 }

// const latlngs: L.LatLngTuple[] = [
//   [37, -109.05],
//   [41, -109.03],
//   [41, -102.05],
//   [37, -102.04],
// ]

// <Polygon pathOptions={purpleOptions} positions={polygon} />
const purpleOptions = { color: 'purple' }

const MapHandler = () => {
  const [latlngs, setLatlngs] = useState<L.LatLng[]>([])

  const map = useMapEvent('click', (event: L.LeafletMouseEvent) => {
    setLatlngs((prev) => [...prev, event.latlng])
  })

  return <Polygon pathOptions={purpleOptions} positions={latlngs} />
}

export function Map() {
  return (
    <MapContainer
      center={initialView}
      zoom={11}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={14}
      />

      <MapHandler />
    </MapContainer>
  )
}

// Vancouver neighbourhoods
// https://opendata.vancouver.ca/explore/dataset/local-area-boundary/api/?disjunctive.name&location=12,49.24741,-123.12429

// Full draw/edit
// https://leaflet.github.io/Leaflet.draw/docs/examples/full.html
// https://github.com/alex3165/react-leaflet-draw
