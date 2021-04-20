const getColor = (live) => {
	return live > 0 ? "#4287f5" : "#FFEDA0";
}

const getGeoStyle = (feature) => {
	return {
		fillColor: getColor(feature.properties.liveCount),
		weight: 1,
		opacity: 1,
		color: "white",
		fillOpacity: 0.7
	}
} 

export { getColor, getGeoStyle };