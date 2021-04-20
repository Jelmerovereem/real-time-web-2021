const liveUsersContainer = document.querySelector(".liveUsersContainer");
const counter = document.querySelector(".counter");
import { liveMap, geojson } from "./utils/liveMap.js";
import { netherlandsTownshipsGeoJSON } from "./utils/netherlandsTownships.js";
import { getColor, getGeoStyle } from "./geoStyle.js";

async function getCityname({lat, lng}) {
	const data = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=cea58401476840878649fc802786d6f4`).then(res => res.ok ? res.json() : "");
	const city = data.results[0].components.city;
	return city;
}

export default function updateUserEls(liveUsers) {
	if (liveUsers.length > 0) { // als er live users zijn
		counter.textContent = liveUsers.length;
		const correctUsers = liveUsers.filter((v,i,a) => a.findIndex(t=>(t.user === v.user))===i); // filter duplicate users
		counter.textContent = correctUsers.length;
		liveUsers.forEach( async userData => {
			if (userData.location.city === "") {
				const city = await getCityname({
					lat: userData.location.ll[0],
					lng: userData.location.ll[1]
				})
				userData.location.city = city;
			}
			const existingUser = document.querySelector(`[data-userid="${userData.user}"]`);
			if (!existingUser) { // als die niet bestaat
				//const liveIndex = liveUsers.findIndex(obj => obj.user === existingUser.)
				const ElContainer = document.createElement("div");
				ElContainer.classList.add("userContainer");
				ElContainer.dataset.userid = userData.user;
				ElContainer.dataset.location = userData.location.city;
				const userTitle = document.createElement("h3");
				const visitedPagesUl = document.createElement("ul");
				userData.visitedPages.forEach(page => {
					const liHtml = document.createElement("li");
					liHtml.textContent = page;
					visitedPagesUl.append(liHtml);
				})
				userTitle.textContent = userData.user;
				ElContainer.append(userTitle);
				ElContainer.append(visitedPagesUl);
				liveUsersContainer.append(ElContainer);

				// light up blue on map
				geojson.eachLayer((layer) => {
					if (layer.feature.properties.name === userData.location.city) {
						if (layer.feature.properties.liveCount) {
							layer.feature.properties.liveCount++;
						} else {
							layer.feature.properties.liveCount = 1;
						}
						layer.setStyle({
							fillColor: getColor(layer.feature.properties.liveCount)
						})
					}
				})
			} else {
				const liveIndex = liveUsers.findIndex(obj => obj.user === existingUser.dataset.userid);
				if (liveIndex != -1) {
					const visitedPagesList = existingUser.querySelector("ul");
					visitedPagesList.innerHTML = "";
					userData.visitedPages.forEach(page => {
						const liHtml = document.createElement("li");
						liHtml.textContent = page;
						visitedPagesList.append(liHtml);
					})
				} else {
					geojson.eachLayer((layer) => {
						if (layer.feature.properties.name === existingUser.dataset.location) {
							if (layer.feature.properties.liveCount) {
								layer.feature.properties.liveCount--;
							}
							layer.setStyle({
								fillColor: getColor(layer.feature.properties.liveCount)
							})
						}
					})
					existingUser.remove();
				}
			}
		})

		const allUserElements = document.querySelectorAll(".userContainer");
		allUserElements.forEach(el => {
			const elLiveIndex = liveUsers.findIndex(obj => obj.user === el.dataset.userid);
			if (elLiveIndex === -1) {
				geojson.eachLayer((layer) => {
					if (layer.feature.properties.name === el.dataset.location) {
						if (layer.feature.properties.liveCount) {
							layer.feature.properties.liveCount--;
						}
						layer.setStyle({
							fillColor: getColor(layer.feature.properties.liveCount)
						})
					}
				})
				el.remove()
			}
		})
	} else {
		geojson.eachLayer((layer) => {
			layer.setStyle({
				fillColor: "#FFEDA0"
			})
		})
		liveUsersContainer.innerHTML = "";
		counter.textContent = 0;
	}
}