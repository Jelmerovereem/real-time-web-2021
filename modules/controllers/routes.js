import { app } from "../../server.js";
import { renderHome, renderSecondPage, renderAdmin } from "./renders.js";

export default function routes() {
	app
		.get("/", renderHome)
		.get("/secondPage", renderSecondPage)
		.get("/admin", renderAdmin)
		.get("/*", () => {})
}