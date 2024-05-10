// import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
import type { Coordinates, IGeoAddressPart } from "@/DataTypes";
import { RateLimiter } from "limiter";

// https://developers.google.com/maps/documentation/geocoding/requests-geocoding#StatusCodes
enum GoogleMapsGeocoderStatusCode {
  Ok = "OK",
  ZeroResults = "ZERO_RESULTS",
  OverDailyLimit = "OVER_DAILY_LIMIT",
  OverQueryLimit = "OVER_QUERY_LIMIT",
  RequestDenied = "REQUEST_DENIED",
  InvalidRequest = "INVALID_REQUEST",
  Unknown = "UNKNOWN_ERROR",
}

type GoogleMapsGeocodeResponse = google.maps.GeocoderResponse & {
  status: GoogleMapsGeocoderStatusCode;
};

export interface IGeoAddress {
  key: string;
  address: string;
  coords: Coordinates;
  parts: IGeoAddressPart[];
}

type GeocodeCacheResult =
  | { ok: true; value: IGeoAddress[] }
  | { ok: false; error: Error };

class GeocoderClass {
  private readonly API_URL =
    "https://maps.googleapis.com/maps/api/geocode/json?";
  private readonly cache: Record<string, GeocodeCacheResult> = {};
  private readonly limiter = new RateLimiter({
    tokensPerInterval: 500,
    interval: "minute",
  });

  public async geocode(input: string): Promise<IGeoAddress[]> {
    const address = this.sanitizeAddress(input);
    const cacheCheck = this.cache[address];
    if (cacheCheck) {
      if (cacheCheck.ok) return cacheCheck.value;
      throw cacheCheck.error;
    }

    try {
      const value = await this.googleMapsRequest(address);
      this.cache[address] = { ok: true, value };
      return value;
    } catch (error) {
      this.cache[address] = { ok: false, error: error as Error };
      throw error;
    }
  }

  public sanitizeAddress(input: string): string {
    return input.trim().replace(/\r?\n|\r/g, "");
  }

  private async googleMapsRequest(input: string): Promise<IGeoAddress[]> {
    await this.limiter.removeTokens(1);

    const url =
      this.API_URL +
      new URLSearchParams({
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        address: input,
      }).toString();

    const response = await fetch(url);
    const json = await response.json();
    if (
      json.status === GoogleMapsGeocoderStatusCode.Ok ||
      json.status === GoogleMapsGeocoderStatusCode.ZeroResults
    ) {
      const jsonResponse = json as GoogleMapsGeocodeResponse;
      return jsonResponse.results.map((result) => ({
        key: input,
        address: result.formatted_address,
        coords: this.buildCoords(result.geometry.location),
        parts: result.address_components.map((component) => ({
          longName: component.long_name,
          shortName: component.short_name,
          types: component.types,
        })),
      }));
    }

    // TODO: include rest of JSON in error metadata
    throw new Error("Geocoder error: " + json.status);
  }

  private buildCoords(input: google.maps.LatLng): Coordinates {
    // Typings in the google-maps type-library doesn't match actual response
    return {
      lat: input.lat as unknown as number,
      lng: input.lng as unknown as number,
    };
  }
}

export const Geocoder = new GeocoderClass();
