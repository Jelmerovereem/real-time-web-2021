import * as fs from "fs";

function renderHome(req, res) {
	res.render("home.ejs", {
		userId: req.sessionID
	});
}

function renderCollectionpage(req, res) {
	const collection = req.url.replace("/", "");
	let collectionData = fs.readFileSync(`${collection}.json`, {encoding: "utf-8"});
	if (collectionData) {
		collectionData = JSON.parse(collectionData);
		res.render("collectionPage.ejs", {
			userId: req.sessionID,
			collection,
			collectionData
		})
	}
}

function renderProductpage(req, res) {
	const productId = req.params.id;
	let collectionData = fs.readFileSync("shirts.json", {encoding: "utf-8"});
	collectionData = JSON.parse(collectionData);
	const productData = collectionData.find(obj => obj.name === productId);
	res.render("productPage.ejs", {
		userId: req.sessionID,
		productData
	})
}

function renderSecondPage(req, res) {
	res.render("secondPage.ejs", {
		userId: req.sessionID
	})
}

function renderAdmin(req, res) {
	res.render("admin.ejs");
}

export { renderHome, renderCollectionpage, renderProductpage, renderSecondPage, renderAdmin };