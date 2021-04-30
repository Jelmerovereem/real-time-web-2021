import { app } from "../../server.js";
import { renderHome, renderCollectionpage, renderProductpage, renderSecondPage, renderAdmin } from "./renders.js";

export default function routes() {
	app
		.get("/", renderHome)
		.get("/shirts", renderCollectionpage)
		.get("/product/:id", renderProductpage)
		.get("/secondPage", renderSecondPage)
		.get("/admin", renderAdmin)
		.get("/*", () => {})
}