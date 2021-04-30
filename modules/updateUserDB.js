import * as fs from "fs";

export default function updateUser(userData, socket) {
	const userId = socket.request.sessionID;
	try {
		if (fs.existsSync("users.json")) {
			let usersData = fs.readFileSync("users.json", {encoding: "utf-8"});
			if (usersData) {
				usersData = JSON.parse(usersData);
				const userIndex = usersData.findIndex(obj => obj.user === userData.user);
				if (userIndex != -1) { // user does exists
					if (userData.cartData) {
						usersData[userIndex].cartData = userData.cartData;
					}
					if (userData.page) {
						usersData[userIndex].visitedPages.push(userData.page);
					}
					fs.writeFile("users.json", JSON.stringify(usersData), (err) => err ? console.log(err) : "")
				} else {
					if (userData.cartData) {
						usersData.push({
							user: userId,
							socketId: socket.id,
							visitedPages: [userData.page],
							location: userData.location,
							cartData: userData.cartData
						})	
					} else if (userData.page) {
						usersData.push({
							user: userId,
							socketId: socket.id,
							visitedPages: [userData.page],
							location: userData.location
						})
					}
					fs.writeFile("users.json", JSON.stringify(usersData), (err) => err ? console.log(err) : "")
				}
			} else {
				let data = [];
				if (userData.cartData) {
					data.push({
						user: userId,
						socketId: socket.id,
						visitedPages: [userData.page],
						location: userData.location,
						cartData: userData.cartData
					})
				} else if (userData.page) {
					data.push({
						user: userId,
						socketId: socket.id,
						visitedPages: [userData.page],
						location: userData.location
					})
				}
				fs.writeFile("users.json", JSON.stringify(data), (err) => err ? console.log(err) : "")
			}
		} else {
			let data = [];
			if (userData.cartData) {
				data.push({
					user: userId,
					socketId: socket.id,
					visitedPages: [userData.page],
					location: userData.location,
					cartData: userData.cartData
				})
			} else if (userData.page) {
				data.push({
					user: userId,
					socketId: socket.id,
					visitedPages: [userData.page],
					location: userData.location
				})
			}
			fs.writeFile("users.json", JSON.stringify(data), (err) => err ? console.log(err) : "")
		}
	} catch(err) {
		console.error(err);
	}
	return "ok";
}