function renderHome(req, res) {
	res.render("home.ejs", {
		userId: req.sessionID
	});
}

function renderAdmin(req, res) {
	res.render("admin.ejs");
}

export { renderHome, renderAdmin };