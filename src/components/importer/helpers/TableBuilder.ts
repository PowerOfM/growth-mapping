import type {
  FieldDefinition,
  ILocation,
  IRecord,
  ITable,
  ITableError,
} from '@/DataTypes'
import { Geocoder } from '@/lib/Geocoder'
import { LoggerBuilder } from '@/lib/Logger'

const FALLBACK_LOCATION: ILocation = {
  id: 'error',
  input: '',
  address: 'Unknown Address',
  coords: { lat: 49.2314375, lng: -123.1037624 },
  parts: [],
}
const STEP_UPDATE_DELAY = 500 // ms

export class TableBuilder {
  private log = LoggerBuilder.build('TableBuilder')

  private readonly locationsByAddress: Record<string, ILocation> = {}
  private readonly errors: ITableError[] = []
  private onStepCallback: (val: number) => void = () => {}
  private lastUpdate = -1

  constructor(
    private addressField: FieldDefinition,
    private labelField: FieldDefinition,
    private abortSignal: AbortSignal,
    private fallbackLocation: ILocation = FALLBACK_LOCATION,
    private stepUpdateDelay = STEP_UPDATE_DELAY,
  ) {}

  public async build(data: string[][]): Promise<ITable> {
    const headers = data[0]
    const records = []
    const len = data.length

    for (let i = 1; i < len; i++) {
      if (this.abortSignal.aborted) {
        break
      }

      const record = await this.processRow(i, data[i])
      records.push(record)
      this.updateStep(Math.floor((i / len) * 100))
    }

    return {
      id: crypto.randomUUID(),
      label: 'Table',
      records,
      locations: this.getLocationsById(),

      headers,
      addressField: this.addressField,
      labelField: this.labelField,

      errors: this.errors.length ? this.errors : undefined,
    }
  }

  /**
   * Register a callback that called when rows are processed
   */
  public onStep(callback: (val: number) => void) {
    this.onStepCallback = callback
  }

  private async processRow(index: number, row: string[]): Promise<IRecord> {
    const label = this.getField(this.labelField, row)
    const address = this.getField(this.addressField, row)
    const locationId = await this.getLocationId(index, address)

    return {
      id: crypto.randomUUID(),
      locationId,
      label,
      data: row,
    }
  }

  /**
   * Convert an address string into a IGeoAddress, or fallback to a default one.
   * Also store multiples if more than one result comes from the Geocoder
   */
  private async getLocationId(
    index: number,
    rawAddress: string,
  ): Promise<string> {
    const input = Geocoder.sanitizeAddress(rawAddress)
    try {
      const results = await Geocoder.geocode(input)
      if (!results.length) {
        throw new Error('No results from geocoder')
      }

      // Check if already assigned
      const address = results[0].address
      if (this.locationsByAddress[address]) {
        return this.locationsByAddress[address].id
      }

      // Build new location
      const location: ILocation = {
        id: crypto.randomUUID(),
        input,
        address,
        coords: results[0].coords,
        parts: results[0].parts,
      }
      if (results.length > 1) {
        location.options = results
      }
      this.locationsByAddress[address] = location
      return location.id
    } catch (error) {
      this.log.error('Unable to process address', rawAddress, error)
      this.errors.push({ index, error: error as Error, input })
      return this.buildFallbackLocationId()
    }
  }

  private buildFallbackLocationId(): string {
    if (!this.locationsByAddress[this.fallbackLocation.address]) {
      this.locationsByAddress[this.fallbackLocation.address] = {
        ...this.fallbackLocation,
      }
    }
    return this.fallbackLocation.id
  }

  /**
   * Build a field based on the FieldDefinition from a row of data
   */
  private getField(field: FieldDefinition, row: string[]): string {
    return field.reduce((acc, value) => {
      return acc + (typeof value === 'number' ? row[value] : value)
    }, '') as string
  }

  private getLocationsById() {
    return Object.keys(this.locationsByAddress).reduce(
      (acc, key) => {
        const location = this.locationsByAddress[key]
        acc[location.id] = location
        return acc
      },
      {} as Record<string, ILocation>,
    )
  }

  /**
   * Call `onStep` callback, with some throttling
   */
  private updateStep(progress: number) {
    if (Date.now() - this.lastUpdate > this.stepUpdateDelay) {
      this.lastUpdate = Date.now()
      this.onStepCallback(progress)
    }
  }
}
