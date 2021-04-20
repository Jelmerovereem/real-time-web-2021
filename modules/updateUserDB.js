import * as fs from "fs";

export default function updateUser(userData, socket) {
	const userId = socket.request.sessionID;
	try {
		if (fs.existsSync("users.json")) {
			let usersData = fs.readFileSync("users.json", {encoding: "utf-8"});
			if (usersData) {
				usersData = JSON.parse(usersData);
				const userIndex = usersData.findIndex(obj => obj.user === userData.user);
				if (userIndex != -1) {
					usersData[userIndex].visitedPages.push(userData.page);
					fs.writeFile("users.json", JSON.stringify(usersData), (err) => err ? console.log(err) : "")
				} else {
					usersData.push({
						user: userId,
						socketId: socket.id,
						visitedPages: [userData.page]
					})
					fs.writeFile("users.json", JSON.stringify(usersData), (err) => err ? console.log(err) : "")
				}
			} else {
				fs.writeFile("users.json", JSON.stringify([{
					user: userId,
					socketId: socket.id,
					visitedPages: [userData.page]
				}]), (err) => err ? console.log(err) : "")
			}
		} else {
			fs.writeFile("users.json", JSON.stringify([{
				user: userId,
				socketId: socket.id,
				visitedPages: [userData.page]
			}]), (err) => err ? console.log(err) : "")
		}
	} catch(err) {
		console.error(err);
	}
	return "ok";
}