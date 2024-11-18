import type { FeatureCollection } from 'geojson'
import * as L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { LayersControl, MapContainer, TileLayer } from 'react-leaflet'
import { EditControl } from './EditControl'
import { GeoJSONFeatureGroup } from './GeoJSONFeatureGroup'

// const initialBounds = L.latLngBounds([24, -126], [50, -66])
const initialView: L.LatLngExpression = { lat: 49.1895166, lng: -123.004237 }

// const latlngs: L.LatLngTuple[] = [
//   [37, -109.05],
//   [41, -109.03],
//   [41, -102.05],
//   [37, -102.04],
// ]

interface IProps {
  editMode: boolean
}

export function Map({ editMode }: IProps) {
  const [geoJSON, setGeoJSON] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: [],
  })

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
      />

      <LayersControl position="topright">
        <LayersControl.Overlay name="City neighborhoods">
          <GeoJSONFeatureGroup />
        </LayersControl.Overlay>

        <LayersControl.Overlay name="Custom boundaries">
          {/* <MapHandler /> */}
          <EditControl value={geoJSON} onChange={setGeoJSON} />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
}

// Vancouver neighbourhoods
// https://opendata.vancouver.ca/explore/dataset/local-area-boundary/api/?disjunctive.name&location=12,49.24741,-123.12429
// https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/local-area-boundary/records?limit=25

// Full draw/edit
// https://leaflet.github.io/Leaflet.draw/docs/examples/full.html
// https://github.com/alex3165/react-leaflet-draw
