import * as L from 'leaflet'
import { useEffect, useRef } from 'react'
import { FeatureGroup } from 'react-leaflet'
import './GeoJSONFeatureGroup.css'

interface IProps {}

// TODO: separate data-loading and rendering
export function GeoJSONFeatureGroup(_props: IProps) {
  const ref = useRef<L.FeatureGroup>(null)

  useEffect(() => {
    async function run() {
      const res = await fetch('/data/van-local-area-boundaries.json')
      const json = await res.json()

      const featureGroup = ref.current
      if (!featureGroup) {
        throw new Error('Unable to render as FeatureGroup is null')
      }

      featureGroup.clearLayers()
      for (const entry of json.results) {
        if (!entry.geom || entry.geom.type !== 'Feature') {
          console.warn(`Invalid geometry for ${entry.name}`, entry)
          continue
        }

        const geoJSON = L.geoJSON(entry.geom).eachLayer((layer) => {
          featureGroup.addLayer(layer)
        })

        // TODO: move labels to separate layer that can be toggled separately
        L.marker(geoJSON.getBounds().getCenter(), {
          icon: L.divIcon({
            className: 'map-area-label',
            html: entry.name,
            iconSize: [100, 40],
          }),
        }).addTo(featureGroup)
      }
    }

    run().catch((err) => console.error('Error loading GeoJSON', err))
  }, [])

  return <FeatureGroup ref={ref} />
}
