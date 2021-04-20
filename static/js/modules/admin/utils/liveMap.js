import { netherlandsTownshipsGeoJSON } from "./netherlandsTownships.js";
import { getColor, getGeoStyle } from "../geoStyle.js";

const mapboxAccessToken = "pk.eyJ1IjoiamVsbWVyb3ZlcmVlbSIsImEiOiJja2c3MDVoaTkwMm1sMnVwbThzMXhudTZxIn0.dSnLS_yVbd3-BkeOiEpvYw";
const apiMapboxUrlRaster = `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`;
const apiMapboxUrlVector = ``;

const liveMap = L.map("liveMap", {zoomControl: true}).setView([52.2351,5.2294], 5);
L.tileLayer(apiMapboxUrlRaster, {
	id: "mapbox/light-v9",
	tileSize: 512,
	zoomOffset: -1,
	accessToken: mapboxAccessToken
}).addTo(liveMap);

let geojson = L.geoJson(netherlandsTownshipsGeoJSON, {style: getGeoStyle}).addTo(liveMap);

export { liveMap, geojson };