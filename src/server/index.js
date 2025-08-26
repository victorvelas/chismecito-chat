import express from "express";
import { Routes } from "../routes/web.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from "node:http";
import { Server } from "socket.io";
import nunjucks from "nunjucks";

const port = process.env.PORT ?? 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log("A user has coneected");
    socket.on('chat message', (content) => {
        const _msgs = content.messages.map((msg) => {
            if (msg.type === 'image') {
                msg.content = `data:${msg.metadata.contentType};base64,${msg.content.toString('base64')}`;
            }
            return msg;
        });
        io.emit('chat message', {
            user: content.user,
            msg:_msgs
        })
    });
    socket.on('disconnect', () => {
        console.log("A user has disconnected")
    });

    socket.on("new user", uname => {
        io.emit("new user", uname);
    });
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));
nunjucks.configure(path.resolve(__dirname, "../app/Views"), {
    autoescape: true,
    express: app,
    watch: true,
    noCache: true
});
app.set("view engine", "njk");

const directory = path.dirname(fileURLToPath(import.meta.url));
const _route = directory.substring(0, directory.indexOf('src\\server'));
const route = path.join(_route, 'public');
app.use(express.static(route));


/**
 * Create Dinamic routes
 */
Routes.forEach(route => {
    app[route.method](route.uri, route.callback);
});

export default server; //

/* server.listen(port, () => {
    console.log(`chismecito-chat app listening on http://localhost:${port}`)
}); */

