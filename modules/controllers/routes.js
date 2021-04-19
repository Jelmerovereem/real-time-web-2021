import { app } from "../../server.js";
import { renderHome, renderAdmin } from "./renders.js";

export default function routes() {
	app
		.get("/", renderHome)
		.get("/admin", renderAdmin)
		.get("/*", () => {})
}