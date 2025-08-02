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
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
        console.log(`Aaaayy me escribieron :v : ${msg}`);
    });
    socket.on('disconnect', () => {
        console.log("A user has disconnected")
    });
});

nunjucks.configure('src/app/Views', {
    autoescape: true,
    express: app,
    watch: true,
    noCache: true
});

const directory = path.dirname(fileURLToPath(import.meta.url));
const _route = directory.substring(0, directory.indexOf('src\\server'));
const route = path.join(_route, 'public');
app.use(express.static(route));


/**
 * Create Dinamic routes
 */
Routes.filter(route => route.method === 'get').forEach(route => {
    app.get(route.uri, route.callback);
});
Routes.filter(route => route.method === 'post').forEach(route => {
    app.post(route.uri, route.callback);
});

server.listen(port, () => {
    console.log(`chismecito-chat app listening on port ${port}`)
});

