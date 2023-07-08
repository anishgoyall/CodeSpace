const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    }
});

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const users = [];

const addUser = ({ socketId, username, roomId }) => {
    username = username.trim();
    const user = { socketId, username, roomId };
    users.push(user);
    return user;
};

const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) return users.splice(index, 1)[0];
};

const findUser = (socketId) => users.find((user) => user.socketId === socketId);
const usersInRoom = (roomId) => users.filter((user) => user.roomId === roomId);

io.on("connection", (socket) => {
    console.log("connected", socket.id);
    socket.on("JOIN", ({ roomId, username }) => {
        const user = addUser({ socketId: socket.id, username, roomId });
        socket.join(user.roomId);

        socket.broadcast.to(user.roomId).emit("TOAST-NOTIFICATION", {
            text: `${user.username[0].toUpperCase() + user.username.slice(1)} Joined`,
            type: "Join",
        });

        io.to(user.roomId).emit("ROOM-DATA-CHANGE", {
            roomId: user.roomId,
            users: usersInRoom(user.roomId),
        });
    });

    socket.on("CODE-CHANGE", (code) => {
        const user = findUser(socket.id);
        if (user && user.roomId) {
            socket.broadcast.to(user.roomId).emit("CODE-CHANGE", code);
        }
    });

    socket.on("LANGUAGE-CHANGE", (language) => {
        const user = findUser(socket.id);
        if (user && user.roomId) {
            socket.broadcast.to(user.roomId).emit("LANGUAGE-CHANGE", language);
        }
    });

    socket.on("THEME-CHANGE", (theme) => {
        const user = findUser(socket.id);
        if (user && user.roomId) {
            socket.broadcast.to(user.roomId).emit("THEME-CHANGE", theme);
        }
    });

    socket.on("INPUT-CHANGE", (input) => {
        const user = findUser(socket.id);
        if (user && user.roomId) {
            socket.broadcast.to(user.roomId).emit("INPUT-CHANGE", input);
        }
    });

    socket.on("OUTPUT-CHANGE", (output) => {
        const user = findUser(socket.id);
        if (user && user.roomId) {
            socket.broadcast.to(user.roomId).emit("OUTPUT-CHANGE", output);
        }
    });

    socket.on("MESSAGE-CHANGE", ({ message, currUser }) => {
        const user = findUser(socket.id);
        if (user && user.roomId) {
            socket.broadcast.to(user.roomId).emit("MESSAGE-CHANGE", { message, currUser });
            socket.broadcast.to(user.roomId).emit("TOAST-NOTIFICATION", {
                text: `Message from ${currUser[0].toUpperCase() + currUser.slice(1)}`,
                type: "Message",
            });
        }
    });

    socket.on("ROOM-LEAVE", () => {
        const user = removeUser(socket.id);
        if (user && user.roomId) {
            socket.broadcast.to(user.roomId).emit("ROOM-DATA-CHANGE", {
                roomId: user.roomId,
                users: usersInRoom(user.roomId),
            });
            socket.broadcast.to(user.roomId).emit("TOAST-NOTIFICATION", {
                text: `${user.username[0].toUpperCase() + user.username.slice(1)} Left`,
                type: "Leave",
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("User has disconnected");
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.roomId).emit("ROOM-DATA-CHANGE", {
                roomId: user.roomId,
                users: usersInRoom(user.roomId),
            });
            io.to(user.roomId).emit("TOAST-NOTIFICATION", {
                text: `${user.username[0].toUpperCase() + user.username.slice(1)} Left`,
                type: "Leave",
            });
        }
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));