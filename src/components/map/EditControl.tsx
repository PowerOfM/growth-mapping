import type { FeatureCollection } from 'geojson'
import * as L from 'leaflet'
import { useEffect, useRef } from 'react'
import { FeatureGroup } from 'react-leaflet'
import { DrawControl } from './DrawControl'

interface IProps {
  value: FeatureCollection
  onChange: (geojson: FeatureCollection) => void
}

export function EditControl({ value, onChange }: IProps) {
  const ref = useRef<L.FeatureGroup>(null)

  useEffect(() => {
    const featureGroup = ref.current
    if (!featureGroup) return

    if (!value || ref.current.getLayers().length) return

    L.geoJSON(value).eachLayer((layer) => {
      if (
        layer instanceof L.Polyline ||
        layer instanceof L.Polygon ||
        layer instanceof L.Marker
      ) {
        if (layer.feature?.properties.radius) {
          new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
            radius: layer.feature?.properties.radius,
          }).addTo(featureGroup)
        } else {
          featureGroup.addLayer(layer)
        }
      }
    })
  }, [value])

  const handleChange = () => {
    const geo = ref.current?.toGeoJSON()
    if (geo?.type === 'FeatureCollection') {
      onChange(geo)
    }
  }

  return (
    <FeatureGroup ref={ref}>
      <DrawControl
        position="topright"
        onEdited={handleChange}
        onCreated={handleChange}
        onDeleted={handleChange}
        draw={{
          circle: {},
          polyline: {},
          polygon: {},
        }}
      />
    </FeatureGroup>
  )
}
