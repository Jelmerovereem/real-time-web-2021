const socket = io();
const userId = document.querySelector(`input[name="userId"]`).value;

socket.on("usersConnected", (usersAmount) => {
	const connectedUsersEl = document.querySelector(".counter");
	connectedUsersEl.innerText = usersAmount;
})

const userData = {
	page: location.pathname,
	userId
}

socket.emit("pageChange", userData);