function renderHome(req, res) {
	res.render("home.ejs", {
		userId: req.sessionID
	});
}

function renderSecondPage(req, res) {
	res.render("secondPage.ejs", {
		userId: req.sessionID
	})
}

function renderAdmin(req, res) {
	res.render("admin.ejs");
}

export { renderHome, renderSecondPage, renderAdmin };