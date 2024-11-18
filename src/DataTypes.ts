export type Coordinates = { lat: number; lng: number }
export type FieldDefinition = (string | number)[]

export interface IGeoAddressPart {
  /**
   * The full text of the address component
   */
  longName: string
  /**
   * The abbreviated, short text of the given address component
   */
  shortName: string
  /**
   * An array of strings denoting the type of address part
   * Google: https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes
   */
  types: string[]
}

export interface IGeoAddress {
  address: string
  coords: Coordinates
  parts: IGeoAddressPart[]
}

export interface ILocation extends IGeoAddress {
  id: string
  input: string
  options?: IGeoAddress[]
}

export interface IRecord {
  id: string
  locationId: string
  label: string
  data: string[]
}

export interface ITableError {
  index: number
  error: Error | string
  input?: string
}

export interface ITable {
  id: string
  label: string
  records: IRecord[]
  locations: Record<string, ILocation>

  headers: string[]
  addressField: FieldDefinition
  labelField: FieldDefinition

  errors?: ITableError[]
}

export interface ICollection {
  id: string
  label: string
  tables: ITable[]
}

export interface IManagedCollection extends ICollection {
  isNew?: boolean
}
