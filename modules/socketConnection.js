import { io }  from "../server.js";

export default function socketHandling() {
	let adminChannel = io.of("/adminChannel");

	let connectedUsers = 0;
	io.on("connection", (socket) => {
		connectedUsers++;
		io.emit("usersConnected", connectedUsers);
		socket.on("disconnect", () => {
			connectedUsers--;
			io.emit("usersConnected", connectedUsers);
		})

		socket.on("pageChange", (userData) => {
			userData.socketID = socket.id;
			console.log(`user: ${userData.userId} and ${userData.socketID} went to ${userData.page}`);
			adminChannel.emit("alertAdmin", userData);
		})
	})
}