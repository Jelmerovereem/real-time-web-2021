export const socket = io();
const userId = document.querySelector(`input[name="userId"]`).value;

const userData = {
	page: location.pathname,
	user: userId
}

socket.emit("pageChange", userData);