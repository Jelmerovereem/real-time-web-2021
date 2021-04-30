export const socket = io();
export const userId = document.querySelector(`input[name="userId"]`).value;

const userData = {
	page: location.pathname,
	user: userId
}

socket.emit("pageChange", userData);