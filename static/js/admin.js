import updateUserEls from "./modules/admin/addUserBlock.js";
import { liveMap } from "./modules/admin/utils/liveMap.js";
const adminSocket = io("/adminChannel");

adminSocket.on("amountLiveUsers", (connectedUsers) => {
	const amountLiveUsersEl = document.querySelector(".counter");
	amountLiveUsersEl.innerText = connectedUsers;
})


adminSocket.on("liveUsersData", (liveUsers) => {
	updateUserEls(liveUsers);
})