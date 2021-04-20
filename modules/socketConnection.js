import { io }  from "../server.js";
import addUser from "./addUserDB.js";
import updateUser from "./updateUserDB.js";
import updateAdminLiveUsers from "./updateAdminLiveUsers.js";
import * as fs from "fs";
import geoip from "geoip-lite";

export default function socketHandling(req, res) {
	let adminChannel = io.of("/adminChannel");

	let connectedUsers = 0;
	io.on("connection", (socket) => {
		let liveUser = {};

		connectedUsers++;
		io.emit("usersConnected", connectedUsers);
		socket.on("disconnect", () => {
			liveUser.disconnected = true;
			setTimeout(() => {
				connectedUsers--;
				io.emit("usersConnected", connectedUsers);
				console.log("updating admin on user disconnect")
				updateAdminLiveUsers(connectedUsers);
			}, 10000)
		})

		socket.on("pageChange", async (userData) => {
			const sHeaders = socket.handshake.headers;
			const clientIp = socket.request.connection.remoteAddress;
			//console.log(clientIp);
			console.log(sHeaders['x-forwarded-for']);
			console.log(geoip.lookup(sHeaders['x-forwarded-for']))
			//const location = geoip.lookup(sHeaders['x-forwarded-for']);
			const location = geoip.lookup("77.167.183.59");
			userData.location = location;
			userData.socketId = socket.id;
			if (userData.userId) {
				liveUser = userData;
				liveUser.disconnected = false;
			}
			const response = await updateUser(userData, socket);
			if (response === "ok") {
				updateAdminLiveUsers(connectedUsers);
			}
			//adminChannel.emit("alertAdmin", userData);
		})
	})
	adminChannel.on("connection", (socket) => {
		updateAdminLiveUsers(connectedUsers)
	})
}