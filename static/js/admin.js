const adminSocket = io("/adminChannel");

adminSocket.on("alertAdmin", (userData) => {
	const panel = document.querySelector(".panel");
	const value = `user ${userData.userId} navigated to ${userData.page}`;
	const textEl = document.createElement("p");
	textEl.textContent = value;
	panel.append(textEl);
})