import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";

import bodyParser from "body-parser";
const urlencodedParser = bodyParser.urlencoded({
  extended: true
});


// init app
export const app = express();

import * as http from "http";
const server = http.createServer(app);
import { Server as socketIO } from "socket.io";

export const io = new socketIO(server);

import routes from "./modules/controllers/routes.js";
//import posts from "./modules/controllers/posts.js";

import socketHandling from "./modules/socketConnection.js";

const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
});

app.use(sessionMiddleware);
io.use((socket, next) =>{
	sessionMiddleware(socket.request, socket.request.res || {}, next);
})

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");

routes();
//posts();

socketHandling();

const port = process.env.PORT || 9000;
server.listen(port, () => {
	if (process.env.NODE_ENV !== "production") {
		import ("localhost-logger").then(localLog => {
			localLog.default(port);
		})
	}
	console.log(`server is running on localhost:${port}`)
})