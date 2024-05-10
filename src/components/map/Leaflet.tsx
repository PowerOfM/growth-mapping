import * as L from "leaflet"
import { useEffect, useLayoutEffect, useRef } from "react"

const initialView: L.LatLngTuple = [39.8283, -98.5795]

interface IProps {
  bounds: L.LatLngBounds
}

export function Leaflet({ bounds }: IProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | undefined>()

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    console.log("creating leaflet on", node)
    const map = L.map(node, { preferCanvas: true })
    map.setView(initialView, 5)
    // .fitBounds(bounds)
    // .on('zoom', (e) => dispatch('zoom', e));

    setTimeout(() => {
      if (map) {
        map.invalidateSize()
        map.fitBounds(bounds)
      }
    }, 250)

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
              &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
        subdomains: "abcd",
        maxZoom: 14,
      },
    ).addTo(map)
    mapRef.current = map

    function resizeMap() {
      if (map) {
        map.invalidateSize()
      }
    }
    window.addEventListener("resize", resizeMap)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = undefined
      }

      window.removeEventListener("resize", resizeMap)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    mapRef.current?.fitBounds(bounds)
  }, [bounds])

  return <div ref={ref} className="w-full h-full"></div>
}
