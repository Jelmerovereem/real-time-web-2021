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
			}, 5000)
		})

		socket.on("pageChange", async (userData) => {
			const sHeaders = socket.handshake.headers;
			const location = geoip.lookup(sHeaders['x-forwarded-for']);
			if (location) {
				userData.location = location;
			} else {
				userData.location = {
					city: "Amsterdam"
				}
			}
			userData.socketId = socket.id;
			if (userData.user) {
				liveUser = userData;
				liveUser.disconnected = false;
			}
			const response = await updateUser(userData, socket);
			if (response === "ok") {
				updateAdminLiveUsers(connectedUsers);
			}
			//adminChannel.emit("alertAdmin", userData);
		})

		socket.on("addToCart", async (data) => {
			liveUser.cartData = data.cartData;
			delete liveUser.page;
			const response = await updateUser(liveUser, socket);
			if (response === "ok") {
				updateAdminLiveUsers(connectedUsers);
			}
		})
	})
	adminChannel.on("connection", (socket) => {
		updateAdminLiveUsers(connectedUsers)
	})
}