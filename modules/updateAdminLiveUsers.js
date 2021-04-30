import { io }  from "../server.js";
import * as fs from "fs";
import * as path from "path";

export default async function updateAdminLiveUsers(connectedUsers) {
	const adminChannel = io.of("/adminChannel");
	const clients = io.sockets.sockets;
	fs.readFile(path.resolve("users.json"), {encoding: "utf-8"}, (err, result) => {
		if (err) {
			console.log(err)
		} else {
			let usersData = result;
			if (usersData) {
				usersData = JSON.parse(usersData);
				let liveUsers = [];
				clients.forEach((value, key, map) => {
					const sessionID = value.request.sessionID;
					const thisUser = usersData.find(obj => obj.user === sessionID);
					if (thisUser) {
						liveUsers.push(thisUser);
					}
				})
				adminChannel.emit("liveUsersData", liveUsers);
			}
		}
	})
}