import { LeafletContextInterface, useLeafletContext } from '@react-leaflet/core'
import isEqual from 'fast-deep-equal'
import L, { LeafletEventHandlerFn } from 'leaflet'
import 'leaflet-draw'
import { useEffect, useRef } from 'react'

// Adapted from https://github.com/alex3165/react-leaflet-draw

interface IEventHandlers {
  onEdited: (e: L.DrawEvents.Edited) => void
  onDeleted: (e: L.DrawEvents.Deleted) => void
  onDrawStart: (e: L.DrawEvents.DrawStart) => void
  onDrawStop: (e: L.DrawEvents.DrawStop) => void
  onDrawVertex: (e: L.DrawEvents.DrawVertex) => void
  onEditStart: (e: L.DrawEvents.EditStart) => void
  onEditMove: (e: L.DrawEvents.EditMove) => void
  onEditResize: (e: L.DrawEvents.EditResize) => void
  onEditVertex: (e: L.DrawEvents.EditVertex) => void
  onEditStop: (e: L.DrawEvents.EditStop) => void
  onDeleteStart: (e: L.DrawEvents.DeleteStart) => void
  onDeleteStop: (e: L.DrawEvents.DeleteStop) => void
  onToolbarOpened: (e: L.DrawEvents.ToolbarOpened) => void
  onToolbarClosed: (e: L.DrawEvents.ToolbarClosed) => void
  onMarkerContext: (e: L.DrawEvents.MarkerContext) => void
}

const EVENT_HANDLERS: Array<[string, keyof IEventHandlers]> = [
  [L.Draw.Event.EDITED, 'onEdited'],
  [L.Draw.Event.DELETED, 'onDeleted'],
  [L.Draw.Event.DRAWSTART, 'onDrawStart'],
  [L.Draw.Event.DRAWSTOP, 'onDrawStop'],
  [L.Draw.Event.DRAWVERTEX, 'onDrawVertex'],
  [L.Draw.Event.EDITSTART, 'onEditStart'],
  [L.Draw.Event.EDITMOVE, 'onEditMove'],
  [L.Draw.Event.EDITRESIZE, 'onEditResize'],
  [L.Draw.Event.EDITVERTEX, 'onEditVertex'],
  [L.Draw.Event.EDITSTOP, 'onEditStop'],
  [L.Draw.Event.DELETESTART, 'onDeleteStart'],
  [L.Draw.Event.DELETESTOP, 'onDeleteStop'],
  [L.Draw.Event.TOOLBAROPENED, 'onToolbarOpened'],
  [L.Draw.Event.TOOLBARCLOSED, 'onToolbarClosed'],
  [L.Draw.Event.MARKERCONTEXT, 'onMarkerContext'],
]

type IProps = {
  position?: L.ControlPosition
  draw?: L.Control.DrawOptions
  edit?: L.Control.EditOptions

  onCreated: (e: L.DrawEvents.Created) => void
  onMounted?: (e: L.Control.Draw) => void
} & Partial<IEventHandlers>

export function DrawControl(props: IProps) {
  const leafletCtx = useLeafletContext()
  const drawRef = useRef<L.Control.Draw | null>(null)
  const propsRef = useRef<IProps>(props)

  const onDrawCreate = ((e: L.DrawEvents.Created) => {
    const { onCreated } = props
    const container = leafletCtx.layerContainer || leafletCtx.map
    container.addLayer(e.layer)
    onCreated && onCreated(e)
  }) as LeafletEventHandlerFn

  useEffect(() => {
    const map = leafletCtx.map
    const drawControl = createDrawControl(props, leafletCtx)
    if (!drawControl) return

    drawRef.current = drawControl
    map.addControl(drawControl)

    for (const [type, key] of EVENT_HANDLERS) {
      if (props[key]) {
        map.on(type, props[key] as LeafletEventHandlerFn)
      }
    }
    map.on(L.Draw.Event.CREATED, onDrawCreate)
    props.onMounted?.(drawControl)

    return () => {
      drawRef.current?.remove()
      map.off(L.Draw.Event.CREATED, onDrawCreate)
      for (const [type, key] of EVENT_HANDLERS) {
        if (props[key]) {
          map.off(type, props[key] as LeafletEventHandlerFn)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      isEqual(props.draw, propsRef.current.draw) &&
      isEqual(props.edit, propsRef.current.edit) &&
      props.position === propsRef.current.position
    ) {
      return
    }
    const { map } = leafletCtx

    drawRef.current?.remove()
    const newDrawControl = createDrawControl(props, leafletCtx)
    if (!newDrawControl) return

    newDrawControl.addTo(map)
    drawRef.current = newDrawControl
    props.onMounted?.(newDrawControl)

    return () => {
      drawRef.current?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.draw, props.edit, props.position])

  return null
}

function createDrawControl(
  { draw, edit, position }: IProps,
  { layerContainer }: LeafletContextInterface,
) {
  if (!layerContainer) {
    console.warn('Unable to create draw element: layer container is null.')
    return null
  }

  const options: L.Control.DrawConstructorOptions = {
    edit: {
      ...edit,
      featureGroup: layerContainer as L.FeatureGroup,
    },
    ...(draw ?? null),
    ...(position ? { position } : null),
  }

  return new L.Control.Draw(options)
}
