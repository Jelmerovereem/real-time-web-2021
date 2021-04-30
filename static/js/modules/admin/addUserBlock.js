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
			if (userData.location.city === "") { // als de locatie geen stadsnaam heeft, krijg een stadsnaam via api
				const city = await getCityname({
					lat: userData.location.ll[0],
					lng: userData.location.ll[1]
				})
				userData.location.city = city;
			}
			const existingUser = document.querySelector(`[data-userid="${userData.user}"]`);
			if (!existingUser) { // als die niet al op de pagina bestaat
				//const liveIndex = liveUsers.findIndex(obj => obj.user === existingUser.)
				/* Maak een element aan voor de user */
				const ElContainer = document.createElement("div");
				ElContainer.classList.add("userContainer");
				ElContainer.dataset.userid = userData.user;
				ElContainer.dataset.location = userData.location.city;
				
				const userTitle = document.createElement("h3");
				userTitle.textContent = userData.user;
				ElContainer.append(userTitle);
				
				const visitedPagesUl = document.createElement("ul");
				visitedPagesUl.classList.add("visitedPagesList");
				userData.visitedPages.forEach(page => {
					const liHtml = document.createElement("li");
					liHtml.textContent = page;
					visitedPagesUl.append(liHtml);
				})
				ElContainer.append(visitedPagesUl);

				if (userData.cartData) {
					const cartDataEl = document.createElement("ul");
					const cartDataTitle = `<p>Add to carts</p>`;
					cartDataEl.classList.add("cartDataList");
					userData.cartData.forEach(product => {
						const liHtml = document.createElement("li");
						liHtml.textContent = product.productName;
						cartDataEl.append(liHtml);
					})
					ElContainer.append(cartDataEl);
					cartDataEl.insertAdjacentHTML("beforebegin", cartDataTitle);
				}
				
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
			} else { // user bestaat al wel op pagina
				const liveIndex = liveUsers.findIndex(obj => obj.user === existingUser.dataset.userid);
				if (liveIndex != -1) { // user is nog steeds live

					const visitedPagesList = existingUser.querySelector(".visitedPagesList");
					visitedPagesList.innerHTML = "";
					userData.visitedPages.forEach(page => {
						const liHtml = document.createElement("li");
						liHtml.textContent = page;
						visitedPagesList.append(liHtml);
					})
					
					const cartDataList = existingUser.querySelector(".cartDataList");
					if (userData.cartData && !cartDataList) { // als er wel cartdata is maar nog niet op pagina
						const cartDataEl = document.createElement("ul");
						const cartDataTitle = `<p>Add to carts</p>`;
						cartDataEl.classList.add("cartDataList");
						userData.cartData.forEach(product => {
							const liHtml = document.createElement("li");
							liHtml.textContent = product.productName;
							cartDataEl.append(liHtml);
						})
						existingUser.append(cartDataEl);
						cartDataEl.insertAdjacentHTML("beforebegin", cartDataTitle);
					} else if (cartDataList) { // als al wel cartdata is en ookal op pagina
						cartDataList.innerHTML = "";
						if (userData.cartData) {
							userData.cartData.forEach(product => {
								const liHtml = document.createElement("li");
								liHtml.textContent = product.productName;
								cartDataList.append(liHtml);
							})
						}
					}
				} else { // als user niet meer live is maar wel op de pagina
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

		/* remove user that aren't live but on page */
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
	} else { // als er geen live users zijn
		geojson.eachLayer((layer) => {
			layer.setStyle({
				fillColor: "#FFEDA0"
			})
		})
		liveUsersContainer.innerHTML = "";
		counter.textContent = 0;
	}
}