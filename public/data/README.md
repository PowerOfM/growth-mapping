# GeoJSONs

## Tips
- Use [geojson.io](https://geojson.io) to visualize GeoJSON data
- Use the desktop app [QGIS](https://www.qgis.org/en/site/) to view and manipulate GeoJSON files


## City Boundaries
City boundaries are generally available directly from OpenStreetMap (OSM). There a few options to fetch this information.

### Overpass Turbo
- https://overpass-turbo.eu/
```
[out:json];

// Define Canada as the reference area
area["name"="Canada"]["admin_level"="2"]->.canada;
area["name"="British Columbia"]["admin_level"="4"]->.bc;

// Query relations for administrative boundaries for Vancouver, Burnaby, Richmond, and UBC within Canada
(
  relation["boundary"="administrative"]["name"="Vancouver"]["admin_level"="8"](area.bc);
  relation["boundary"="administrative"]["name"="Burnaby"]["admin_level"="8"](area.bc);
  relation["boundary"="administrative"]["name"="Richmond"]["admin_level"="8"](area.bc);
  relation["boundary"="administrative"]["name"="University Endowment Lands"](area.canada);
);

// Output the geometry (GeoJSON)
out body geom;
>;
out skel qt;
```


### Nominatim
1. Visit https://nominatim.openstreetmap.org
2. Input the name of city/region and hit search
3. Click the link in Data from _API request_
4. Append `&polygon_geojson=1` to the end of the URL
5. Copy the `geojson` section in the result

_Note: For some reason, OSM does not have the New Westminster city boundary_


### Polygon Extractor
1. Visit https://polygons.openstreetmap.fr
2. Enter the OSM Relation for the city/region (found from Nominatim or from the below chart)
3. Find the result that has a bit of smoothing (`params=0.000200-0.000200-0.000200`) and click the `GeoJSON` link

| City | OSM Relation ID | Link |
|--|--|--|
| Vancouver | 1852574 | [GeoJSON Link](https://polygons.openstreetmap.fr/get_geojson.py?id=1852574&params=0.000200-0.000200-0.000200)
| Burnaby | 2221119 | [GeoJSON Link](https://polygons.openstreetmap.fr/get_geojson.py?id=2221119&params=0.000200-0.000200-0.000200)
| Richmond | 2221097 | [GeoJSON Link](https://polygons.openstreetmap.fr/get_geojson.py?id=2221097&params=0.000200-0.000200-0.000200)
| New | 2221097 | [GeoJSON Link](https://polygons.openstreetmap.fr/get_geojson.py?id=2221097&params=0.000200-0.000200-0.000200)


### City Datasets
Each city usually has their own data table (hosted on an ArcGIS platform)

- Burnaby: https://data.burnaby.ca/datasets/d903b87782734451ae286cb0b59938ac_12/explore?location=49.138273%2C-122.940150%2C10.77
- New Westminster: https://data-60320-newwestcity.opendata.arcgis.com/datasets/d5aa66b57c514909bb0abfae9d516ce8_0/explore
    



## City Neighbourhoods
City Neighbourhoods are best found on the OpenData website for each city. You can find more info for other Metro-Vancouver cities on the [OSM wiki for Vancouver](https://wiki.openstreetmap.org/wiki/Vancouver). Similar resources should exist for other regions. 

- New Westminster: https://data-60320-newwestcity.opendata.arcgis.com/datasets/34dfd93c08194ca7bcec442ad7bb7016_0/explore
- Burnaby: https://data.burnaby.ca/datasets/burnaby::community-plan-area-boundaries-2/explore?location=49.272560%2C-122.994483%2C14.84
    + Malformed


## Other Useful Datasets
- Burnaby's map of Metro Vancouver: https://data.burnaby.ca/datasets/7d41ed6105a34e5c9f2f988a32894988_13/explore?location=49.234460%2C-123.111256%2C11.51
