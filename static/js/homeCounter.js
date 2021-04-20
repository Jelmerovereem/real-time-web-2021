import { socket } from "./main.js";

socket.on("usersConnected", (usersAmount) => {
	const connectedUsersEl = document.querySelector(".counter");
	connectedUsersEl.innerText = usersAmount;
})