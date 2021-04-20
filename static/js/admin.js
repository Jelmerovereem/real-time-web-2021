import updateUserEls from "./modules/admin/addUserBlock.js";
const adminSocket = io("/adminChannel");

adminSocket.on("amountLiveUsers", (connectedUsers) => {
	const amountLiveUsersEl = document.querySelector(".counter");
	amountLiveUsersEl.innerText = connectedUsers;
})


adminSocket.on("liveUsersData", (liveUsers) => {
	updateUserEls(liveUsers);
})