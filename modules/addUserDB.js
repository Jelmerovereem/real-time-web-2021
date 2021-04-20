import * as fs from "fs";

export default function addUser(socket) {
	const userId = socket.request.sessionID;
	let usersData = fs.readFileSync("users.json", {encoding: "utf-8"});
	if (usersData) {
		usersData = JSON.parse(usersData);
		const userObjectIndex = usersData.findIndex(obj => obj.user === userId);
		if (userObjectIndex != -1) {
			console.log("bestaat al")
		} else {
			usersData.push({
				user: userId,
				socketId: socket.id,
				visitedPages: []
			})
			fs.writeFileSync("users.json", JSON.stringify(usersData), (err) => {
				if (err) console.log(err)
			})
		}
	} else {
		fs.writeFileSync("users.json", JSON.stringify([{user: userId, socketId: socket.id, visitedPages: []}]), (err) => {
			if (err) console.log(err)
		})
	}
}