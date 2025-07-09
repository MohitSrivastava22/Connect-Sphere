const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require("bcryptjs");
const { Server } = require("socket.io");
const connectDB = require('./config/db');
const userRouter = require('./routes/userRouter');
const chatRouter = require('./routes/chatRouter');
const messageRouter = require('./routes/messageRouter');
const User = require('./Models/userModel');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello your first server");
});

app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);


//////////Deployment code //////////
// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname1, "/frontend/build")));

//     app.get("*", (req, res) =>
//         res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//     );
// } else {
//     app.get("/", (req, res) => {
//         res.send("API is running..");
//     });
// }
//////////////Deployment code //////////

const createGuestUser = async () => {
    const existing = await User.findOne({ email: "xyza@gmail.com" });
    if (!existing) {
        await User.create({
            name: "Guest User",
            email: "xyza@gmail.com",
            password: "123456789",
            pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        });
        console.log("Guest user created");
    } else {
        console.log("Guest user already exists");
    }
};

const startServer = async () => {
    await createGuestUser();
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Connected to socket.io");

        socket.on("setup", (user) => {
            if (!user || !user.id) return;
            socket.join(user.id);
            socket.emit("connected");
        });

        socket.on("join chat", (room) => socket.join(room));

        socket.on("new message", (newMessageReceived) => {
            const chat = newMessageReceived.chat;
            if (!chat || !chat.user) return;

            chat.user.forEach(users => {
                if (users._id === newMessageReceived.sender._id) return;
                socket.in(users._id).emit("message received", newMessageReceived);
            });
        });

        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    });
};

startServer();
//Done